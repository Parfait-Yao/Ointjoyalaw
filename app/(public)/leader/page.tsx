import Link from "next/link"
import Image from "next/image"
import {
  BookOpen,
  Heart,
  Users,
  Star,
  Globe,
  Flame,
  ChevronRight,
  Music,
  Handshake,
  Mail,
  Cross,
  ArrowRight,
  Play,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
} from "lucide-react"

// Inline social SVGs (not available in this lucide-react version)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)

/* ─────────────────────────────────────
   Data
───────────────────────────────────── */
const stats = [
  { value: "15+", label: "Années de ministère" },
  { value: "5", label: "Organisations affiliées" },
  { value: "1000+", label: "Vies transformées" },
  { value: "3", label: "Pays touchés" },
]

const pillars = [
  {
    icon: BookOpen,
    title: "Enseignement",
    desc: "Un ancrage profond dans la Parole de Dieu, transmis avec clarté et onction pour bâtir des croyants solides.",
  },
  {
    icon: Flame,
    title: "Révélation",
    desc: "Les enseignements sont imprégnés de révélations prophétiques qui transforment la compréhension spirituelle.",
  },
  {
    icon: Heart,
    title: "Compassion",
    desc: "Un cœur de berger tourné vers les blessés, les affligés et ceux qui cherchent leur destinée divine.",
  },
  {
    icon: Users,
    title: "Communauté",
    desc: "Bâtir un corps de Christ soudé où chaque membre est valorisé, formé et envoyé avec une mission.",
  },
  {
    icon: Globe,
    title: "Vision Mondiale",
    desc: "Une vision qui dépasse les frontières locales — atteindre les nations avec la joie du Seigneur.",
  },
  {
    icon: Star,
    title: "Excellence",
    desc: "Servir Dieu avec excellence dans chaque domaine : adoration, prédication, service et témoignage.",
  },
]

const programs = [
  {
    tag: "Formation",
    title: "École de la Parole",
    date: "Chaque Dimanche",
    desc: "Un programme d'enseignement approfondi pour équiper les croyants avec une solide connaissance biblique.",
    color: "from-purple-900/90 to-[#3b0a68]/95",
  },
  {
    tag: "Évangélisation",
    title: "Mission & Outreach",
    date: "Mensuel",
    desc: "Sorties évangéliques pour toucher les quartiers, les hôpitaux et les lieux de détresse avec l'amour de Christ.",
    color: "from-amber-900/90 to-amber-700/90",
  },
  {
    tag: "Leadership",
    title: "Camp de Leaders",
    date: "Annuel · Juin",
    desc: "Une retraite intensive pour former la prochaine génération de leaders selon les principes du Royaume.",
    color: "from-purple-800/90 to-indigo-900/95",
  },
]

const audiences = [
  {
    icon: Flame,
    title: "Chercheurs de Dieu",
    desc: "Ceux qui désirent connaître Dieu plus profondément et grandir dans leur foi.",
  },
  {
    icon: Music,
    title: "Adorateurs",
    desc: "Ceux qui veulent vivre une adoration authentique et toucher le cœur de Dieu.",
  },
  {
    icon: Handshake,
    title: "Serviteurs du Royaume",
    desc: "Ceux qui veulent s'impliquer activement dans l'œuvre de Dieu au sein du ministère.",
  },
  {
    icon: Cross,
    title: "Nouveaux Convertis",
    desc: "Ceux qui ont récemment rencontré Christ et cherchent à s'enraciner dans la foi.",
  },
]

