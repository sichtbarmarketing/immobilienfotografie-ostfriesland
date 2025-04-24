"use client"

import { useState, useEffect } from "react"
import { getContent } from "@/app/lib/content"
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
        const fetchedContent = await getContent(contentKey)
        if (fetchedContent) {
          setContent(fetchedContent)
        }
      } catch (error) {
        console.error(`Error fetching content for key ${contentKey}:`, error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [contentKey])

  if (loading) {
    return <Component className={className}>{defaultValue}</Component>
  }

  return <Component className={className}>{content}</Component>
}
