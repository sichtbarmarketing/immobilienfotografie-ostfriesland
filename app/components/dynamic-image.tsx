"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface DynamicImageProps {
  category: string
  index?: number
  alt?: string
  className?: string
  width?: number
  height?: number
  fallbackSrc?: string
}

export default function DynamicImage({
  category,
  index = 0,
  alt = "Image",
  className = "",
  width = 600,
  height = 400,
  fallbackSrc = "/placeholder.svg",
}: DynamicImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(fallbackSrc)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`/api/images?category=${category}`)
        const data = await response.json()

        if (response.ok && data.success && data.images.length > 0) {
          // Get the image at the specified index, or the first one if index is out of bounds
          const image = data.images[index] || data.images[0]
          setImageSrc(image.url)
        }
      } catch (error) {
        console.error(`Error fetching ${category} image:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [category, index])

  return (
    <div className={`relative max-w-full ${loading ? "animate-pulse bg-muted" : ""} ${className}`}>
      <Image
        src={imageSrc || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-auto object-cover max-w-full ${className}`}
        onError={() => setImageSrc(fallbackSrc)}
      />
    </div>
  )
}
