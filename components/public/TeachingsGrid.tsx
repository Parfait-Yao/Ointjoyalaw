"use client"

import { useState, useMemo } from "react"
import { Search, Filter, BookOpen, GraduationCap, Sparkles } from "lucide-react"
import { TeachingCard } from "./TeachingCard"
import { Input } from "@/components/ui/input"

interface Teaching {
  id: string
  title: string
  youtubeUrl: string | null
  videoUrl: string | null
  imageUrl: string | null

  category: string | null
  publishedAt: Date | string
}

interface TeachingsGridProps {
  initialTeachings: Teaching[]
}

const CATEGORIES = ["Tous", "Foi", "Grâce", "Vie Chrétienne", "Jeunesse", "Prière", "Autre"]

export function TeachingsGrid({ initialTeachings }: TeachingsGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")

  const filteredTeachings = useMemo(() => {
    return initialTeachings.filter((teaching) => {
      const title = teaching.title || ""
      const category = teaching.category || "Autre"
      
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "Tous" || category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory, initialTeachings])

  return (
    <div className="space-y-12">
      {/* ── SEARCH & FILTER BAR ────────────────────────── */}
      <div className="sticky top-20 z-30 translate-y-8 max-w-5xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Input */}
            <div className="relative w-full lg:w-1/2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3b0a68]/50" />
              <Input
                placeholder="Chercher un enseignement ou une thématique..."
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

      {/* ── TEACHINGS LIST ─────────────────────────────── */}
      <div className="container mx-auto px-4 pb-24 pt-10">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-3xl font-black text-gray-900">
                    {searchTerm || selectedCategory !== "Tous" ? "Résultats trouvés" : "Derniers Messages"}
                </h2>
                <div className="h-1.5 w-20 bg-[#d4af37] rounded-full mt-2" />
            </div>
            <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {filteredTeachings.length} Ressources disponibles
                </p>
            </div>
        </div>

        {filteredTeachings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredTeachings.map(teaching => (
              <TeachingCard key={teaching.id} {...teaching} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50/50 border border-dashed border-gray-200 rounded-[3rem]">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-8">
                <BookOpen className="h-10 w-10 text-gray-200" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucune ressource trouvée</h3>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              Nous n&apos;avons pas trouvé d&apos;enseignements correspondant à votre recherche. 
              Essayez des mots-clés plus généraux ou changez de catégorie.
            </p>
          </div>
        )}
      </div>

      {/* ── DECORATIVE SECTION ──────────────────────────── */}
      <div className="container mx-auto px-4 pb-20">
          <div className="bg-[#3b0a68] rounded-[3rem] p-12 relative overflow-hidden text-center text-white">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <div className="relative z-10 max-w-2xl mx-auto">
                  <div className="w-16 h-16 bg-[#d4af37] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
                      <GraduationCap className="h-8 w-8 text-[#3b0a68]" />
                  </div>
                  <h2 className="text-3xl font-black mb-4">Besoin d&apos;aller plus loin ?</h2>
                  <p className="text-purple-100/70 mb-8 leading-relaxed">
                      Nos académies bibliques et nos sessions d&apos;étude sont ouvertes 
                      chaque semaine. Rejoignez-nous pour approfondir votre connaissance de la Parole.
                  </p>
                  <button className="bg-white text-[#3b0a68] px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#d4af37] hover:text-white transition-all duration-500 shadow-xl">
                      Nous contacter
                  </button>
              </div>
          </div>
      </div>
    </div>
  )
}
