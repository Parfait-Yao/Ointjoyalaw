import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/20 z-10" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center rounded-full border border-gray-200 bg-white/50 px-3 py-1 text-sm font-medium text-gray-800 backdrop-blur-sm mb-6">
          <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2" />
          Bienvenue chez Ointjoyalaw Ministries
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl mb-6">
          Découvrez la Joie de <span className="text-purple-800">l'Évangile</span> et Transformez votre Vie
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Un ministère fondé sur la parole de Dieu, dédié à l'enseignement, l'adoration et la communion fraternelle, sous le leadership du visionnaire Pastor.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="bg-purple-800 hover:bg-purple-900 text-white rounded-full px-8">
            <Link href="/evenements">
              Prochains Événements <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-gray-300">
            <Link href="/dons">Faire un Don</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
