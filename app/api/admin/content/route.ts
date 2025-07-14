import { NextResponse } from "next/server"

// Force dynamic rendering
export const dynamic = "force-dynamic"

// Static fallback content for when database is not available
const fallbackContent = [
  {
    id: 1,
    key: "hero_title",
    title: "Hero Titel",
    content: "Immobilienfotografie neu definiert.",
  },
  {
    id: 2,
    key: "hero_subtitle",
    title: "Hero Untertitel",
    content: "Professionelle Immobilienfotografie, Videos und Virtual Homestaging in Ostfriesland.",
  },
  {
    id: 3,
    key: "about_title",
    title: "Über uns Titel",
    content: "Über sichtbar.immo",
  },
  {
    id: 4,
    key: "contact_title",
    title: "Kontakt Titel",
    content: "Jetzt unverbindlich anfragen",
  },
  {
    id: 5,
    key: "impressum",
    title: "Impressum",
    content: `<h2>Angaben gemäß § 5 TMG</h2>
<p>
  Max Mustermann<br />
  sichtbar.immo<br />
  Musterstraße 123<br />
  26789 Leer
</p>

<h3>Kontakt</h3>
<p>
  Telefon: +49 (0) 123 456789<br />
  E-Mail: info@sichtbar-marketing.de
</p>

<h3>Umsatzsteuer-ID</h3>
<p>
  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
  DE123456789
</p>

<h3>Berufsbezeichnung und berufsrechtliche Regelungen</h3>
<p>
  Berufsbezeichnung: Fotograf<br />
  Zuständige Kammer: Handwerkskammer Ostfriesland<br />
  Verliehen durch: Bundesrepublik Deutschland
</p>

<h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
<p>
  Max Mustermann<br />
  Musterstraße 123<br />
  26789 Leer
</p>`,
  },
  {
    id: 6,
    key: "datenschutz",
    title: "Datenschutzerklärung",
    content: `<h2>1. Datenschutz auf einen Blick</h2>
<h3>Allgemeine Hinweise</h3>
<p>
  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können. Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
</p>

<h3>Datenerfassung auf dieser Website</h3>
<p>
  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
</p>

<p>
  <strong>Wie erfassen wir Ihre Daten?</strong><br />
  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
</p>

<p>
  <strong>Wofür nutzen wir Ihre Daten?</strong><br />
  Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
</p>

<p>
  <strong>Welche Rechte haben Sie bezüglich Ihrer Daten?</strong><br />
  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Wenn Sie eine Einwilligung zur Datenverarbeitung erteilt haben, können Sie diese Einwilligung jederzeit für die Zukunft widerrufen. Außerdem haben Sie das Recht, unter bestimmten Umständen die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
</p>`,
  },
]

// Create a Supabase client with better error handling
function createSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Supabase credentials not configured, using fallback content")
      return null
    }

    const { createClient } = require("@supabase/supabase-js")
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.warn("Error creating Supabase client:", error)
    return null
  }
}

export async function GET() {
  try {
    const supabase = createSupabaseClient()

    if (!supabase) {
      console.log("Using fallback content due to missing Supabase configuration")
      return NextResponse.json({
        success: true,
        content: fallbackContent,
        source: "fallback",
      })
    }

    // Try to fetch content from database
    const { data, error } = await supabase.from("site_content").select("*").order("key")

    if (error) {
      console.warn("Error fetching content from database:", error.message)
      console.log("Using fallback content due to database error")
      return NextResponse.json({
        success: true,
        content: fallbackContent,
        source: "fallback",
        note: "Database unavailable, using default content",
      })
    }

    // If we have data, use it; otherwise use fallback
    const content = data && data.length > 0 ? data : fallbackContent

    return NextResponse.json({
      success: true,
      content: content,
      source: data && data.length > 0 ? "database" : "fallback",
    })
  } catch (error) {
    console.error("Unexpected error in content API:", error)

    // Always return valid JSON, even on error
    return NextResponse.json({
      success: true,
      content: fallbackContent,
      source: "fallback",
      error: "Unexpected error occurred, using default content",
    })
  }
}
