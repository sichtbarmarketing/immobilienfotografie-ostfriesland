"use client"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { getSetting } from "@/app/lib/content"

interface DynamicLogoProps {
  className?: string
  iconClassName?: string
}

export default function DynamicLogo({ className = "", iconClassName = "h-8 w-auto" }: DynamicLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoUrl = await getSetting("logo_url")
        if (logoUrl) setLogoUrl(logoUrl)
      } catch (error) {
        console.error("Error fetching logo:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogo()
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center ${className}`}>
        <Camera className={iconClassName} />
      </div>
    )
  }

  return (
    <div className={`flex items-center ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl || "/placeholder.svg"}
          alt="Logo"
          className={iconClassName}
          onError={() => setLogoUrl(null)}
        />
      ) : (
        <Camera className={iconClassName} />
      )}
    </div>
  )
}
