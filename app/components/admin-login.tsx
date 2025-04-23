"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple client-side validation
    if (!username || !password) {
      setError("Bitte geben Sie Benutzername und Passwort ein")
      return
    }

    // In a real app, you'd want to use a more secure authentication method
    // This is just a simple example
    if (username === "admin" && password === "sichtbar2024") {
      // Store auth state in session storage (not secure for production)
      sessionStorage.setItem("adminAuth", "true")
      router.push("/admin/dashboard")
    } else {
      setError("Ungültige Anmeldedaten")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          Benutzername
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Passwort
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit" className="w-full">
        Anmelden
      </Button>
    </form>
  )
}
