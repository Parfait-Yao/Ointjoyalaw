"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import {
  LayoutDashboard, Calendar, Ticket, CreditCard,
  Mail, LogOut, BookOpen, Users, ChevronRight, Cross, ExternalLink
} from "lucide-react"

const navGroups = [
  {
    label: "Général",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Tableau de bord", exact: true },
    ]
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/evenements", icon: Calendar, label: "Événements" },
      { href: "/admin/enseignements", icon: BookOpen, label: "Enseignements" },
    ]
  },
  {
    label: "Communauté",
    items: [
      { href: "/admin/billets", icon: Ticket, label: "Billets" },
      { href: "/admin/paiements", icon: CreditCard, label: "Paiements" },
    ]
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/newsletter", icon: Mail, label: "Newsletter" },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname?.startsWith(href)

  return (
    <aside className="w-64 bg-[#0f0a1e] border-r border-white/5 text-white min-h-screen flex flex-col hidden md:flex shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-900/50">
          <Cross className="w-4 h-4 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-bold text-sm text-white">OJM Admin</p>
          <p className="text-[10px] text-purple-400 tracking-widest uppercase">Ministries</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-white/30 px-3 mb-2">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, (item as any).exact)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                      ${active
                        ? "bg-purple-600/20 text-white border border-purple-500/30"
                        : "text-white/50 hover:text-white hover:bg-white/5"
                      }
                    `}
                  >
                    <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-purple-400" : ""}`} />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="w-3 h-3 text-purple-400" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <ExternalLink className="h-4 w-4" />
          Voir le site
        </Link>
        {/* Avatar + session */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 mt-2">
          <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-xs font-bold shrink-0">
            {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{session?.user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-white/40 truncate">{session?.user?.email ?? ""}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-red-900/20 transition-all"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
