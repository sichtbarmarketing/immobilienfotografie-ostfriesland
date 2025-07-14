// Vercel-optimized email solutions

// Option 1: Resend (Recommended - built by Vercel team)
import { Resend } from "resend"

type EmailParams = {
  to: string
  subject: string
  body: string
  html?: string
}

export async function sendVercelOptimizedEmail({ to, subject, body, html }: EmailParams): Promise<void> {
  console.log("=== VERCEL EMAIL START ===")
  console.log("Sending email via Vercel-optimized service:", { to, subject, hasHtml: !!html })

  // Try Resend first (recommended by Vercel)
  const resendApiKey = process.env.RESEND_API_KEY

  if (resendApiKey) {
    try {
      await sendViaResend({ to, subject, body, html, apiKey: resendApiKey })
      console.log("Email sent successfully via Resend")
      console.log("=== VERCEL EMAIL SUCCESS ===")
      return
    } catch (error) {
      console.warn("Resend failed, trying alternatives:", error)
    }
  }

  // Fallback to Vercel Edge Functions approach
  try {
    await sendViaVercelEdge({ to, subject, body, html })
    console.log("Email sent successfully via Vercel Edge")
    console.log("=== VERCEL EMAIL SUCCESS ===")
    return
  } catch (error) {
    console.warn("Vercel Edge failed:", error)
  }

  // Final fallback - webhook approach
  try {
    await sendViaWebhook({ to, subject, body, html })
    console.log("Email sent successfully via webhook")
    console.log("=== VERCEL EMAIL SUCCESS ===")
    return
  } catch (error) {
    console.error("All email methods failed:", error)
    throw new Error("E-Mail konnte nicht gesendet werden - alle Methoden fehlgeschlagen")
  }
}

// Resend implementation (Vercel's recommended email service)
async function sendViaResend({ to, subject, body, html, apiKey }: EmailParams & { apiKey: string }) {
  const resend = new Resend(apiKey)

  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@sichtbar-marketing.de"

  const { data, error } = await resend.emails.send({
    from: `sichtbar.immo Kontaktformular <${fromEmail}>`,
    to: [to],
    subject: subject,
    text: body,
    ...(html && { html: html }),
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }

  return data
}

// Vercel Edge Functions approach
async function sendViaVercelEdge({ to, subject, body, html }: EmailParams) {
  // Use Vercel's Edge Runtime with fetch to external email API
  const emailServiceUrl = process.env.EMAIL_WEBHOOK_URL

  if (!emailServiceUrl) {
    throw new Error("EMAIL_WEBHOOK_URL not configured")
  }

  const response = await fetch(emailServiceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN || ""}`,
    },
    body: JSON.stringify({
      to,
      subject,
      text: body,
      html,
      from: process.env.SMTP_FROM_EMAIL || "noreply@sichtbar-marketing.de",
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Webhook error: ${response.status} ${errorText}`)
  }

  return await response.json()
}

// Webhook approach (works with any email service)
async function sendViaWebhook({ to, subject, body, html }: EmailParams) {
  // This can integrate with services like:
  // - Zapier
  // - Make.com (formerly Integromat)
  // - n8n
  // - Custom webhook endpoints

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error("CONTACT_WEBHOOK_URL not configured")
  }

  const payload = {
    timestamp: new Date().toISOString(),
    email: {
      to,
      subject,
      body,
      html,
    },
    source: "sichtbar.immo",
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "sichtbar.immo/1.0",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Webhook error: ${response.status} ${errorText}`)
  }

  return await response.json()
}

// Enhanced logging for Vercel
export async function logContactFormData(formData: {
  name: string
  email: string
  phone?: string
  service: string
  address?: string
  message?: string
}) {
  try {
    console.log("=== VERCEL CONTACT FORM LOG ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Environment:", process.env.VERCEL_ENV || "development")
    console.log("Region:", process.env.VERCEL_REGION || "unknown")
    console.log("Contact Details:")
    console.log("- Name:", formData.name)
    console.log("- Email:", formData.email)
    console.log("- Phone:", formData.phone || "Not provided")
    console.log("- Service:", formData.service)
    console.log("- Address:", formData.address || "Not provided")
    console.log("- Message:", formData.message || "No message")
    console.log("=== END VERCEL LOG ===")

    // Also send to Vercel Analytics if available
    if (process.env.VERCEL_ANALYTICS_ID) {
      try {
        await fetch("https://vitals.vercel-analytics.com/v1/vitals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dsn: process.env.VERCEL_ANALYTICS_ID,
            id: `contact-form-${Date.now()}`,
            page: "/contact",
            href: "https://sichtbar.immo",
            event_name: "contact_form_submission",
            value: 1,
          }),
        })
      } catch (analyticsError) {
        console.warn("Analytics logging failed:", analyticsError)
      }
    }

    return true
  } catch (error) {
    console.error("Error logging contact form data:", error)
    return false
  }
}
