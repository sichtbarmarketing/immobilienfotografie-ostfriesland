"use server"

import { supabaseAdmin } from "@/app/lib/supabase-admin"

// In-memory storage as fallback
const memoryStorage: Array<{
  id: number
  key: string
  title: string
  content: string
}> = [
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

export async function updateSiteContent(formData: FormData) {
  try {
    const key = formData.get("key") as string
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const id = Number.parseInt(formData.get("id") as string)

    console.log("Updating content:", { key, title, contentLength: content?.length, id })

    // Try Supabase first
    try {
      const { data, error } = await supabaseAdmin
        .from("site_content")
        .upsert({
          id,
          key,
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) {
        console.warn("Supabase error, using memory storage:", error)
        throw error
      }

      console.log("Supabase update successful:", data)

      // Also update memory storage
      const existingIndex = memoryStorage.findIndex((item) => item.key === key)
      if (existingIndex >= 0) {
        memoryStorage[existingIndex] = { id, key, title, content }
      } else {
        memoryStorage.push({ id, key, title, content })
      }

      return {
        success: true,
        message: "Inhalt erfolgreich gespeichert!",
      }
    } catch (supabaseError) {
      console.warn("Supabase failed, using memory storage:", supabaseError)

      // Fallback to memory storage
      const existingIndex = memoryStorage.findIndex((item) => item.key === key)
      if (existingIndex >= 0) {
        memoryStorage[existingIndex] = { id, key, title, content }
      } else {
        memoryStorage.push({ id, key, title, content })
      }

      console.log(
        "Memory storage updated:",
        memoryStorage.find((item) => item.key === key),
      )

      return {
        success: true,
        message: "Inhalt erfolgreich gespeichert (lokaler Speicher)!",
      }
    }
  } catch (error) {
    console.error("Error updating content:", error)
    return {
      success: false,
      message: "Fehler beim Speichern des Inhalts",
    }
  }
}

export async function getSiteContent() {
  try {
    // Try Supabase first
    const { data, error } = await supabaseAdmin.from("site_content").select("*").order("id")

    if (error) {
      console.warn("Supabase error, using memory storage:", error)
      throw error
    }

    if (data && data.length > 0) {
      console.log("Loaded content from Supabase:", data.length, "items")
      return data
    } else {
      console.log("No data in Supabase, using memory storage")
      return memoryStorage
    }
  } catch (error) {
    console.warn("Supabase failed, using memory storage:", error)
    console.log("Memory storage content:", memoryStorage.length, "items")
    return memoryStorage
  }
}
