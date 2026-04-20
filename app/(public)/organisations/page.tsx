import { Globe, Heart, Sparkles, Star, CalendarDays, ExternalLink } from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { OrganizationCard } from "@/components/public/OrganizationCard"

export const dynamic = "force-dynamic"

export default async function OrganisationsPage() {
  const organizationsDb = await prisma.organization.findMany({
    orderBy: { createdAt: "asc" }
  })

  // Fallback organizations if DB is empty
  const defaultOrgs = [
    {
      id: "1",
      name: "Let There Be Joy",
      acronym: "LTBJ",
      description: "Fondée sur le principe de partager le bonheur de Christ, LTBJ mène des actions caritatives, visite les orphelinats et apporte de l'aide aux personnes démunies.",
      role: "Action Sociale",
      websiteUrl: "#",
      imageUrl: null,
      creationDate: null
    },
    {
      id: "2",
      name: "ARMES",
      acronym: "AR",
      description: "Association pour la Restauration des Mœurs Étudiantes et Scolaires. Ce mouvement vise à inculquer des valeurs morales et chrétiennes à la jeunesse en milieu scolaire.",
      role: "Éducation",
      websiteUrl: "#",
      imageUrl: null,
      creationDate: null
    },
    {
      id: "3",
      name: "Mouvement Chrétien des Artistes",
      acronym: "MCA",
      description: "Un regroupement d'artistes chrétiens dédiés à utiliser leur art pour la gloire de Dieu et l'édification de l'Église.",
      role: "Arts & Culture",
      websiteUrl: "#",
      imageUrl: null,
      creationDate: null
    },
    {
      id: "4",
      name: "Association des Médecins Évangéliques du Salut",
      acronym: "AMES",
      description: "Des professionnels de la santé chrétiens qui offrent des consultations gratuites et des campagnes de dépistage, alliant guérison physique et spirituelle.",
      role: "Santé",
      websiteUrl: "#",
      imageUrl: null,
      creationDate: null
    },
  ]

  const displayOrgs = organizationsDb.length > 0 ? organizationsDb : defaultOrgs

  const cloudImages = [
    { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800", height: "h-48 md:h-64", mt: "mt-12" },
    { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800", height: "h-64 md:h-80", mt: "mt-0" },
    { url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800", height: "h-72 md:h-96", mt: "mt-8" },
    { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800", height: "h-56 md:h-72", mt: "mt-20" },
    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800", height: "h-64 md:h-80", mt: "mt-4" },
  ]

  return (
    <div className="bg-white min-h-screen">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
      `}} />

      {/* ── PURPLE LUXE BANNER ────────────────────────────── */}
      <section className="relative min-h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-0 md:pb-0">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-[#3b0a68]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3b0a68] via-[#3b0a68]/95 to-transparent z-10" />

        {/* Background Texture (Impact/Global) */}
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 opacity-20">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale contrast-125" />
        </div>

        <div className="container relative z-20 mx-auto px-8 md:px-16 lg:px-24 xl:px-32 max-w-[1600px] text-center">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#d4af37] uppercase">
              Impact Global
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] animate-fade-in">
            Faire briller la <span className="text-[#d4af37]">Lumière</span> <br />
            <span className="font-light italic text-white/60">de Christ</span>
          </h1>

          <p className="text-xl text-purple-100/80 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-in">
            Nos organisations travaillent main dans la main pour transformer des vies,
            guérir des corps et élever une nouvelle génération de leaders onctionnés.
          </p>

          <div className="flex items-center justify-center gap-6 animate-fade-in">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Globe className="h-4 w-4 text-[#d4af37]" />
              <span>Missions Mondiales</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Heart className="h-4 w-4 text-[#d4af37]" />
              <span>Action Sociale</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMAGE CLOUD GALLERY (TESTIMONIAL GRID STYLE) ────── */}
      <section className="py-20 overflow-hidden bg-white">
        <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 max-w-[1600px]">
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 items-start">
            {cloudImages.map((img: any, idx: number) => (
              <div
                key={idx}
                className={`relative ${img.height} w-32 md:w-48 rounded-[2rem] overflow-hidden shadow-2xl transform transition-transform duration-1000 hover:scale-105 active:scale-95 ${img.mt} animate-float`}
                style={{ animationDelay: `${idx * 0.5}s` }}
              >
                <NextImage
                  src={img.url}
                  alt="Impact"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 192px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3b0a68]/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* ── ORGANISATIONS GRID ────────────────────────────── */}
      <section className="py-32 bg-[#fafafa]">
        <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32 max-w-[1600px]">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-16 pt-12">
            {displayOrgs.map((org: any, idx: number) => {
              return (
                <div key={org.id} className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.33%-1.5rem)] lg:w-[calc(25%-1.5rem)] max-w-[320px]">
                  <OrganizationCard {...org} />
                </div>
              )
            })}
          </div>

          {/* Special Call to Action Card separated from the grid layout */}
          <div className="max-w-4xl mx-auto mt-32">
            <div className="bg-[#3b0a68] p-10 rounded-[2.5rem] shadow-2xl text-center flex flex-col items-center text-white group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
              
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-6 relative z-10">
                <Sparkles className="h-8 w-8 text-[#d4af37]" />
              </div>
              <h3 className="text-3xl font-black mb-4 relative z-10">Rejoindre une Mission ?</h3>
              <p className="text-purple-100/80 font-medium mb-8 max-w-lg relative z-10">
                Vous avez un talent, une expertise ou simplement le désir de servir ?
                Il y a une place pour vous dans nos missions et organisations.
              </p>
              <Link
                href="/contact"
                className="relative z-10 bg-[#d4af37] text-[#3b0a68] font-black rounded-xl px-8 py-4 text-sm uppercase tracking-widest hover:bg-white transition-all hover:scale-105"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
