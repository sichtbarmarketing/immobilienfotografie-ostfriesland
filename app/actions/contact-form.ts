"use server"

import { Resend } from "resend"

export type ContactFormState = {
  success?: boolean
  message?: string
  errors?: {
    name?: string[]
    email?: string[]
    phone?: string[]
    service?: string[]
    address?: string[]
    message?: string[]
    privacy?: string[]
  }
  debug?: string[]
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const debugInfo: string[] = []

  console.log("=== RESEND CONTACT FORM START ===")
  debugInfo.push("Contact form submission started with Resend")

  // Basic validation
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const service = formData.get("service") as string
  const address = formData.get("address") as string
  const message = formData.get("message") as string
  const privacy = formData.get("privacy") as string

  console.log("Form data received:", { name, email, service, hasPrivacy: !!privacy })
  debugInfo.push(`Form data: name=${!!name}, email=${!!email}, service=${!!service}`)

  const errors: ContactFormState["errors"] = {}

  if (!name || name.trim() === "") {
    errors.name = ["Bitte geben Sie Ihren Namen ein"]
  }

  if (!email || email.trim() === "") {
    errors.email = ["Bitte geben Sie Ihre E-Mail-Adresse ein"]
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = ["Bitte geben Sie eine gültige E-Mail-Adresse ein"]
  }

  if (!service || service === "") {
    errors.service = ["Bitte wählen Sie eine Dienstleistung aus"]
  }

  if (!privacy || privacy !== "accepted") {
    errors.privacy = ["Bitte stimmen Sie der Datenschutzerklärung zu"]
  }

  if (Object.keys(errors).length > 0) {
    console.log("Validation errors:", errors)
    debugInfo.push("Validation failed")
    return {
      success: false,
      errors,
      message: "Bitte korrigieren Sie die markierten Felder",
      debug: debugInfo,
    }
  }

  // Map service value to readable text
  const serviceMap: Record<string, string> = {
    fotografie: "Immobilienfotografie",
    video: "Immobilienvideos",
    homestaging: "Virtual Homestaging",
    drohne: "Drohnenaufnahmen",
    rundgang: "360° Rundgang",
    komplett: "Komplettpaket",
  }

  const serviceText = serviceMap[service] || service

  // Prepare contact data
  const contactData = {
    name,
    email,
    phone,
    service: serviceText,
    address,
    message,
  }

  try {
    // Log contact form data as backup
    console.log("=== CONTACT FORM DATA ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Contact Details:")
    console.log("- Name:", contactData.name)
    console.log("- Email:", contactData.email)
    console.log("- Phone:", contactData.phone || "Not provided")
    console.log("- Service:", contactData.service)
    console.log("- Address:", contactData.address || "Not provided")
    console.log("- Message:", contactData.message || "No message")
    console.log("=== END CONTACT FORM DATA ===")

    debugInfo.push("Contact data logged successfully")

    // Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY || "re_JvqvZNkU_K6yZX2iX41ZQ4rzt3xQTvKKB"

    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set")
    }

    console.log("Resend API Key available:", resendApiKey ? "Yes" : "No")
    debugInfo.push(`Resend API Key configured: ${resendApiKey ? "Yes" : "No"}`)

    const resend = new Resend(resendApiKey)

    const emailSubject = `Neue Kontaktanfrage von ${name} - ${serviceText}`
    const emailBody = `
Neue Kontaktanfrage über sichtbar.immo

Name: ${name}
E-Mail: ${email}
Telefon: ${phone || "Nicht angegeben"}
Gewünschte Dienstleistung: ${serviceText}
Adresse der Immobilie: ${address || "Nicht angegeben"}

Nachricht:
${message || "Keine Nachricht"}

---
Diese E-Mail wurde automatisch über das Kontaktformular auf sichtbar.immo gesendet.
Zeitstempel: ${new Date().toLocaleString("de-DE")}
    `

    const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Neue Kontaktanfrage</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    .contact-info { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .message-box { background-color: #fff; padding: 20px; border-left: 4px solid #3498db; margin: 20px 0; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
    a { color: #3498db; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="header">Neue Kontaktanfrage über sichtbar.immo</h2>
    
    <div class="contact-info">
      <h3 style="margin-top: 0; color: #2c3e50;">Kontaktdaten:</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Telefon:</strong> ${phone ? `<a href="tel:${phone}">${phone}</a>` : "Nicht angegeben"}</p>
      <p><strong>Gewünschte Dienstleistung:</strong> ${serviceText}</p>
      <p><strong>Adresse der Immobilie:</strong> ${address || "Nicht angegeben"}</p>
    </div>
    
    ${
      message
        ? `
    <div class="message-box">
      <h3 style="margin-top: 0; color: #2c3e50;">Nachricht:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    </div>
    `
        : ""
    }
    
    <div class="footer">
      <p>Diese E-Mail wurde automatisch über das Kontaktformular auf sichtbar.immo gesendet.</p>
      <p>Zeitstempel: ${new Date().toLocaleString("de-DE")}</p>
      <p><em>Gesendet via Resend</em></p>
    </div>
  </div>
</body>
</html>
    `

    // Get recipient email from environment variable
    const recipientEmail = process.env.CONTACT_EMAIL || "info@sichtbar-marketing.de"
    const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sichtbar-marketing.de"

    console.log("Sending email via Resend:", {
      from: fromEmail,
      to: recipientEmail,
      subject: emailSubject,
    })

    const { data, error } = await resend.emails.send({
      from: `sichtbar.immo Kontaktformular <${fromEmail}>`,
      to: [recipientEmail],
      subject: emailSubject,
      text: emailBody,
      html: emailHTML,
    })

    if (error) {
      console.error("Resend API error:", error)
      debugInfo.push(`Resend error: ${error.message}`)

      // Still return success since data is logged
      return {
        success: true,
        message:
          "Vielen Dank für Ihre Anfrage! Ihre Nachricht wurde gespeichert. Da unser E-Mail-System derzeit Wartungsarbeiten durchführt, kontaktieren Sie uns bitte zusätzlich direkt unter info@sichtbar-marketing.de oder telefonisch unter +49 151 424 833 23.",
        debug: debugInfo,
      }
    }

    console.log("Email sent successfully via Resend:", data?.id)
    debugInfo.push(`Email sent successfully via Resend: ${data?.id}`)
    console.log("=== RESEND CONTACT FORM SUCCESS ===")

    return {
      success: true,
      message:
        "Vielen Dank für Ihre Anfrage! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns zeitnah bei Ihnen zurück.",
      debug: debugInfo,
    }
  } catch (error) {
    console.error("Error processing contact form:", error)
    debugInfo.push(`Processing error: ${error instanceof Error ? error.message : "Unknown error"}`)

    console.log("=== RESEND CONTACT FORM ERROR ===")

    // Even on error, the data is logged, so we can still show partial success
    return {
      success: true,
      message:
        "Vielen Dank für Ihre Anfrage! Ihre Nachricht wurde gespeichert. Falls Sie keine Antwort erhalten, kontaktieren Sie uns bitte direkt unter info@sichtbar-marketing.de oder telefonisch unter +49 151 424 833 23.",
      debug: debugInfo,
    }
  }
}
