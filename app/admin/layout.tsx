import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext"
import { Sidebar } from "@/components/admin/Sidebar"
import { AdminTopbar } from "@/components/admin/AdminTopbar"
import { Toaster } from "@/components/ui/sonner"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login")
  }

  return (
    <AdminSidebarProvider>
      <div className="flex min-h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 relative h-screen">
          <AdminTopbar />
          <main className="flex-1 p-4 md:p-10 overflow-auto bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      <Toaster position="top-right" richColors closeButton />
    </AdminSidebarProvider>
  )
}
