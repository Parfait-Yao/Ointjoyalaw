import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Play, Clock, MapPin, Calendar } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-white overflow-hidden flex flex-col">

      {/* ── Main hero area ─────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row items-center px-8 md:px-16 lg:px-24 xl:px-32 pt-28 pb-6 md:pt-12 gap-10 lg:gap-0 max-w-[1600px] mx-auto w-full">

        {/* ── Left: Text ─────────────────────────────── */}
        <div className="flex-1 z-10 lg:pr-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 bg-[#f4ecf9] border border-[#3b0a68]/15 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-[#3b0a68] uppercase">
              Bienvenue chez Joy Alawey Ministries
            </span>
          </div>

          {/* Headline — split like the reference */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-gray-900 mb-2">
            Découvrez la Joie
          </h1>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-[#3b0a68] mb-7">
            de l&apos;Évangile
          </h1>

          {/* Sub text */}
          <p className="text-gray-500 text-lg max-w-md leading-relaxed mb-10">
            Un ministère fondé sur la parole de Dieu, dédié à l'enseignement, l'adoration et la transformation de votre vie.
          </p>

          {/* CTAs — exactly like reference layout */}
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/evenements"
              className="inline-flex items-center justify-center gap-2 bg-[#3b0a68] hover:bg-[#2d0852] text-white font-bold rounded-full px-8 py-4 text-sm transition-all duration-200 shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40"
            >
              Prochains Événements <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/enseignements"
              className="inline-flex items-center justify-center gap-3 text-gray-700 hover:text-[#3b0a68] font-medium text-sm transition-colors group"
            >
              <span className="w-11 h-11 rounded-full border-2 border-gray-200 group-hover:border-[#3b0a68] flex items-center justify-center transition-colors">
                <Play className="h-4 w-4 fill-current ml-0.5" />
              </span>
              Voir les Enseignements
            </Link>
          </div>
        </div>

        {/* ── Right: Church image floating ───────────── */}
        <div className="relative w-full lg:w-[52%] h-[380px] lg:h-[520px] flex-shrink-0">
          {/* Soft purple blob behind image */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#f4ecf9] to-[#e8d5f7] rounded-[2rem]" />

          {/* Church image */}
          <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
            <Image
              src="/images/church-building.png"
              alt="Église Joy Alawey Ministries"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Floating badge — service indicator */}
          <div className="absolute bottom-6 left-4 lg:left-0 bg-white rounded-2xl shadow-xl shadow-purple-200/60 px-5 py-4 flex items-center gap-4 z-10 max-w-[260px]">
            <div className="w-10 h-10 rounded-xl bg-[#f4ecf9] flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-[#3b0a68]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Service Dominical</p>
              <p className="text-sm font-bold text-gray-900">Dimanche · 9h00</p>
            </div>
          </div>

          {/* Gold accent dot */}
          <div className="absolute top-6 right-6 lg:right-4 w-5 h-5 rounded-full bg-[#d4af37] z-10" />
        </div>
      </div>

      {/* ── Bottom bar — like the reference search/filter bar ── */}
      <div className="w-full border-t border-gray-100 bg-white px-8 md:px-16 lg:px-24 xl:px-32 py-5">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center gap-4 sm:gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

          <div className="flex items-center gap-3 sm:pr-10 w-full sm:w-auto">
            <MapPin className="h-4 w-4 text-[#3b0a68] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Localisation</p>
              <p className="text-sm font-bold text-gray-900">Abidjan, Côte d&apos;Ivoire</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:px-10 w-full sm:w-auto">
            <Calendar className="h-4 w-4 text-[#3b0a68] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Services</p>
              <p className="text-sm font-bold text-gray-900">Dim · Mar · Ven</p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:px-10 w-full sm:w-auto flex-1">
            <Clock className="h-4 w-4 text-[#3b0a68] shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Horaires</p>
              <p className="text-sm font-bold text-gray-900">9h00 · 10h30 · 18h00</p>
            </div>
          </div>

          <div className="sm:pl-10 w-full sm:w-auto">
            <Link
              href="/evenements"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#3b0a68] hover:bg-[#2d0852] text-white text-sm font-bold rounded-full px-6 py-3 transition-all duration-200"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