/* Team members */
const team = [
  {
    name: "Visionnaire Titulaire",
    role: "Fondateur & Pasteur Principal",
    bio: "Appelé par Dieu pour annoncer la parole de vérité, il a consacré plus de 15 ans à l'édification du corps de Christ et à la formation de leaders.",
    image: "/images/team-leader.png",
    isLeader: true,
    social: { instagram: "#", facebook: "#", email: "#" },
  },
  {
    name: "Pasteure Adjointe",
    role: "Responsable de l'Adoration",
    bio: "Cheffe du département de louange et d'adoration, elle conduit le peuple de Dieu dans un culte authentique et transformateur.",
    image: "/images/team-female.png",
    isLeader: false,
    social: { instagram: "#", facebook: "#", email: "#" },
  },
  {
    name: "Pasteur des Jeunes",
    role: "Responsable de la Jeunesse",
    bio: "Passionné par la nouvelle génération, il consacre son ministère à équiper les jeunes pour leur destinée divine.",
    image: "/images/team-male.png",
    isLeader: false,
    social: { instagram: "#", facebook: "#", email: "#" },
  },
  {
    name: "Évangéliste Principal",
    role: "Responsable des Missions",
    bio: "À la tête du département évangélisation, il coordonne les sorties et missions pour étendre le Royaume de Dieu.",
    image: "/images/team-male.png",
    isLeader: false,
    social: { instagram: "#", facebook: "#", email: "#" },
  },
  {
    name: "Diaconesse",
    role: "Responsable de la Famille",
    bio: "Dédiée au bien-être des familles du ministère, elle offre accompagnement, conseil et soutien pastoral.",
    image: "/images/team-female.png",
    isLeader: false,
    social: { instagram: "#", facebook: "#", email: "#" },
  },
]

