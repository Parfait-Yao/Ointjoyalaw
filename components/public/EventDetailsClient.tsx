"use client"

import { useEffect, useState } from "react"
import { Calendar, MapPin, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { RegistrationModal } from "@/components/public/RegistrationModal"

interface EventDetailsClientProps {
  event: {
    id: string
    title: string
    description: string | null
    startDate: string
    location: string | null
    capacity: number | null
    imageUrl: string | null
    category: string | null
    isFree: boolean
    price: number | null
    organizations: { id: string; name: string; acronym: string | null }[]
    _count: { tickets: number }
  }
}

export function EventDetailsClient({ event }: EventDetailsClientProps) {
  const [showModal, setShowModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const date = new Date(event.startDate)
  const isPast = date < new Date()

  return (
    <>
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
            {event.organizations && event.organizations.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {event.organizations.map((org) => (
                  <span key={org.id} className="inline-flex items-center px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold uppercase tracking-widest text-[#3b0a68]">
                    {org.name} {org.acronym ? `(${org.acronym})` : ''}
                  </span>
                ))}
              </div>
            )}
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
                  <p>{mounted ? format(date, "EEEE d MMMM yyyy", { locale: fr }) : "..."}</p>
                  <p>{mounted ? format(date, "HH:mm", { locale: fr }) : "..."}</p>
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
                  L&apos;événement est terminé
                </p>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-purple-800 hover:bg-purple-900 py-6 text-lg rounded-xl shadow-md"
                  >
                    {event.isFree ? "S'inscrire (Gratuit)" : "Acheter un billet"}
                  </Button>
                  
                  <div className="p-4 bg-gray-50 rounded-xl border flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">Tarif :</span>
                    <span className="font-bold text-lg text-purple-900">
                      {event.isFree ? "Gratuit" : (event.price ? `${Number(event.price).toLocaleString()} FCFA` : "Non spécifié")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <RegistrationModal
        eventId={event.id}
        eventTitle={event.title}
        isFree={event.isFree}
        price={event.price}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  )
}
