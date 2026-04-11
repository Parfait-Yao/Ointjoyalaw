"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Calendar, MapPin, Users, ArrowRight } from "lucide-react"
import { EventCard } from "./EventCard"
import { Input } from "@/components/ui/input"

interface Event {
  id: string
  title: string
  description: string | null
  startDate: Date | string
  location: string | null
  capacity: number | null
  imageUrl: string | null
  category: string | null
}

interface EventsGridProps {
  initialEvents: Event[]
}

const CATEGORIES = ["Tous", "Culte", "Jeunesse", "Séminaire", "Concert", "Conférence", "Autre"]

export function EventsGrid({ initialEvents }: EventsGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesCategory = selectedCategory === "Tous" || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, initialEvents])

  const now = new Date()
  const upcomingEvents = filteredEvents.filter(e => new Date(e.startDate) >= now)
  const pastEvents = filteredEvents.filter(e => new Date(e.startDate) < now)

  return (
    <div className="space-y-12">
      {/* Search and Filter Bar */}
      <div className="sticky top-20 z-30 translate-y-8 max-w-5xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Input */}
            <div className="relative w-full lg:w-1/3">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b0a68]/50" />
              <Input
                placeholder="Chercher un événement..."
                className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-2xl focus:ring-[#3b0a68]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div className="flex-1 w-full overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-2 min-w-max">
                <Filter className="h-4 w-4 text-[#3b0a68]/40 mr-2 shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                      selectedCategory === cat
                        ? "bg-[#3b0a68] text-white shadow-lg shadow-purple-900/20 px-6"
                        : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="container mx-auto px-4 pb-20">
        {/* Dynamic section title based on search/filter */}
        <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm || selectedCategory !== "Tous" ? "Résultats de recherche" : "Événements à venir"}
            </h2>
            <p className="text-sm text-gray-500 font-medium bg-gray-100 px-3 py-1 rounded-full">
                {upcomingEvents.length} évènement{upcomingEvents.length > 1 ? 's' : ''} trouvé{upcomingEvents.length > 1 ? 's' : ''}
            </p>
        </div>

        {upcomingEvents.length > 0 || pastEvents.length > 0 ? (
          <div className="space-y-16">
            {upcomingEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map(event => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            )}

            {(searchTerm || selectedCategory !== "Tous") && pastEvents.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px bg-gray-100 flex-1" />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Événements passés correspondants</span>
                  <div className="h-px bg-gray-100 flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70">
                  {pastEvents.map(event => (
                    <EventCard key={event.id} {...event} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50/50 border border-dashed border-gray-200 rounded-[2.5rem]">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun événement trouvé</h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Essayez de modifier vos critères de recherche ou de changer de catégorie.
            </p>
          </div>
        )}

        {/* Default Past Events (shown only on initial state) */}
        {!searchTerm && selectedCategory === "Tous" && pastEvents.length > 0 && (
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-10">
                <div className="h-px bg-gray-200 flex-1" />
                <h2 className="text-xl font-bold text-gray-400">Événements Passés</h2>
                <div className="h-px bg-gray-200 flex-1" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
              {pastEvents.map(event => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
