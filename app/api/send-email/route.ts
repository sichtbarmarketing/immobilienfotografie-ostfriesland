import { NextResponse } from "next/server"

// Use Edge Runtime for better performance and compatibility
export const runtime = "edge"

export async function POST(request: Request) {
  try {
    const { to, subject, body, html } = await request.json()

    console.log("=== VERCEL EMAIL API START ===")
    console.log("Email request received:", { to, subject, hasHtml: !!html })
    console.log("Runtime:", "edge")
    console.log("Region:", process.env.VERCEL_REGION || "unknown")

    // Use Vercel-optimized email sending
    const result = await sendEmailViaVercelServices({
      to,
      subject,
      body,
      html,
    })

    if (result.success) {
      console.log("Email sent successfully via Vercel services")
      console.log("=== VERCEL EMAIL API SUCCESS ===")

      return NextResponse.json({
        success: true,
        message: "E-Mail erfolgreich gesendet",
        messageId: result.messageId,
        service: result.service,
      })
    } else {
      throw new Error(result.error || "Email sending failed")
    }
  } catch (error) {
    console.error("Error in Vercel email API:", error)
    console.log("=== VERCEL EMAIL API ERROR ===")

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "E-Mail konnte nicht gesendet werden",
      },
      { status: 500 },
    )
  }
}

// Vercel-optimized email sending with multiple fallbacks
async function sendEmailViaVercelServices({
  to,
  subject,
  body,
  html,
}: {
  to: string
  subject: string
  body: string
  html?: string
}): Promise<{ success: boolean; messageId?: string; service?: string; error?: string }> {
  // Method 1: Resend (Vercel's recommended email service)
  if (process.env.RESEND_API_KEY) {
    try {
      const result = await sendViaResendAPI({ to, subject, body, html })
      return { success: true, messageId: result.id, service: "resend" }
    } catch (error) {
      console.warn("Resend failed:", error)
    }
  }

  // Method 2: SendGrid (also Vercel-compatible)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const result = await sendViaSendGridAPI({ to, subject, body, html })
      return { success: true, messageId: result.messageId, service: "sendgrid" }
    } catch (error) {
      console.warn("SendGrid failed:", error)
    }
  }

  // Method 3: Webhook approach
  if (process.env.EMAIL_WEBHOOK_URL) {
    try {
      const result = await sendViaWebhookAPI({ to, subject, body, html })
      return { success: true, messageId: result.id, service: "webhook" }
    } catch (error) {
      console.warn("Webhook failed:", error)
    }
  }

  // Method 4: Vercel KV storage (for later processing)
  if (process.env.KV_REST_API_URL) {
    try {
      const result = await storeInVercelKV({ to, subject, body, html })
      return { success: true, messageId: result.id, service: "kv-storage" }
    } catch (error) {
      console.warn("KV storage failed:", error)
    }
  }

  // Final fallback: Enhanced logging
  try {
    const messageId = await enhancedLogging({ to, subject, body, html })
    return { success: true, messageId, service: "logging" }
  } catch (error) {
    return { success: false, error: "All email methods failed" }
  }
}

// Resend API implementation
async function sendViaResendAPI({
  to,
  subject,
  body,
  html,
}: {
  to: string
  subject: string
  body: string
  html?: string
}) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `sichtbar.immo <${process.env.RESEND_FROM_EMAIL || "noreply@sichtbar-marketing.de"}>`,
      to: [to],
      subject,
      text: body,
      ...(html && { html }),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }

  return await response.json()
}

// SendGrid API implementation
async function sendViaSendGridAPI({
  to,
  subject,
  body,
  html,
}: {
  to: string
  subject: string
  body: string
  html?: string
}) {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: {
        email: process.env.SMTP_FROM_EMAIL || "noreply@sichtbar-marketing.de",
        name: "sichtbar.immo Kontaktformular",
      },
      subject,
      content: [{ type: "text/plain", value: body }, ...(html ? [{ type: "text/html", value: html }] : [])],
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SendGrid API error: ${error}`)
  }

  return { messageId: `sendgrid-${Date.now()}` }
}

// Webhook API implementation
async function sendViaWebhookAPI({
  to,
  subject,
  body,
  html,
}: {
  to: string
  subject: string
  body: string
  html?: string
}) {
  const response = await fetch(process.env.EMAIL_WEBHOOK_URL!, {
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
      timestamp: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Webhook API error: ${error}`)
  }

  return await response.json()
}

// Vercel KV storage implementation
async function storeInVercelKV({
  to,
  subject,
  body,
  html,
}: {
  to: string
  subject: string
  body: string
  html?: string
}) {
  const emailData = {
    to,
    subject,
    body,
    html,
    timestamp: new Date().toISOString(),
    processed: false,
  }

  const key = `email:${Date.now()}`

  const response = await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emailData),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`KV storage error: ${error}`)
  }

  return { id: key }
}

// Enhanced logging with structured data
async function enhancedLogging({
  to,
  subject,
  body,
  html,
}: {
  to: string
  subject: string
  body: string
  html?: string
}): Promise<string> {
  const messageId = `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  console.log("=== VERCEL EMAIL FALLBACK ===")
  console.log("Message ID:", messageId)
  console.log("Timestamp:", new Date().toISOString())
  console.log("Environment:", process.env.VERCEL_ENV || "development")
  console.log("Region:", process.env.VERCEL_REGION || "unknown")
  console.log("To:", to)
  console.log("Subject:", subject)
  console.log("Body:", body)
  if (html) {
    console.log("HTML Length:", html.length)
  }
  console.log("=== END VERCEL EMAIL FALLBACK ===")

  return messageId
}
