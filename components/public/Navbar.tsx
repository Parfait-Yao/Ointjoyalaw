"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/leader", label: "Notre Leader" },
  { href: "/evenements", label: "Événements" },
  { href: "/enseignements", label: "Enseignements" },
  { href: "/organisations", label: "Organisations" },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg">
      {/* Top Banner */}
      <div className="bg-purple-900 text-white text-center text-xs py-1.5 px-4">
        Rejoignez-nous pour notre prochain événement ! <Link href="/evenements" className="underline font-medium ml-1">En savoir plus</Link>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-purple-800 flex items-center justify-center text-white font-bold text-sm">O</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            Ointjoyalaw
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-1 items-center flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                pathname === link.href
                  ? "text-purple-800 bg-purple-50"
                  : "text-gray-600 hover:text-purple-800 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dons" className="hidden sm:block">
            <Button className="bg-purple-800 hover:bg-purple-900 text-white rounded-full px-6 shadow-md">
              Faire un Don
            </Button>
          </Link>
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-1 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-purple-800 bg-purple-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/dons" onClick={() => setOpen(false)}>
            <Button className="w-full mt-2 bg-purple-800 hover:bg-purple-900 text-white rounded-full">
              Faire un Don
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
