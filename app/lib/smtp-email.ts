type SMTPEmailParams = {
  to: string
  subject: string
  body: string
  html?: string
}

export async function sendSMTPEmail({ to, subject, body, html }: SMTPEmailParams): Promise<void> {
  console.log("=== SMTP EMAIL CLIENT START ===")
  console.log("SendSMTPEmail function called with:", { to, subject, hasHtml: !!html })

  try {
    // Call our API route that handles SMTP with Node.js runtime
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        body,
        html,
      }),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      console.error("SMTP API error:", result.message)
      throw new Error(result.message || "E-Mail konnte nicht gesendet werden")
    }

    console.log("Email sent successfully via SMTP API:", result.messageId)
    console.log("=== SMTP EMAIL CLIENT SUCCESS ===")
  } catch (error) {
    console.error("Error in sendSMTPEmail function:", error)
    console.log("=== SMTP EMAIL CLIENT ERROR ===")
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
