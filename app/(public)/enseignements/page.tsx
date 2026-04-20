import { prisma } from "@/lib/prisma"
import { Video, GraduationCap, Sparkles } from "lucide-react"
import { TeachingsGrid } from "@/components/public/TeachingsGrid"

export const dynamic = "force-dynamic"

export default async function EnseignementsPage() {
  const teachings = await prisma.teaching.findMany({
    orderBy: { publishedAt: "desc" }
  })

  // Serialize dates for Client Component
  const serializedTeachings = teachings.map((t: any) => ({
    ...t,
    publishedAt: t.publishedAt.toISOString(),
  }))

  const cloudImages = [
    { url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800", h: "h-48 md:h-64", mt: "mt-12" },
    { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800", h: "h-64 md:h-80", mt: "mt-0" },
    { url: "https://images.unsplash.com/photo-1504052434139-44b4ba9e5399?q=80&w=800", h: "h-72 md:h-96", mt: "mt-8" },
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800", h: "h-56 md:h-72", mt: "mt-20" },
    { url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800", h: "h-64 md:h-80", mt: "mt-4" },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* ── PREMIUM HEADER BANNER ─────────────────────────── */}
      <section className="relative min-h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-0 md:pb-0">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-[#3b0a68]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3b0a68] via-[#3b0a68]/95 to-transparent z-10" />
        
        {/* Background Textures */}
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 opacity-20">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale contrast-125" />
        </div>

        <div className="container relative z-20 mx-auto px-8 md:px-16 lg:px-24 xl:px-32 max-w-[1600px]">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase">
                    Ressources Spirituelles
                </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1]">
                Bibliothèque <br/>
                <span className="text-[#d4af37]">d&apos;Enseignements</span>
            </h1>
            
            <p className="text-xl text-purple-100/80 leading-relaxed max-w-xl mb-8">
                Nourrissez votre foi avec la profondeur de la parole révélée. Accédez à nos 
                prédications et études bibliques en vidéo.
            </p>

            <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Video className="h-4 w-4 text-[#d4af37]" />
                    <span>Vidéos HD</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2 text-white/60 text-sm">
                    <GraduationCap className="h-4 w-4 text-[#d4af37]" />
                    <span>Études Bibliques</span>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEACHINGS INTERACTIVE GRID (SEARCH + FILTERS) ──── */}
      <TeachingsGrid initialTeachings={serializedTeachings} />
    </div>
  )
}
