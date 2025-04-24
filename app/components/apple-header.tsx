"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import DynamicLogo from "./dynamic-logo"

export default function AppleHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <DynamicLogo
            className={isScrolled ? "" : "text-white"}
            iconClassName={`h-6 w-6 ${isScrolled ? "" : "text-white"}`}
            textClassName={isScrolled ? "" : "text-white"}
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#services"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isScrolled ? "" : "text-white hover:text-white/80"
              }`}
            >
              Dienstleistungen
            </Link>
            <Link
              href="#portfolio"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isScrolled ? "" : "text-white hover:text-white/80"
              }`}
            >
              Portfolio
            </Link>
            <Link
              href="#homestaging"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isScrolled ? "" : "text-white hover:text-white/80"
              }`}
            >
              Virtual Homestaging
            </Link>
            <Link
              href="#about"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isScrolled ? "" : "text-white hover:text-white/80"
              }`}
            >
              Über uns
            </Link>
            <Link
              href="#contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isScrolled ? "" : "text-white hover:text-white/80"
              }`}
            >
              Kontakt
            </Link>
          </nav>

          <Button
            className={`hidden md:flex rounded-full ${
              isScrolled
                ? "bg-black text-white hover:bg-black/90"
                : "bg-white/20 text-white backdrop-blur-md hover:bg-white/30"
            }`}
            asChild
          >
            <Link href="#contact">Jetzt anfragen</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? "" : "text-white"}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? "" : "text-white"}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-b">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              href="#services"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Dienstleistungen
            </Link>
            <Link
              href="#portfolio"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              href="#homestaging"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Virtual Homestaging
            </Link>
            <Link
              href="#about"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Über uns
            </Link>
            <Link
              href="#contact"
              className="block text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
            <Button className="w-full rounded-full bg-black text-white hover:bg-black/90" asChild>
              <Link href="#contact" onClick={() => setIsMenuOpen(false)}>
                Jetzt anfragen
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
