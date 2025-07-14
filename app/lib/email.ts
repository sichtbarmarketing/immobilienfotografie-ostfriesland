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

  if (!SENDGRID_API_KEY) {
    console.error("SENDGRID_API_KEY is not defined")
    throw new Error("E-Mail-Service nicht konfiguriert")
  }

  // Validate API key format (SendGrid keys start with 'SG.')
  if (!SENDGRID_API_KEY.startsWith("SG.")) {
    console.error("Invalid SendGrid API key format")
    throw new Error("E-Mail-Service nicht korrekt konfiguriert")
  }

  const emailData = {
    personalizations: [{ to: [{ email: to }] }],
    from: {
      email: "noreply@sichtbar-marketing.de",
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
          if (errors.includes("Maximum credits exceeded")) {
            errorMessage = "E-Mail-Service vorübergehend nicht verfügbar (Kontingent überschritten)"
          } else if (errors.includes("The from address does not match a verified Sender Identity")) {
            errorMessage = "E-Mail-Absender nicht verifiziert"
          } else if (errors.includes("access forbidden")) {
            errorMessage = "E-Mail-Service nicht autorisiert"
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

    // In a production environment, you could:
    // 1. Save to a database
    // 2. Write to a file
    // 3. Send to a webhook
    // 4. Store in a queue for later processing

    // For now, we're logging it so it appears in the server logs
    // This ensures the data is captured even if email fails

    return true
  } catch (error) {
    console.error("Error saving contact form data:", error)
    return false
  }
}
