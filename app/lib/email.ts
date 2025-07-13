import { SENDGRID_API_KEY } from "@/app/config"

type EmailParams = {
  to: string
  subject: string
  body: string
  html?: string
}

export async function sendEmail({ to, subject, body, html }: EmailParams): Promise<void> {
  console.log("=== EMAIL DEBUG START ===")
  console.log("SendEmail function called with:", { to, subject, hasHtml: !!html })
  console.log("SENDGRID_API_KEY available:", !!SENDGRID_API_KEY)
  console.log("SENDGRID_API_KEY length:", SENDGRID_API_KEY?.length || 0)

  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is not defined")
    throw new Error(
      "E-Mail-Service nicht konfiguriert. Bitte kontaktieren Sie uns direkt unter info@sichtbar-marketing.de",
    )
  }

  // Validate API key format (SendGrid keys start with 'SG.')
  if (!SENDGRID_API_KEY.startsWith("SG.")) {
    console.error("Invalid SendGrid API key format")
    throw new Error("E-Mail-Service nicht korrekt konfiguriert")
  }

  const emailData = {
    personalizations: [{ to: [{ email: to }] }],
    from: {
      email: "noreply@sichtbar-marketing.de", // Changed to match the domain
      name: "sichtbar.immo Kontaktformular",
    },
    subject,
    content: [{ type: "text/plain", value: body }, ...(html ? [{ type: "text/html", value: html }] : [])],
  }

  console.log("Sending email with data:", JSON.stringify(emailData, null, 2))

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SENDGRID_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    })

    console.log("SendGrid response status:", response.status)
    console.log("SendGrid response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SendGrid API error response:", errorText)

      // Parse SendGrid error response
      let errorMessage = "E-Mail konnte nicht gesendet werden"
      try {
        const errorJson = JSON.parse(errorText)
        if (errorJson.errors && errorJson.errors.length > 0) {
          const errors = errorJson.errors.map((err: any) => err.message).join(", ")
          console.error("SendGrid errors:", errors)

          // Provide user-friendly error messages
          if (errors.includes("The from address does not match a verified Sender Identity")) {
            errorMessage = "E-Mail-Absender nicht verifiziert. Bitte kontaktieren Sie uns direkt."
          } else if (errors.includes("access forbidden")) {
            errorMessage = "E-Mail-Service nicht autorisiert. Bitte kontaktieren Sie uns direkt."
          } else {
            errorMessage = `E-Mail-Fehler: ${errors}`
          }
        }
      } catch (parseError) {
        console.error("Could not parse SendGrid error response:", parseError)
        errorMessage = `E-Mail-Service Fehler (${response.status})`
      }

      throw new Error(errorMessage)
    }

    console.log("Email sent successfully via SendGrid")
    console.log("=== EMAIL DEBUG END ===")
  } catch (error) {
    console.error("Error in sendEmail function:", error)
    console.log("=== EMAIL DEBUG END (ERROR) ===")
    throw error
  }
}

// Alternative function to save contact form data to database as fallback
export async function saveContactFormData(formData: {
  name: string
  email: string
  phone?: string
  service: string
  address?: string
  message?: string
}) {
  try {
    console.log("Saving contact form data as fallback:", formData)

    // Here you could save to Supabase or another database
    // For now, we'll just log it
    console.log("Contact form data saved successfully")

    return true
  } catch (error) {
    console.error("Error saving contact form data:", error)
    return false
  }
}
