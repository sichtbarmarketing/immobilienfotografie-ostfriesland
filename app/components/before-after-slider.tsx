"use client"

import { useState, useRef, useEffect } from "react"

interface BeforeAfterSliderProps {
  beforeImage: string
  afterImage: string
  beforeAlt?: string
  afterAlt?: string
  className?: string
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeAlt = "Vorher",
  afterAlt = "Nachher",
  className = "",
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))

    setSliderPosition(percentage)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!containerRef.current) return

    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width))
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))

    setSliderPosition(percentage)
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl w-full max-w-full ${className}`}
      style={{ height: "auto", aspectRatio: "4/3" }}
    >
      {/* After Image (Full) */}
      <div className="absolute inset-0 w-full h-full">
        <img src={afterImage || "/placeholder.svg"} alt={afterAlt} className="object-cover w-full h-full" />
      </div>

      {/* Before Image (Clipped) */}
      <div className="absolute inset-0 h-full overflow-hidden" style={{ width: `${sliderPosition}%` }}>
        <img
          src={beforeImage || "/placeholder.svg"}
          alt={beforeAlt}
          className="object-cover h-full w-full"
          style={{ maxWidth: "none", width: `${100 / (sliderPosition / 100)}%` }}
        />
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
        style={{
          left: `calc(${sliderPosition}% - 2px)`,
          zIndex: 10,
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-black"
          >
            <path
              d="M8 5L5 8M5 8L8 11M5 8H13M16 13L13 16M13 16L16 19M13 16H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        Vorher
      </div>
      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
        Nachher
      </div>
    </div>
  )
}
