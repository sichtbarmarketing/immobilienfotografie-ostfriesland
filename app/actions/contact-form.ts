"use server"

import { sendEmail, saveContactFormData } from "@/app/lib/email"

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

  console.log("=== CONTACT FORM SUBMISSION START ===")
  debugInfo.push("Contact form submission started")

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

  if (!privacy) {
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
    // Create email body
    const emailBody = `
Neue Anfrage vom Kontaktformular sichtbar.immo:

Name: ${name}
Email: ${email}
Telefon: ${phone || "Nicht angegeben"}
Dienstleistung: ${serviceText}
Adresse der Immobilie: ${address || "Nicht angegeben"}

Nachricht:
${message || "Keine Nachricht"}

---
Diese E-Mail wurde automatisch vom Kontaktformular auf sichtbar.immo generiert.
Zeitstempel: ${new Date().toLocaleString("de-DE")}
`

    // Create HTML version of the email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .field { margin-bottom: 15px; padding: 10px; background-color: white; border-radius: 5px; }
    .label { font-weight: bold; color: #000; }
    .value { margin-top: 5px; }
    .message-box { margin-top: 20px; padding: 15px; background-color: white; border-left: 4px solid #000; }
    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Neue Anfrage von sichtbar.immo</h1>
    </div>
    
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${name}</div>
      </div>
      
      <div class="field">
        <div class="label">E-Mail:</div>
        <div class="value">${email}</div>
      </div>
      
      <div class="field">
        <div class="label">Telefon:</div>
        <div class="value">${phone || "Nicht angegeben"}</div>
      </div>
      
      <div class="field">
        <div class="label">Gewünschte Dienstleistung:</div>
        <div class="value">${serviceText}</div>
      </div>
      
      <div class="field">
        <div class="label">Adresse der Immobilie:</div>
        <div class="value">${address || "Nicht angegeben"}</div>
      </div>
      
      <div class="message-box">
        <div class="label">Nachricht:</div>
        <div class="value">${message ? message.replace(/\n/g, "<br>") : "Keine Nachricht"}</div>
      </div>
    </div>
    
    <div class="footer">
      Diese E-Mail wurde automatisch vom Kontaktformular auf sichtbar.immo generiert.<br>
      Zeitstempel: ${new Date().toLocaleString("de-DE")}
    </div>
  </div>
</body>
</html>
`

    console.log("Attempting to send email to info@sichtbar-marketing.de")
    debugInfo.push("Attempting to send email")

    // Try to send email
    await sendEmail({
      to: "info@sichtbar-marketing.de",
      subject: `Neue Anfrage von ${name} - sichtbar.immo`,
      body: emailBody,
      html: htmlBody,
    })

    console.log("Email sent successfully")
    debugInfo.push("Email sent successfully")

    console.log("=== CONTACT FORM SUBMISSION SUCCESS ===")

    return {
      success: true,
      message: "Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.",
      debug: debugInfo,
    }
  } catch (error) {
    console.error("Error sending contact form email:", error)
    debugInfo.push(`Email error: ${error instanceof Error ? error.message : "Unknown error"}`)

    // Try to save the data as fallback
    try {
      const saved = await saveContactFormData(contactData)
      if (saved) {
        debugInfo.push("Data saved as fallback")
        console.log("Contact data saved as fallback")
      }
    } catch (saveError) {
      console.error("Error saving contact data:", saveError)
      debugInfo.push("Fallback save failed")
    }

    // Provide specific error messages based on the error
    let errorMessage = "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut."

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase()

      if (errorMsg.includes("nicht konfiguriert") || errorMsg.includes("not configured")) {
        errorMessage =
          "Der E-Mail-Service ist nicht konfiguriert. Bitte kontaktieren Sie uns direkt unter info@sichtbar-marketing.de oder telefonisch."
      } else if (errorMsg.includes("nicht verifiziert") || errorMsg.includes("not verified")) {
        errorMessage =
          "E-Mail-Konfigurationsproblem. Bitte kontaktieren Sie uns direkt unter info@sichtbar-marketing.de oder telefonisch."
      } else if (errorMsg.includes("forbidden") || errorMsg.includes("unauthorized")) {
        errorMessage =
          "E-Mail-Service nicht autorisiert. Bitte kontaktieren Sie uns direkt unter info@sichtbar-marketing.de oder telefonisch."
      }
    }

    console.log("=== CONTACT FORM SUBMISSION ERROR ===")

    return {
      success: false,
      message: errorMessage,
      debug: debugInfo,
    }
  }
}
