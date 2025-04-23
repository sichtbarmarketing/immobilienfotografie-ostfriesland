"use server"

import { sendEmail } from "@/app/lib/email"

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
}

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  // Basic validation
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const phone = formData.get("phone") as string
  const service = formData.get("service") as string
  const address = formData.get("address") as string
  const message = formData.get("message") as string
  const privacy = formData.get("privacy") as string

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
    return {
      success: false,
      errors,
      message: "Bitte korrigieren Sie die markierten Felder",
    }
  }

  try {
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

    // Create email body
    const emailBody = `
Neue Anfrage vom Kontaktformular:

Name: ${name}
Email: ${email}
Telefon: ${phone || "Nicht angegeben"}
Dienstleistung: ${serviceText}
Adresse der Immobilie: ${address || "Nicht angegeben"}

Nachricht:
${message || "Keine Nachricht"}
`

    // Create HTML version of the email
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2e7d32; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
    .message { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Neue Anfrage vom Kontaktformular</h1>
    
    <div class="field">
      <span class="label">Name:</span> ${name}
    </div>
    
    <div class="field">
      <span class="label">Email:</span> ${email}
    </div>
    
    <div class="field">
      <span class="label">Telefon:</span> ${phone || "Nicht angegeben"}
    </div>
    
    <div class="field">
      <span class="label">Dienstleistung:</span> ${serviceText}
    </div>
    
    <div class="field">
      <span class="label">Adresse der Immobilie:</span> ${address || "Nicht angegeben"}
    </div>
    
    <div class="message">
      <span class="label">Nachricht:</span><br>
      ${message ? message.replace(/\n/g, "<br>") : "Keine Nachricht"}
    </div>
  </div>
</body>
</html>
`

    // Send email
    await sendEmail({
      to: "info@sichtbar-marketing.de",
      subject: "Neue Anfrage vom Kontaktformular",
      body: emailBody,
      html: htmlBody,
    })

    return {
      success: true,
      message: "Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.",
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return {
      success: false,
      message: "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
    }
  }
}
