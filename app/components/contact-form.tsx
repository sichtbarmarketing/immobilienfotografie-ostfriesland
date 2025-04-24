"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { submitContactForm, type ContactFormState } from "@/app/actions/contact-form"

export function ContactForm() {
  const [state, action] = useActionState<ContactFormState, FormData>(submitContactForm, {})

  return (
    <form className="space-y-8" action={action}>
      {state?.message && (
        <div
          className={`p-6 rounded-xl ${
            state.success
              ? "bg-black/5 text-black dark:bg-white/10 dark:text-white"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            className={`flex h-12 w-full rounded-xl border ${
              state?.errors?.name ? "border-red-500" : "border-input"
            } bg-transparent px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            placeholder="Ihr Name"
          />
          {state?.errors?.name && <p className="text-sm text-red-500 dark:text-red-400">{state.errors.name[0]}</p>}
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
            className={`flex h-12 w-full rounded-xl border ${
              state?.errors?.email ? "border-red-500" : "border-input"
            } bg-transparent px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
            placeholder="Ihre E-Mail"
          />
          {state?.errors?.email && <p className="text-sm text-red-500 dark:text-red-400">{state.errors.email[0]}</p>}
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
          className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          className={`flex h-12 w-full rounded-xl border ${
            state?.errors?.service ? "border-red-500" : "border-input"
          } bg-transparent px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <option value="">Bitte auswählen</option>
          <option value="fotografie">Immobilienfotografie</option>
          <option value="video">Immobilienvideos</option>
          <option value="homestaging">Virtual Homestaging</option>
          <option value="drohne">Drohnenaufnahmen</option>
          <option value="rundgang">360° Rundgang</option>
          <option value="komplett">Komplettpaket</option>
        </select>
        {state?.errors?.service && <p className="text-sm text-red-500 dark:text-red-400">{state.errors.service[0]}</p>}
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
          className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="flex min-h-[150px] w-full rounded-xl border border-input bg-transparent px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ihre Nachricht und weitere Details zur Immobilie"
        />
      </div>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="privacy"
          name="privacy"
          className={`mt-1 h-5 w-5 rounded border-gray-300 text-black focus:ring-black ${
            state?.errors?.privacy ? "border-red-500" : ""
          }`}
        />
        <label
          htmlFor="privacy"
          className={`text-sm ${state?.errors?.privacy ? "text-red-500 dark:text-red-400" : "text-muted-foreground"}`}
        >
          Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu *
        </label>
      </div>
      {state?.errors?.privacy && (
        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{state.errors.privacy[0]}</p>
      )}
      <Button
        type="submit"
        className="w-full rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 h-12 text-base"
      >
        Anfrage senden
      </Button>
      <p className="text-xs text-muted-foreground text-center mt-2">* Pflichtfelder</p>
    </form>
  )
}
