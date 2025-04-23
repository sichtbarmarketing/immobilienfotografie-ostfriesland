import { SENDGRID_API_KEY } from "@/app/config"

type EmailParams = {
  to: string
  subject: string
  body: string
  html?: string
}

export async function sendEmail({ to, subject, body, html }: EmailParams): Promise<void> {
  if (!SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not defined")
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: "noreply@sichtbar.immo", name: "Sichtbar.immo Kontaktformular" },
      subject,
      content: [{ type: "text/plain", value: body }, ...(html ? [{ type: "text/html", value: html }] : [])],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("SendGrid API error:", errorText)
    throw new Error("Failed to send email")
  }
}
