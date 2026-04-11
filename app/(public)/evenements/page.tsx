import { prisma } from "@/lib/prisma"
import { Calendar, Bell, Sparkles } from "lucide-react"
import { EventsGrid } from "@/components/public/EventsGrid"

export default async function PublicEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { startDate: "asc" }
  })

  // We pass serializable data to the client component
  const serializedEvents = events.map((event: any) => ({
    ...event,
    startDate: event.startDate.toISOString(),
    createdAt: event.createdAt.toISOString(),
  }))

  const cloudImages = [
    { url: "https://images.unsplash.com/photo-1510673398415-c411263fd6e4?q=80&w=800", h: "h-48 md:h-64", mt: "mt-16" },
    { url: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800", h: "h-64 md:h-80", mt: "mt-0" },
    { url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=800", h: "h-72 md:h-96", mt: "mt-10" },
    { url: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=800", h: "h-56 md:h-72", mt: "mt-24" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800", h: "h-64 md:h-80", mt: "mt-6" },
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* ── HIGH-END HEADER BANNER ─────────────────────────── */}
      <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
        {/* Background Layer with dual gradients */}
        <div className="absolute inset-0 bg-[#3b0a68]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3b0a68] via-[#3b0a68]/90 to-transparent z-10" />
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-l from-[#3b0a68] to-transparent z-10" />
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale" />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[60%] bg-white/5 rounded-full blur-3xl rotate-12" />
            <div className="absolute bottom-[20%] right-[5%] w-[30%] h-[40%] bg-[#d4af37]/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-6 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase">
                    Agenda du Ministère
                </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1]">
                Annonce <span className="text-[#d4af37]">d&apos;Évènements</span>
            </h1>
            
            <p className="text-xl text-purple-100/80 leading-relaxed max-w-2xl mb-8">
                Ne manquez aucun de nos rendez-vous divins. Retrouvez ici tous les cultes, 
                séminaires et programmes spéciaux de Ointjoyalaw Ministries.
            </p>

            <div className="flex items-center justify-center gap-8 border-t border-white/10 pt-8 w-full max-w-md">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Calendar className="h-5 w-5 text-[#d4af37]" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Fréquence</p>
                        <p className="text-white font-medium">Hebdomadaire</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Bell className="h-5 w-5 text-[#d4af37]" />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Alertes</p>
                        <p className="text-white font-medium">Notifications ON</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE GRID (SEARCH + FILTERS) ───────────── */}
      <EventsGrid initialEvents={serializedEvents} />
    </div>
  )
}
