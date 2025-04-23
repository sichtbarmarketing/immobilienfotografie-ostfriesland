"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { submitContactForm, type ContactFormState } from "@/app/actions/contact-form"

export function ContactForm() {
  const [state, action] = useActionState<ContactFormState, FormData>(submitContactForm, {})

  return (
    <form className="space-y-6" action={action}>
      {state?.message && (
        <div className={`p-4 rounded-md ${state.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Name *
          </label>
          <input
            id="name"
            name="name"
            className={`flex h-10 w-full rounded-md border ${state?.errors?.name ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            placeholder="Ihr Name"
          />
          {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            E-Mail *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`flex h-10 w-full rounded-md border ${state?.errors?.email ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            placeholder="Ihre E-Mail"
          />
          {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Telefon
        </label>
        <input
          id="phone"
          name="phone"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ihre Telefonnummer"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="service"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Gewünschte Dienstleistung *
        </label>
        <select
          id="service"
          name="service"
          className={`flex h-10 w-full rounded-md border ${state?.errors?.service ? "border-red-500" : "border-input"} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <option value="">Bitte auswählen</option>
          <option value="fotografie">Immobilienfotografie</option>
          <option value="video">Immobilienvideos</option>
          <option value="homestaging">Virtual Homestaging</option>
          <option value="drohne">Drohnenaufnahmen</option>
          <option value="rundgang">360° Rundgang</option>
          <option value="komplett">Komplettpaket</option>
        </select>
        {state?.errors?.service && <p className="text-sm text-red-500">{state.errors.service[0]}</p>}
      </div>
      <div className="space-y-2">
        <label
          htmlFor="address"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Adresse der Immobilie
        </label>
        <input
          id="address"
          name="address"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Straße, Hausnummer, PLZ, Ort"
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="message"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Nachricht
        </label>
        <textarea
          id="message"
          name="message"
          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ihre Nachricht und weitere Details zur Immobilie"
        />
      </div>
      <div className="flex items-start space-x-2">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          className={`mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary ${state?.errors?.privacy ? "border-red-500" : ""}`}
        />
        <label
          htmlFor="privacy"
          className={`text-sm ${state?.errors?.privacy ? "text-red-500" : "text-muted-foreground"}`}
        >
          Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu *
        </label>
      </div>
      {state?.errors?.privacy && <p className="text-sm text-red-500 mt-1">{state.errors.privacy[0]}</p>}
      <Button type="submit" className="w-full">
        Anfrage senden
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">* Pflichtfelder</p>
    </form>
  )
}
