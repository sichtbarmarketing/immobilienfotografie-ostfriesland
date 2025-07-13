import { NextResponse } from "next/server"
import { sendEmail } from "@/app/lib/email"

export async function GET() {
  try {
    console.log("Testing email configuration...")

    // Check environment variables
    const hasApiKey = !!process.env.SENDGRID_API_KEY
    const apiKeyLength = process.env.SENDGRID_API_KEY?.length || 0
    const apiKeyFormat = process.env.SENDGRID_API_KEY?.startsWith("SG.") || false

    const testResult = {
      hasApiKey,
      apiKeyLength,
      apiKeyFormat,
      timestamp: new Date().toISOString(),
    }

    console.log("Email test result:", testResult)

    // Try to send a test email
    if (hasApiKey && apiKeyFormat) {
      try {
        await sendEmail({
          to: "info@sichtbar-marketing.de",
          subject: "Test E-Mail von sichtbar.immo",
          body: "Dies ist eine Test-E-Mail um die Konfiguration zu überprüfen.",
          html: "<p>Dies ist eine Test-E-Mail um die Konfiguration zu überprüfen.</p>",
        })

        return NextResponse.json({
          success: true,
          message: "Test email sent successfully",
          config: testResult,
        })
      } catch (emailError) {
        return NextResponse.json({
          success: false,
          message: "Email sending failed",
          error: emailError instanceof Error ? emailError.message : "Unknown error",
          config: testResult,
        })
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "Email configuration invalid",
        config: testResult,
      })
    }
  } catch (error) {
    console.error("Email test error:", error)
    return NextResponse.json({
      success: false,
      message: "Test failed",
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
