"use client"

import { Play, BookOpen, CalendarDays, Heart } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TeachingProps {
  id: string
  title: string
  youtubeUrl?: string | null
  videoUrl?: string | null
  imageUrl?: string | null
  category?: string | null
  publishedAt: Date | string
}

export function TeachingCard({ 
  title, 
  youtubeUrl, 
  videoUrl, 
  imageUrl,
  category, 
  publishedAt 
}: TeachingProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const date = mounted 
    ? new Date(publishedAt).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  const ytId = getYoutubeId(youtubeUrl)
  const ytThumbnail = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : null
  
  // Priorité : Image uploadée > Miniature YouTube > Placeholder (BookOpen)
  const displayImage = imageUrl || ytThumbnail
  const hasVideo = !!youtubeUrl || !!videoUrl

  return (
    <div className="group relative bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(59,10,104,0.12)] transition-all duration-700 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
      {/* ── IMAGE / MEDIA HEADER ────────────────────────── */}
      <div className="relative h-56 bg-[#3b0a68] overflow-hidden">
        {displayImage ? (
          <img 
            src={displayImage} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#3b0a68] to-[#1a052e] flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-[#d4af37]/30" />
          </div>
        )}
        
        {/* Overlay Noir Graduel pour la lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
        
        {/* Play Icon Overlay (si vidéo présente) */}
        {hasVideo && (
            <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white shadow-2xl">
                    <Play className="w-6 h-6 fill-current" />
                </div>
            </div>
        )}

        {/* Category Badge Overlay */}
        <div className="absolute top-6 left-6 z-10">
          <Badge className="bg-[#d4af37] text-[#3b0a68] border-none text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
            {category || "Foi"}
          </Badge>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-8">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold mb-4 uppercase tracking-wider">
          <CalendarDays className="w-4 h-4 text-[#3b0a68]" />
          <span>{date}</span>
        </div>

        <h3 className="font-extrabold text-gray-900 text-2xl leading-[1.2] mb-8 line-clamp-2 min-h-[3rem] group-hover:text-[#3b0a68] transition-colors duration-300">
          {title}
        </h3>

        <div className="mt-auto flex items-center gap-3">
          <div className="flex-1">
            {hasVideo ? (
              uploadTypeLogic(youtubeUrl, videoUrl, title, isOpen, setIsOpen)
            ) : (
              <div className="flex items-center justify-center gap-3 rounded-full py-4 text-xs font-bold bg-gray-50 text-gray-300 cursor-not-allowed">
                <Play className="w-4 h-4" />
                ARCHIVÉ
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className={`group/heart w-14 h-14 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 active:scale-90 ${
              liked
                ? "bg-red-50 border-red-200 text-red-500 shadow-lg shadow-red-500/20"
                : "bg-white border-gray-100 text-gray-300 hover:border-gray-200 hover:text-gray-400"
            }`}
            aria-label={liked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 group-hover/heart:scale-110 ${
                liked ? "fill-red-500 text-red-500" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

function uploadTypeLogic(youtubeUrl: string | null | undefined, videoUrl: string | null | undefined, title: string, isOpen: boolean, setIsOpen: (o: boolean) => void) {
  if (youtubeUrl || videoUrl) {
    const ytId = getYoutubeId(youtubeUrl)
    
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger
          render={
            <button
              type="button"
              className="group/btn w-full flex items-center justify-center gap-3 rounded-2xl py-5 text-sm font-black uppercase tracking-wider bg-gradient-to-r from-[#3b0a68] to-[#5b1a98] text-white hover:from-[#2d0852] hover:to-[#4a1280] transition-all duration-300 shadow-xl shadow-purple-900/30 hover:shadow-2xl hover:shadow-purple-900/40 active:scale-[0.98]"
            />
          }
        >
          <Play className="w-5 h-5 fill-current transition-transform group-hover/btn:scale-110" />
          LIRE LA VIDÉO
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none rounded-3xl">
          <div className="relative pt-[56.25%]">
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl || ""}
                controls
                autoPlay
                className="absolute inset-0 w-full h-full"
              />
            )}
          </div>
          <div className="p-4 bg-white/10 backdrop-blur-md flex items-center justify-between">
            <h4 className="text-white font-bold text-sm truncate pr-4">{title}</h4>
          </div>
        </DialogContent>
      </Dialog>
    )
  }
}

function getYoutubeId(url: string | null | undefined) {
  if (!url) return null
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? match[1] : null
}
