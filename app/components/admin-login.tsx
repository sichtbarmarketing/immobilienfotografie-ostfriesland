"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simple client-side validation
    if (!email || !password) {
      setError("Bitte geben Sie E-Mail und Passwort ein")
      setIsLoading(false)
      return
    }

    try {
      // Use our server-side API route for authentication
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        console.error("Login failed:", data)
        setError(data.message || "Ungültige Anmeldedaten")
        setIsLoading(false)
        return
      }

      // Store auth state in session storage
      sessionStorage.setItem("adminAuth", "true")
      sessionStorage.setItem("adminUser", JSON.stringify(data.user))

      console.log("Login successful, redirecting to dashboard...")

      // Use a small delay to ensure session storage is set before redirect
      setTimeout(() => {
        // Force a hard navigation to the dashboard
        window.location.href = "/admin/dashboard"
      }, 100)
    } catch (error) {
      console.error("Login error:", error)
      setError("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.")
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
        <CardDescription>Melden Sie sich mit Ihren Zugangsdaten an</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre-email@beispiel.de"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? "Anmeldung..." : "Anmelden"}
        </Button>
      </CardFooter>
    </Card>
  )
}
