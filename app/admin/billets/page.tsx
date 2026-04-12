import { prisma } from "@/lib/prisma"
import { TicketsTable } from "@/components/admin/TicketsTable"

export default async function AdminTicketsPage() {
  const tickets = await prisma.ticket.findMany({
    include: {
      user: true,
      event: true,
      ticketType: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100 // Limit for demo
  })

  // Format array to match TickstTable props interface
  const formattedTickets = tickets.map((t: any) => ({
    ...t,
    status: t.status as "PENDING" | "PAID" | "USED" | "CANCELLED",
    ticketType: {
      ...t.ticketType,
      price: Number(t.ticketType.price)
    }
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Billets</h1>
          <p className="text-sm text-gray-500">Gestion des billets vendus et réservations.</p>
        </div>
      </div>

      <TicketsTable tickets={formattedTickets} />
    </div>
  )
}
