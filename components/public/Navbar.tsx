"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

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

      <div className="container mx-auto flex h-24 md:h-32 items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32">
        <Link href="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src="/images/logo-site.png"
            alt="Joy Alawey Ministries Logo"
            width={400}
            height={150}
            className="h-16 md:h-24 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all duration-200 ${pathname === link.href
                ? "text-purple-800 bg-purple-100/50 shadow-sm"
                : "text-gray-500 hover:text-purple-800 hover:bg-gray-50"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dons" className="hidden sm:block">
            <Button className="h-10 md:h-14 bg-gradient-to-br from-purple-700 via-[#3b0a68] to-indigo-800 text-white font-black rounded-full px-6 md:px-10 shadow-xl shadow-purple-900/20 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 ring-2 ring-white/20 border-0 flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-widest">
              Faire un Don
            </Button>
          </Link>
          <button
            className="md:hidden p-3 rounded-2xl bg-gray-50 text-purple-900 hover:bg-purple-50 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${pathname === link.href
                ? "text-purple-800 bg-purple-50"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/dons" onClick={() => setOpen(false)} className="block pt-2">
            <Button className="w-full h-14 bg-gradient-to-br from-purple-700 via-[#3b0a68] to-indigo-800 text-white font-black rounded-2xl shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 text-xs uppercase tracking-widest border-0 ring-1 ring-white/10">
              Faire un Don
            </Button>
          </Link>
        </div>
      )}
    </nav>
  )
}
