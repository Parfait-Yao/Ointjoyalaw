"use client"

import { usePathname } from "next/navigation"
import { Bell, Search, Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAdminSidebar } from "./AdminSidebarContext"

const pageTitles: Record<string, string> = {
  "/admin": "Tableau de bord",
  "/admin/evenements": "Événements",
  "/admin/enseignements": "Enseignements",
  "/admin/billets": "Billets",
  "/admin/paiements": "Paiements",
  "/admin/newsletter": "Newsletter",
}

export function AdminTopbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { toggle } = useAdminSidebar()

  const title = Object.entries(pageTitles)
    .reverse()
    .find(([key]) => pathname?.startsWith(key))?.[1] ?? "Admin"

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="p-2 -ml-2 text-gray-400 hover:text-gray-600 md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div>
          <h1 className="font-bold text-gray-900 text-sm md:text-base leading-none">{title}</h1>
          <p className="hidden md:block text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">Ointjoyalaw Ministries</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-400">
          <Search className="w-3.5 h-3.5" />
          <span>Rechercher...</span>
        </div>
        <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600" />
        </button>
        <div className="w-9 h-9 rounded-full bg-purple-700 flex items-center justify-center text-white text-sm font-bold">
          {session?.user?.name?.[0]?.toUpperCase() ?? "A"}
        </div>
      </div>
    </header>
  )
}
