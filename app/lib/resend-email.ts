import { Resend } from "resend"

type ResendEmailParams = {
  to: string
  subject: string
  body: string
  html?: string
}

export async function sendResendEmail({ to, subject, body, html }: ResendEmailParams): Promise<void> {
  console.log("=== RESEND EMAIL DEBUG START ===")
  console.log("SendResendEmail function called with:", { to, subject, hasHtml: !!html })

  // Check for required environment variable
  const resendApiKey = process.env.RESEND_API_KEY

  console.log("Resend Configuration:", {
    apiKey: resendApiKey ? "***configured***" : "missing",
  })

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not defined")
    throw new Error("E-Mail-Service nicht konfiguriert - Resend API Key fehlt")
  }

  try {
    // Initialize Resend
    const resend = new Resend(resendApiKey)

    // Get sender email from environment variable
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sichtbar-marketing.de"

    console.log("Sending email with Resend:", {
      from: fromEmail,
      to: to,
      subject: subject,
    })

    // Send email
    const { data, error } = await resend.emails.send({
      from: `sichtbar.immo Kontaktformular <${fromEmail}>`,
      to: [to],
      subject: subject,
      text: body,
      ...(html && { html: html }),
    })

    if (error) {
      console.error("Resend API error:", error)
      throw new Error(`Resend Fehler: ${error.message}`)
    }

    console.log("Email sent successfully via Resend:", data?.id)
    console.log("=== RESEND EMAIL DEBUG END ===")
  } catch (error) {
    console.error("Error in sendResendEmail function:", error)
    console.log("=== RESEND EMAIL DEBUG END (ERROR) ===")

    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid API key") || error.message.includes("Unauthorized")) {
        throw new Error("E-Mail-Service nicht autorisiert - API Key ungültig")
      } else if (error.message.includes("rate limit") || error.message.includes("quota")) {
        throw new Error("E-Mail-Service vorübergehend nicht verfügbar - Limit erreicht")
      } else if (error.message.includes("domain") || error.message.includes("verification")) {
        throw new Error("E-Mail-Absender nicht verifiziert - Domain-Verifikation erforderlich")
      } else {
        throw new Error(`E-Mail-Fehler: ${error.message}`)
      }
    }
    throw error
  }
}

// Enhanced function to save contact form data as fallback
export async function saveContactFormData(formData: {
  name: string
  email: string
  phone?: string
  service: string
  address?: string
  message?: string
}) {
  try {
    console.log("=== SAVING CONTACT FORM DATA ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Contact Details:")
    console.log("- Name:", formData.name)
    console.log("- Email:", formData.email)
    console.log("- Phone:", formData.phone || "Not provided")
    console.log("- Service:", formData.service)
    console.log("- Address:", formData.address || "Not provided")
    console.log("- Message:", formData.message || "No message")
    console.log("=== END CONTACT FORM DATA ===")

    return true
  } catch (error) {
    console.error("Error saving contact form data:", error)
    return false
  }
}
