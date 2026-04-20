import { prisma } from "@/lib/prisma"
import { EventsTable } from "@/components/admin/EventsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: { select: { tickets: true } },
      organizations: true
    }
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Événements</h1>
          <p className="text-sm text-gray-500">Gestion de vos événements et de leurs capacités.</p>
        </div>
        <Link
          href="/admin/evenements/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 transition-all shadow-lg shadow-purple-600/20 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nouvel Événement
        </Link>
      </div>

      <EventsTable events={events} />
    </div>
  )
}
