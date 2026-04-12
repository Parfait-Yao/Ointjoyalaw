"use client"

import { OrganizationCard } from "@/components/public/OrganizationCard"
import { Globe, Heart, Sparkles, Star } from "lucide-react"
import NextImage from "next/image"
import Link from "next/link"

export default function OrganisationsPage() {
  const organizations = [
    {
      name: "Let There Be Joy",
      acronym: "LTBJ",
      description: "Fondée sur le principe de partager le bonheur de Christ, LTBJ mène des actions caritatives, visite les orphelinats et apporte de l'aide aux personnes démunies.",
      website: "#"
    },
    {
      name: "ARMES",
      acronym: "AR",
      description: "Association pour la Restauration des Mœurs Étudiantes et Scolaires. Ce mouvement vise à inculquer des valeurs morales et chrétiennes à la jeunesse en milieu scolaire.",
      website: "#"
    },
    {
      name: "Mouvement Chrétien des Artistes",
      acronym: "MCA",
      description: "Un regroupement d'artistes chrétiens dédiés à utiliser leur art pour la gloire de Dieu et l'édification de l'Église.",
      website: "#"
    },
    {
      name: "Association des Médecins Évangéliques du Salut",
      acronym: "AMES",
      description: "Des professionnels de la santé chrétiens qui offrent des consultations gratuites et des campagnes de dépistage, alliant guérison physique et spirituelle.",
      website: "#"
    },
  ]

  const cloudImages = [
    { url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800", height: "h-48 md:h-64", mt: "mt-12" },
    { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800", height: "h-64 md:h-80", mt: "mt-0" },
    { url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=800", height: "h-72 md:h-96", mt: "mt-8" },
    { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800", height: "h-56 md:h-72", mt: "mt-20" },
    { url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800", height: "h-64 md:h-80", mt: "mt-4" },
  ]


  return (
    <div className="bg-white min-h-screen">

      {/* ── PURPLE LUXE BANNER ────────────────────────────── */}
      <section className="relative min-h-[400px] md:h-[450px] flex items-center justify-center overflow-hidden pt-24 pb-12 md:pt-0 md:pb-0">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-[#3b0a68]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#3b0a68] via-[#3b0a68]/95 to-transparent z-10" />

        {/* Background Texture (Impact/Global) */}
        <div className="absolute right-0 top-0 w-1/2 h-full z-0 opacity-20">
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80')] bg-cover bg-center grayscale contrast-125" />
        </div>

        <div className="container relative z-20 mx-auto px-4 md:px-6 text-center">
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
        <div className="container mx-auto px-4">
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
                  sizes="(max-w-768px) 128px, 192px"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3b0a68]/20" />
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── ORGANISATIONS GRID ────────────────────────────── */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          {/* Testimonials Style - Organization Grid */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {organizations.map((org: any, idx: number) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 text-left flex flex-col items-start hover:shadow-[0_40px_80px_rgba(59,10,104,0.08)] transition-all duration-500 group"
              >
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((i: number) => (
                    <Star key={i} className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                  ))}
                </div>

                <p className="text-gray-600 font-medium leading-relaxed mb-8 flex-1">
                  &quot;{org.description}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4ecf9] flex items-center justify-center font-black text-[#3b0a68] text-sm group-hover:bg-[#3b0a68] group-hover:text-white transition-colors duration-300">
                    {org.acronym}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-none mb-1">{org.name}</h3>
                    <p className="text-xs text-[#d4af37] font-bold uppercase tracking-widest leading-none">Organisation Affiliée</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Special Call to Action Card */}
            <div className="bg-[#3b0a68] p-8 rounded-[2rem] shadow-2xl text-left flex flex-col items-start text-white group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <Sparkles className="h-6 w-6 text-[#d4af37]" />
              </div>
              <h3 className="text-2xl font-black mb-4">Rejoindre une Mission ?</h3>
              <p className="text-purple-100/70 font-medium mb-8">
                Vous avez un talent, une expertise ou simplement le désir de servir ?
                Il y a une place pour vous dans nos missions.
              </p>
              <Link
                href="/contact"
                className="mt-auto bg-[#d4af37] text-[#3b0a68] font-black rounded-xl px-6 py-3 text-sm uppercase tracking-widest hover:bg-white transition-colors"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Global Style for Animations */}
      <style jsx global>{`
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
      `}</style>
    </div>
  )
}
