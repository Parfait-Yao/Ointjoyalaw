import { HeroSection } from "@/components/public/HeroSection"
import { EventCard } from "@/components/public/EventCard"
import { TeachingCard } from "@/components/public/TeachingCard"
import { OrganizationCard } from "@/components/public/OrganizationCard"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default async function HomePage() {
  const events = await prisma.event.findMany({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: 3
  })

  // Real teachings from DB
  const teachings = await prisma.teaching.findMany({
    orderBy: { publishedAt: "desc" },
    take: 4,
  })

  const organizations = [
    { name: "Let There Be Joy", acronym: "LTBJ", description: "Notre programme caritatif pour apporter la joie." },
    { name: "ARMES", acronym: "AR", description: "Association pour la restauration des mœurs étudiantes." },
    { name: "MCA", acronym: "MC", description: "Mouvement Chrétien des Artistes, promouvoir l'art saint." },
    { name: "AMES", acronym: "AM", description: "Association des Médecins Évangéliques du Salut." },
  ]

  return (
    <div>
      <HeroSection />

      {/* Prochains Événements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Prochains Événements</h2>
              <p className="text-gray-500">Rejoignez-nous pour nos prochains rassemblements.</p>
            </div>
            <Link href="/evenements" className="hidden sm:inline-flex text-purple-700 hover:text-purple-900 font-medium items-center">
              Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.length > 0 ? (
              events.map((event: any) => (
                <EventCard key={event.id} {...event} />
              ))
            ) : (
              <p className="text-gray-500 col-span-full">Aucun événement à venir pour le moment.</p>
            )}
          </div>
          <div className="mt-8 sm:hidden text-center">
            <Button variant="outline" render={<Link href="/evenements" />} className="w-full">
              Voir tous les événements
            </Button>
          </div>
        </div>
      </section>

      {/* Enseignements Récents */}
      <section className="relative py-24 overflow-hidden">
        {/* Rich gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-800" />
        {/* Decorative blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute top-1/2 left-0 w-64 h-64 rounded-full bg-violet-600/10 blur-2xl" />

        <div className="relative z-10 container mx-auto px-4 md:px-6">
          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-purple-300 text-xs font-semibold tracking-widest uppercase mb-3">
              <span className="w-4 h-px bg-purple-400" />
              Parole de Dieu
              <span className="w-4 h-px bg-purple-400" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Enseignements Récents
            </h2>
            <p className="text-purple-200/80">
              Nourrissez votre foi avec les derniers messages et études bibliques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {teachings.map((teaching: any) => (
              <TeachingCard key={teaching.id} {...teaching} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/enseignements"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/20 rounded-full px-8 py-3 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-900/40"
            >
              Tous les enseignements
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Équipe Pastorale Section */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#3b0a68] text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="w-8 h-px bg-[#d4af37]" />
              L'Équipe Pastorale
              <span className="w-8 h-px bg-[#d4af37]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 text-center">
              Nos <span className="text-[#3b0a68]">Responsables</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed text-center">
              Une équipe dévouée pour vous accompagner dans votre parcours spirituel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Visionnaire Titulaire", role: "Pasteur Principal", image: "/images/team-leader.png" },
              { name: "Pasteure Adjointe", role: "Responsable Adoration", image: "/images/team-female.png" },
              { name: "Pasteur des Jeunes", role: "Responsable Jeunesse", image: "/images/team-male.png" },
              { name: "Évangéliste Principal", role: "Responsable Missions", image: "/images/team-male.png" },
            ].map((member: any) => (
              <div key={member.name} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative h-64 w-full">
                  <Image src={member.image} alt={member.name} fill className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3b0a68]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                  <p className="text-[#3b0a68] text-sm font-semibold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/leader" className="inline-flex items-center gap-2 text-[#3b0a68] font-bold hover:underline">
              Rencontrer toute l'équipe <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Organisations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12 text-center">Nos Organisations Affiliées</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {organizations.map((org: any) => (
              <OrganizationCard key={org.acronym} {...org} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
