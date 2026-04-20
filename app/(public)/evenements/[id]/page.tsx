import { prisma } from "@/lib/prisma"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { notFound } from "next/navigation"
import Link from "next/link"
import { EventDetailsClient } from "@/components/public/EventDetailsClient"

export const dynamic = "force-dynamic"

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: true,
      organizations: true,
      _count: { select: { tickets: true } }
    }
  })

  if (!event) notFound()

  const serializedEvent = {
    ...event,
    startDate: event.startDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
    price: event.price,
    ticketTypes: event.ticketTypes.map(tt => ({
      ...tt,
      price: Number(tt.price),
    })),
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Link href="/evenements" className="text-sm text-purple-700 hover:underline mb-6 inline-block">
        &larr; Retour aux événements
      </Link>

      <EventDetailsClient event={serializedEvent} />
    </div>
  )
}
