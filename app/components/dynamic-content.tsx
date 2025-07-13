"use client"

import { useState, useEffect } from "react"
import type { JSX } from "react"

interface DynamicContentProps {
  contentKey: string
  defaultValue?: string
  className?: string
  as?: keyof JSX.IntrinsicElements
}

export default function DynamicContent({
  contentKey,
  defaultValue = "",
  className = "",
  as: Component = "div",
}: DynamicContentProps) {
  const [content, setContent] = useState(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)

        const response = await fetch("/api/admin/content")

        // Check if response is ok and content-type is JSON
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON")
        }

        const data = await response.json()

        if (data.success && data.content && Array.isArray(data.content)) {
          const contentItem = data.content.find((item: any) => item.key === contentKey)
          if (contentItem && contentItem.content) {
            setContent(contentItem.content)
          } else {
            console.log(`No content found for key ${contentKey}, using default value`)
          }
        } else {
          console.warn("Invalid content data structure received")
        }
      } catch (error) {
        console.warn(`Error fetching content for key ${contentKey}:`, error)
        // Keep using default value on error
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contentKey])

  return <Component className={className}>{content}</Component>
}
