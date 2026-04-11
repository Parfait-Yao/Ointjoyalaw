import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { StatsCard } from "@/components/admin/StatsCard"
import { Calendar, CreditCard, Ticket, Users, BookOpen, Mail, Plus, ArrowRight } from "lucide-react"
import { EventsTable } from "@/components/admin/EventsTable"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  const [eventsCount, ticketsCount, donationsSum, teachingsCount, newsletterCount, recentEvents, recentDonations] =
    await Promise.all([
      prisma.event.count(),
      prisma.ticket.count({ where: { status: "PAID" } }),
      prisma.donation.aggregate({ _sum: { amount: true } }),
      prisma.teaching.count(),
      prisma.newsletter.count(),
      prisma.event.findMany({
        take: 5,
        orderBy: { startDate: "desc" },
        include: { _count: { select: { tickets: true } } },
      }),
      prisma.donation.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ])

  const totalDons = Number(donationsSum._sum.amount || 0)

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {session?.user?.name?.split(" ")[0] ?? "Admin"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Voici le résumé de l'activité du ministère.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/evenements/nouveau"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl px-4 py-2.5 transition-colors shadow-sm shadow-purple-200"
          >
            <Plus className="w-4 h-4" /> Événement
          </Link>
          <Link
            href="/admin/enseignements/nouveau"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl px-4 py-2.5 border border-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" /> Enseignement
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatsCard title="Événements" value={eventsCount} icon={Calendar} color="purple" trend="+2 ce mois" />
        <StatsCard title="Billets Vendus" value={ticketsCount} icon={Ticket} color="indigo" />
        <StatsCard
          title="Dons Récoltés"
          value={`${totalDons.toLocaleString()} XOF`}
          icon={CreditCard}
          color="emerald"
        />
        <StatsCard title="Enseignements" value={teachingsCount} icon={BookOpen} color="purple" />
        <StatsCard title="Abonnés Newsletter" value={newsletterCount} icon={Mail} color="amber" />
      </div>

      {/* Two-column bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent events */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900 text-sm">Événements récents</h2>
            <Link href="/admin/evenements" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentEvents.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-8 text-center">Aucun événement</p>
            ) : (
              recentEvents.map((event: any) => (
                <div key={event.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-400">
                      {format(new Date(event.startDate), "d MMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <span className="ml-4 text-xs text-purple-700 bg-purple-50 border border-purple-100 rounded-full px-2 py-0.5 shrink-0">
                    {event._count.tickets} billets
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent donations */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-900 text-sm">Dons récents</h2>
            <Link href="/admin/paiements" className="text-xs text-purple-600 hover:underline flex items-center gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDonations.length === 0 ? (
              <p className="text-sm text-gray-400 px-6 py-8 text-center">Aucun don</p>
            ) : (
              recentDonations.map((don: any) => (
                <div key={don.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                      {(don.user?.name ?? "A")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{don.user?.name ?? "Anonyme"}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(don.createdAt), "d MMM yyyy", { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">
                    {Number(don.amount).toLocaleString()} XOF
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
