"use client"

import { useRef, useEffect, type ReactNode } from "react"

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  direction?: "up" | "down" | "left" | "right" | "none"
}

export default function FadeIn({
  children,
  className = "",
  delay = 0,
  threshold = 0.1,
  direction = "up",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("opacity-100")

              switch (direction) {
                case "up":
                  entry.target.classList.add("translate-y-0")
                  break
                case "down":
                  entry.target.classList.add("translate-y-0")
                  break
                case "left":
                  entry.target.classList.add("translate-x-0")
                  break
                case "right":
                  entry.target.classList.add("translate-x-0")
                  break
              }

              observer.unobserve(entry.target)
            }, delay)
          }
        })
      },
      { threshold },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay, threshold, direction])

  const getInitialTransform = () => {
    switch (direction) {
      case "up":
        return "translate-y-10"
      case "down":
        return "-translate-y-10"
      case "left":
        return "translate-x-10"
      case "right":
        return "-translate-x-10"
      default:
        return ""
    }
  }

  return (
    <div ref={ref} className={`transition-all duration-1000 ease-out opacity-0 ${getInitialTransform()} ${className}`}>
      {children}
    </div>
  )
}
