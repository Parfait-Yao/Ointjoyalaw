"use client"

import Link from "next/link"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface EventProps {
  id: string
  title: string
  description?: string | null
  startDate: Date | string
  location?: string | null
  imageUrl?: string | null
  category?: string | null
  organizations?: { id: string, name: string, acronym: string | null }[]
}

export function EventCard({ id, title, description, startDate, location, imageUrl, category, organizations = [] }: EventProps) {
  const date = new Date(startDate)
  const day = format(date, "dd")
  const month = format(date, "MMM", { locale: fr }).replace('.', '')

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(59,10,104,0.15)] transition-all duration-700 hover:-translate-y-3 overflow-hidden flex flex-col h-full">
      {/* Visual Header / Image Section */}
      <div className="relative h-64 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-50 to-white flex items-center justify-center text-purple-200">
            <Calendar className="h-20 w-20 opacity-20" />
          </div>
        )}
        
        {/* Date Floating Badge */}
        <div className="absolute top-6 right-6 z-20">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center justify-center min-w-[60px] shadow-2xl border border-white/50 transform group-hover:scale-110 transition-transform duration-500">
                <span className="text-2xl font-black text-gray-900 leading-none">{day}</span>
                <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-tighter mt-1">{month}</span>
            </div>
        </div>

        {/* Category Overlay */}
        <div className="absolute bottom-6 left-6 z-20">
            <span className="bg-[#3b0a68]/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/20">
                {category || "Programme"}
            </span>
        </div>

        {/* Gradient Bottom Fade */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900/60 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-8">
        {/* Organizations Involved */}
        {organizations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {organizations.map((org) => (
              <span key={org.id} className="inline-flex items-center px-3 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-black uppercase tracking-widest text-[#3b0a68]">
                {org.acronym || org.name}
              </span>
            ))}
          </div>
        )}
        
        <h3 className="font-black text-2xl text-gray-900 mb-4 leading-tight group-hover:text-[#3b0a68] transition-colors duration-300 line-clamp-2">
          {title}
        </h3>

        <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-2 opacity-80">
          {description || "Joignez-vous à nous pour ce moment extraordinaire de communion fraternelle et d'édification spirituelle."}
        </p>
        
        <div className="mt-auto space-y-4">
          <div className="flex items-center gap-4 group/info transition-all">
             <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover/info:bg-[#3b0a68] transition-colors duration-300">
                <Calendar className="h-5 w-5 text-[#3b0a68] group-hover/info:text-white" />
             </div>
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Horaire</p>
                <p className="text-sm font-bold text-gray-700 capitalize">{format(date, "iiii d MMMM 'à' HH:mm", { locale: fr })}</p>
             </div>
          </div>
          
          {location && (
            <div className="flex items-center gap-4 group/info transition-all">
               <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100 group-hover/info:bg-[#3b0a68] transition-colors duration-300">
                  <MapPin className="h-5 w-5 text-[#3b0a68] group-hover/info:text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Lieu</p>
                  <p className="text-sm font-bold text-gray-700 line-clamp-1">{location}</p>
               </div>
            </div>
          )}
        </div>

        <Link 
          href={`/evenements/${id}`}
          className="mt-10 w-full bg-[#3b0a68] hover:bg-[#2d0852] text-white rounded-2xl h-14 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-purple-900/20 group/btn"
        >
          Détails & Inscription
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-2" />
        </Link>
      </div>
    </div>
  )
}
