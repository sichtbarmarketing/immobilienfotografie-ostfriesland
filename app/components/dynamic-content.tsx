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

        // Try to fetch content from API instead of direct function call
        const response = await fetch("/api/admin/content")

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success && data.content) {
          const contentItem = data.content.find((item: any) => item.key === contentKey)
          if (contentItem && contentItem.content) {
            setContent(contentItem.content)
          }
        }
      } catch (error) {
        console.warn(`Error fetching content for key ${contentKey}:`, error)
        // Keep using default value
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contentKey])

  return <Component className={className}>{content}</Component>
}