/* ─────────────────────────────────────
   Page
───────────────────────────────────── */
export default function LeaderPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── PREMIUM LEADER HERO ─────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#0f0224]">
        {/* Complex Backdrop Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0224] via-[#1a043a] to-[#2d0852]" />
        
        {/* Animated Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-800/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-[#d4af37]/5 blur-[80px]" />

        {/* Decorative Modern Patterns */}
        <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-24 py-16">
            
            {/* 1. TEXT CONTENT - Centered or Padded */}
            <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-5 py-2 mb-10 shadow-xl">
                <Sparkles className="h-3.5 w-3.5 text-[#d4af37]" />
                <span className="text-[10px] font-black tracking-[0.3em] text-white/70 uppercase">
                  Ointjoyalaw Ministries
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] mb-6 tracking-tight">
                Visionnaire <br/>
                <span className="text-[#d4af37]">Titulaire</span>
              </h1>
              
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                <div className="h-px w-12 bg-[#d4af37]/50" />
                <h2 className="text-xl md:text-2xl font-bold text-purple-100/60 uppercase tracking-[0.2em]">
                  Fondateur & Pasteur
                </h2>
              </div>

              <p className="text-xl text-purple-100/70 max-w-xl mx-auto lg:mx-0 mb-12 leading-relaxed font-medium">
                Appelé par Dieu pour annoncer la parole de vérité, notre leader a consacré 
                sa vie à l&apos;édification du corps de Christ — levant des leaders et touchant les nations.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link
                  href="/enseignements"
                  className="group inline-flex items-center justify-center gap-3 bg-[#d4af37] hover:bg-[#c19b2e] text-[#0f0224] font-black rounded-2xl px-10 py-5 text-sm uppercase tracking-widest transition-all duration-300 shadow-2xl shadow-amber-900/40 hover:-translate-y-1"
                >
                  Voir les Messages <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                </Link>
                <Link
                  href="/evenements"
                  className="inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-2xl px-10 py-5 text-sm font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-sm hover:border-white/40"
                >
                  Programmes
                </Link>
              </div>
            </div>

            {/* 2. LEADER PHOTO - Floating and Framed */}
            <div className="flex-shrink-0 order-1 lg:order-2">
              <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
                {/* Decorative Frames */}
                <div className="absolute inset-0 rounded-[3rem] rotate-6 border border-[#d4af37]/20 transition-transform duration-1000 group-hover:rotate-12" />
                <div className="absolute inset-0 rounded-[3rem] -rotate-3 border border-white/10 transition-transform duration-1000 group-hover:-rotate-6" />
                
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-[3rem] border-2 border-white/15 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                   {/* Backdrop in case image is small */}
                  <div className="absolute inset-0 bg-[#1a043a]" />
                  <Image
                    src="/images/team-leader.png"
                    alt="Visionnaire Titulaire"
                    fill
                    priority
                    className="object-cover object-top hover:scale-110 transition-transform duration-[2000ms]"
                  />
                  {/* Internal Glow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0224]/80 via-transparent to-transparent opacity-60" />
                </div>

                {/* Floating Badges */}
                <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white shadow-purple-900/20 hidden md:block animate-bounce" style={{ animationDuration: '4s' }}>
                    <div className="text-3xl font-black text-[#3b0a68]">15+</div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Années de Ministère</div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#fafafa] to-transparent z-0" />
      </section>

      {/* ═══════════════════════════════
          STATS BAR
      ═══════════════════════════════ */}
      <section className="py-14 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-center text-sm text-gray-400 font-medium mb-10 tracking-wide uppercase">
            Un ministère qui fait la différence
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s: any) => (
              <div key={s.label} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-[#3b0a68] mb-2 group-hover:text-[#d4af37] transition-colors duration-300">
                  {s.value}
                </div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          VISION SECTION
      ═══════════════════════════════ */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#3b0a68] text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="w-8 h-px bg-[#d4af37]" />
              Notre Vision
              <span className="w-8 h-px bg-[#d4af37]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5 leading-tight">
              Guider les âmes vers{" "}
              <span className="text-[#3b0a68]">l'excellence spirituelle</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Nous formons des croyants qui ne se contentent pas de connaître Dieu, mais qui le vivent, le démontrent et se lèvent comme une référence dans leur génération.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pillars.map((p: any) => {
              const Icon = p.icon
              return (
                <div
                  key={p.title}
                  className="group bg-white border border-gray-100 rounded-2xl p-7 hover:border-[#3b0a68]/30 hover:shadow-xl hover:shadow-purple-100/60 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#f4ecf9] group-hover:bg-[#3b0a68] flex items-center justify-center mb-5 transition-colors duration-300">
                    <Icon className="h-5 w-5 text-[#3b0a68] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{p.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          QUOTE
      ═══════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a043a] via-[#3b0a68] to-[#5c1499]" />
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="relative z-10 container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <div className="text-6xl text-[#d4af37]/40 font-serif leading-none mb-6">&ldquo;</div>
          <blockquote className="text-white text-2xl md:text-3xl font-medium leading-relaxed mb-8">
            Notre vision est de voir une génération transformée par la joie du Seigneur et équipée pour accomplir sa destinée divine.
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-px bg-[#d4af37]" />
            <span className="text-[#d4af37] font-semibold text-sm tracking-wide">Visionnaire Titulaire — Ointjoyalaw Ministries</span>
            <div className="w-10 h-px bg-[#d4af37]" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          NOTRE ÉQUIPE
      ═══════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#3b0a68] text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="w-8 h-px bg-[#d4af37]" />
              L'Équipe Pastorale
              <span className="w-8 h-px bg-[#d4af37]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
              Ceux qui servent{" "}
              <span className="text-[#3b0a68]">avec vous</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Une équipe dévouée, formée et missionnée pour vous accompagner dans votre parcours spirituel.
            </p>
          </div>

          {/* Leader card — full width featured */}
          <div className="mb-8 max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-[#1a043a] to-[#3b0a68] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center gap-0">
              {/* Image side */}
              <div className="relative w-full md:w-80 h-72 md:h-auto md:self-stretch shrink-0">
                <Image
                  src={team[0].image}
                  alt={team[0].name}
                  fill
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a043a] hidden md:block" />
              </div>
              {/* Text side */}
              <div className="relative z-10 p-8 md:p-10 flex-1">
                <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 rounded-full px-3 py-1 mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
                  <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">Leader</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{team[0].name}</h3>
                <p className="text-[#d4af37] font-semibold mb-5">{team[0].role}</p>
                <p className="text-purple-200/80 leading-relaxed mb-6">{team[0].bio}</p>
                <div className="flex items-center gap-3">
                  <a href={team[0].social.instagram} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <InstagramIcon className="h-4 w-4 text-white" />
                  </a>
                  <a href={team[0].social.facebook} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <FacebookIcon className="h-4 w-4 text-white" />
                  </a>
                  <a href={team[0].social.email} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Mail className="h-4 w-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Other members — grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {team.slice(1).map((member: any) => (
              <div
                key={member.name}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-[#3b0a68]/20 hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-52 bg-[#f4ecf9] overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Dark overlay on hover */}
                  <div className="absolute inset-0 bg-[#3b0a68]/0 group-hover:bg-[#3b0a68]/20 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-0.5">{member.name}</h3>
                  <p className="text-[#3b0a68] text-xs font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3">{member.bio}</p>
                  {/* Social */}
                  <div className="flex items-center gap-2">
                    <a href={member.social.instagram} className="w-7 h-7 rounded-full bg-[#f4ecf9] hover:bg-[#3b0a68] group/icon flex items-center justify-center transition-colors">
                      <InstagramIcon className="h-3 w-3 text-[#3b0a68] group-hover/icon:text-white transition-colors" />
                    </a>
                    <a href={member.social.facebook} className="w-7 h-7 rounded-full bg-[#f4ecf9] hover:bg-[#3b0a68] group/icon flex items-center justify-center transition-colors">
                      <FacebookIcon className="h-3 w-3 text-[#3b0a68] group-hover/icon:text-white transition-colors" />
                    </a>
                    <a href={member.social.email} className="w-7 h-7 rounded-full bg-[#f4ecf9] hover:bg-[#3b0a68] group/icon flex items-center justify-center transition-colors">
                      <Mail className="h-3 w-3 text-[#3b0a68] group-hover/icon:text-white transition-colors" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          PROGRAMS SECTION
      ═══════════════════════════════ */}
      <section className="relative py-24 bg-[#1a043a] overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-purple-600/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-700/15 blur-3xl" />
        <div className="relative z-10 container mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-3">
                <span className="w-6 h-px bg-[#d4af37]" />
                Programmes du Ministère
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Élevez votre vie{" "}
                <span className="text-[#d4af37]">spirituelle</span>
              </h2>
            </div>
            <Link href="/evenements" className="inline-flex items-center gap-2 text-purple-300 hover:text-white text-sm font-medium transition-colors shrink-0">
              Tous les programmes <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs.map((prog: any) => (
              <div
                key={prog.title}
                className={`relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end p-7 bg-gradient-to-t ${prog.color} border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-900/40 group`}
              >
                <div className="absolute top-6 left-7 right-7 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider uppercase text-white/50 bg-white/10 rounded-full px-3 py-1">{prog.tag}</span>
                  <span className="text-xs text-white/50">{prog.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{prog.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed mb-5">{prog.desc}</p>
                <Link href="/evenements" className="inline-flex items-center gap-2 text-[#d4af37] text-sm font-semibold hover:gap-3 transition-all duration-200">
                  En savoir plus <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FOR WHOM
      ═══════════════════════════════ */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="inline-flex items-center gap-2 text-[#3b0a68] text-xs font-semibold tracking-widest uppercase mb-4">
              <span className="w-8 h-px bg-[#d4af37]" />
              Pour qui
              <span className="w-8 h-px bg-[#d4af37]" />
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ce ministère est{" "}
              <span className="text-[#3b0a68]">fait pour vous</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {audiences.map((a: any) => {
              const Icon = a.icon
              return (
                <div
                  key={a.title}
                  className="group text-center p-8 rounded-2xl border border-gray-100 bg-white hover:border-[#3b0a68]/20 hover:bg-[#f4ecf9]/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/40"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#f4ecf9] group-hover:bg-[#3b0a68] flex items-center justify-center mx-auto mb-5 transition-colors duration-300">
                    <Icon className="h-6 w-6 text-[#3b0a68] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-3">{a.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════
          FINAL CTA
      ═══════════════════════════════ */}
      <section className="py-20 bg-[#f4ecf9]">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a043a] mb-4 leading-tight">
            Prêt à rejoindre la famille ?
          </h2>
          <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
            Rejoignez Ointjoyalaw Ministries et découvrez une communauté vivante, des enseignements forts et une mission claire pour votre vie.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/evenements"
              className="inline-flex items-center justify-center gap-2 bg-[#3b0a68] hover:bg-[#2d0852] text-white font-bold rounded-full px-10 py-4 text-sm transition-all duration-200 shadow-lg shadow-purple-900/30"
            >
              Voir nos Événements <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/dons"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#3b0a68] text-[#3b0a68] hover:bg-[#3b0a68] hover:text-white font-bold rounded-full px-10 py-4 text-sm transition-all duration-200"
            >
              Soutenir le Ministère
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
