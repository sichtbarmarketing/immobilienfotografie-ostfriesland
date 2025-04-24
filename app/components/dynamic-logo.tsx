"use client"

import { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { getSetting } from "@/app/lib/content"

interface DynamicLogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  showText?: boolean
}

export default function DynamicLogo({
  className = "",
  iconClassName = "h-6 w-6",
  textClassName = "",
  showText = true,
}: DynamicLogoProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [siteName, setSiteName] = useState("sichtbar.immo")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const logoUrl = await getSetting("logo_url")
        const name = await getSetting("site_name")

        if (logoUrl) setLogoUrl(logoUrl)
        if (name) setSiteName(name)
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
      <div className={`flex items-center gap-2 ${className}`}>
        <Camera className={iconClassName} />
        {showText && <span className={textClassName}>{siteName}</span>}
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {logoUrl ? (
        <img
          src={logoUrl || "/placeholder.svg"}
          alt={siteName}
          className={iconClassName}
          onError={() => setLogoUrl(null)}
        />
      ) : (
        <Camera className={iconClassName} />
      )}
      {showText && <span className={textClassName}>{siteName}</span>}
    </div>
  )
}
