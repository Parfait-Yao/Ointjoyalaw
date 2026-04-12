import { prisma } from "@/lib/prisma"
import { Mail, Download } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletter.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Newsletter</h1>
          <p className="text-sm text-gray-500">{subscribers.length} abonné(s) au total.</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,Email,Date\n${subscribers.map((s: any) => `${s.email},${s.createdAt.toISOString()}`).join("\n")}`}
          download="newsletter-abonnes.csv"
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold uppercase tracking-widest rounded-xl px-5 py-3.5 border border-gray-200 transition-all active:scale-95 shadow-sm whitespace-nowrap"
        >
          <Download className="w-4 h-4" /> Exporter CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-amber-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Aucun abonné</h3>
          <p className="text-sm text-gray-400">Les personnes qui s'abonnent via le footer apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">#</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4">Email</th>
                <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Date d'inscription</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscribers.map((sub: any, i: number) => (
                <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-sm text-gray-500">
                    {format(new Date(sub.createdAt), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
