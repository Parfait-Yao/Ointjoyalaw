"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Mail, Phone, MapPin, Cross, Send } from "lucide-react"

// Inline social SVGs (not available in this lucide-react version)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
  </svg>
)

export function Footer() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await fetch("/api/organizations")
        if (res.ok) {
          const data = await res.json()
          setOrganizations(data.slice(0, 5)) // Take top 5 for footer
        }
      } catch (e) {
        console.error("Failed to fetch organizations for footer", e)
      }
    }
    fetchOrgs()
  }, [])

  const defaultOrgs = [
    { name: "Let There Be Joy", acronym: "LTBJ" },
    { name: "ARMES", acronym: "AR" },
    { name: "MCA", acronym: "MC" },
    { name: "AMES", acronym: "AM" },
  ]

  const displayOrgs = organizations.length > 0 ? organizations : defaultOrgs

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
    } catch {
      // silent fail — still show confirmation
    }
    setSubscribed(true)
    setEmail("")
  }

  return (
    <footer className="bg-white">
      {/* ── Newsletter Banner ── */}
      <div className="mx-8 md:mx-16 lg:mx-24 xl:mx-32 -mb-1">
        <div className="relative bg-gradient-to-r from-purple-800 via-purple-700 to-indigo-700 rounded-2xl overflow-hidden px-8 md:px-14 py-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-purple-900/40">
          {/* Decorative cross / sparkles left */}
          <div className="hidden md:flex flex-col items-center justify-center min-w-[160px]">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                <Cross className="w-10 h-10 text-white/80" />
              </div>
              {/* sparkle dots */}
              <span className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-yellow-400/80" />
              <span className="absolute -bottom-1 right-4 w-2 h-2 rounded-full bg-white/60" />
              <span className="absolute top-4 -left-3 w-2 h-2 rounded-full bg-purple-300/60" />
            </div>
          </div>

          {/* Text + form */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            <div className="max-w-xl">
              <h3 className="text-white text-2xl md:text-3xl font-bold leading-tight mb-2">
                Restez connecté à la Parole
              </h3>
              <p className="text-purple-200 text-sm">
                Abonnez-vous pour recevoir les derniers enseignements, événements et actualités du ministère.
              </p>
            </div>

            <div className="w-full lg:w-auto shrink-0">
              {subscribed ? (
                <p className="text-yellow-300 font-medium text-sm">✓ Merci ! Vous êtes bien abonné(e).</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 w-full lg:w-[400px]">
                  <div className="flex-1 flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-2">
                    <Mail className="w-4 h-4 text-white/60 shrink-0" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Votre adresse e-mail"
                      className="bg-transparent text-white placeholder-white/50 text-sm outline-none w-full"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-white text-purple-800 font-semibold rounded-full px-6 py-2 text-sm hover:bg-yellow-400 hover:text-gray-900 transition-colors duration-200 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    S'abonner
                  </button>
                </form>
              )}
              <p className="text-purple-300/70 text-[11px] mt-2 lg:text-right">
                Vous pourrez vous désabonner à tout moment. Nous respectons votre vie privée.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="bg-gray-50 border-t border-gray-100 pt-20 pb-10 px-8 md:px-16 lg:px-24 xl:px-32">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

            {/* Brand column */}
            <div className="md:col-span-2 space-y-5">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo-site.png" 
                  alt="Joy Alawey Ministries Logo" 
                  className="h-24 w-auto object-contain"
                />
              </div>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                Un ministère fondé sur la Parole de Dieu, dédié à l'enseignement, l'adoration et la communion fraternelle, sous le leadership du visionnaire Pastor.
              </p>
              {/* Social icons */}
              <div className="flex items-center gap-3 pt-1">
                {[
                  { Icon: FacebookIcon, href: "#", label: "Facebook" },
                  { Icon: TwitterIcon, href: "#", label: "Twitter" },
                  { Icon: InstagramIcon, href: "#", label: "Instagram" },
                  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-purple-800 hover:text-white text-gray-500 flex items-center justify-center transition-colors duration-200"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">Ministère</h4>
              <ul className="space-y-3">
                {[
                  { label: "Accueil", href: "/" },
                  { label: "Événements", href: "/evenements" },
                  { label: "Enseignements", href: "/enseignements" },
                  { label: "Organisations", href: "/organisations" },
                  { label: "Faire un Don", href: "/dons" },
                ].map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href} className="text-gray-500 hover:text-purple-800 text-sm transition-colors duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organisations */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">Organisations</h4>
              <ul className="space-y-3">
                {displayOrgs.map((org: any) => (
                  <li key={org.id || org.acronym}>
                    <Link href="/organisations" className="text-gray-500 hover:text-purple-800 text-sm transition-colors duration-150">
                      {org.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-5 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <Phone className="w-4 h-4 shrink-0 mt-0.5 text-purple-700" />
                  <span className="leading-relaxed">
                    +225 07 98 18 94 06 <br />
                    +225 07 02 20 17 29 <br />
                    +225 01 41 30 42 38
                  </span>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <Mail className="w-4 h-4 shrink-0 mt-0.5 text-purple-700" />
                  <a href="mailto:contact@ointjoyalaw.com" className="hover:text-purple-800 transition-colors">
                    contact@ointjoyalaw.com
                  </a>
                </li>
                <li className="flex items-start gap-2 text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-purple-700" />
                  Abidjan, Côte d'Ivoire
                </li>
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Joy Alawey Ministries. Tous droits réservés.
            </p>
            <div className="flex items-center gap-5 text-sm text-gray-400">
              <Link href="#" className="hover:text-purple-700 transition-colors">Politique de confidentialité</Link>
              <Link href="#" className="hover:text-purple-700 transition-colors">Conditions d'utilisation</Link>
              <Link href="#" className="hover:text-purple-700 transition-colors">Mentions légales</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
