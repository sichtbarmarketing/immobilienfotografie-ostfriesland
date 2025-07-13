"use client"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"

interface DynamicLogoProps {
  className?: string
  iconClassName?: string
}

export default function DynamicLogo({ className = "", iconClassName = "h-8 w-auto" }: DynamicLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/admin/settings")

        // Check if response is ok and content-type is JSON
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON")
        }

        const data = await response.json()

        if (data.success && data.settings && Array.isArray(data.settings)) {
          const logoSetting = data.settings.find((s: any) => s.key === "logo_url")
          if (logoSetting && logoSetting.value) {
            setLogoUrl(logoSetting.value)
          }
        }
      } catch (error) {
        console.warn("Error fetching logo:", error)
        setError(error instanceof Error ? error.message : "Unknown error")
        // Don't show error to user, just use fallback
      } finally {
        setLoading(false)
      }
    }

    fetchLogo()
  }, [])

  // Always show the camera icon as fallback
  return (
    <div className={`flex items-center ${className}`}>
      {!loading && logoUrl && !error ? (
        <img
          src={logoUrl || "/placeholder.svg"}
          alt="Logo"
          className={iconClassName}
          onError={() => {
            console.warn("Logo image failed to load, falling back to icon")
            setLogoUrl(null)
          }}
        />
      ) : (
        <Camera className={iconClassName} />
      )}
    </div>
  )
}
