import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      ticketTypes: true,
      _count: { select: { tickets: true } }
    }
  })

  if (!event) notFound()

  const date = new Date(event.startDate)
  const isPast = date < new Date()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <Link href="/evenements" className="text-sm text-purple-700 hover:underline mb-6 inline-block">
        &larr; Retour aux événements
      </Link>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden bg-gray-200">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                Affiche indisponible
              </div>
            )}
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{event.title}</h1>
            <div className="prose prose-purple max-w-none text-gray-700">
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24 space-y-6">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Informations</h3>
            
            <div className="space-y-4 text-gray-600">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Date et heure</p>
                  <p>{format(date, "EEEE d MMMM yyyy", { locale: fr })}</p>
                  <p>{format(date, "HH:mm", { locale: fr })}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Lieu</p>
                  <p>{event.location || "Lieu à confirmer"}</p>
                </div>
              </div>

              {event.capacity && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Places</p>
                    <p>{event._count.tickets} / {event.capacity} réservées</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              {isPast ? (
                <p className="text-center font-medium text-red-600 bg-red-50 py-3 rounded-lg">
                  L'événement est terminé
                </p>
              ) : (
                <Button className="w-full bg-purple-800 hover:bg-purple-900 py-6 text-lg rounded-xl shadow-md">
                  Acheter un billet
                </Button>
              )}
            </div>
            
            {/* Ticket Types if applicable */}
            {!isPast && event.ticketTypes.length > 0 && (
              <div className="space-y-3 mt-4">
                <p className="text-sm font-semibold text-gray-700">Tarifs :</p>
                {event.ticketTypes.map((tt: any) => (
                  <div key={tt.id} className="flex justify-between items-center text-sm border p-2 rounded bg-gray-50">
                    <span>{tt.name}</span>
                    <span className="font-bold">{Number(tt.price).toLocaleString()} FCFA</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
