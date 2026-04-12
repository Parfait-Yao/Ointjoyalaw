"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface SidebarContextType {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  // Close sidebar when navigating
  useEffect(() => {
    close()
  }, [pathname])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useAdminSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useAdminSidebar must be used within an AdminSidebarProvider")
  }
  return context
}
