import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Clock, XCircle } from "lucide-react"

export default async function EventAttendeesPage({ params }: { params: { id: string } }) {
  const { id } = await params
  
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      tickets: {
        orderBy: { createdAt: "desc" },
      }
    }
  })

  if (!event) return notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/evenements`}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inscrits : {event.title}
          </h1>
          <p className="text-gray-500">
            {event.tickets.length} participant(s) au total
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Nom complet</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Téléphone</th>
                <th className="px-6 py-4">Date d'inscription</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {event.tickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun inscrit pour le moment.
                  </td>
                </tr>
              ) : (
                event.tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {ticket.guestName || "Anonyme"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {ticket.guestEmail || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {ticket.guestPhone || "—"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      {ticket.status === "PAID" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          <CheckCircle className="w-3 h-3" /> Confirmé
                        </span>
                      )}
                      {ticket.status === "PENDING" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" /> En attente
                        </span>
                      )}
                      {ticket.status === "CANCELLED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          <XCircle className="w-3 h-3" /> Échoué
                        </span>
                      )}
                      {ticket.status === "USED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          <CheckCircle className="w-3 h-3" /> Scanné (Utilisé)
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
