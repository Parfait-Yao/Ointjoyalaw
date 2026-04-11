import { prisma } from "@/lib/prisma"
import { EventsTable } from "@/components/admin/EventsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: { select: { tickets: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Événements</h1>
          <p className="text-gray-500">Gestion de vos événements et de leurs capacités.</p>
        </div>
        <Button className="bg-purple-800 hover:bg-purple-900" render={<Link href="/admin/evenements/nouveau" />}>
          <Plus className="mr-2 h-4 w-4" /> Nouvel Événement
        </Button>
      </div>

      <EventsTable events={events} />
    </div>
  )
}
