import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { OrganizationsTable } from "@/components/admin/OrganizationsTable"

export const dynamic = "force-dynamic"

export default async function AdminOrganizationsPage() {
  const orgs = await prisma.organization.findMany({ 
    orderBy: { createdAt: "desc" } 
  })

  // Serialize dates for Client Component
  const serializedOrgs = orgs.map((o: any) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    creationDate: o.creationDate ? o.creationDate.toISOString() : null,
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Organisations</h1>
          <p className="text-sm text-gray-500">Gérez les organisations affiliées au ministère.</p>
        </div>
        <Link
          href="/admin/organisations/nouveau"
          className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl px-6 py-3.5 transition-all shadow-lg shadow-purple-600/20 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Nouvelle Organisation
        </Link>
      </div>

      {orgs.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-20 text-center shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune organisation</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto tracking-tight">Créez votre première organisation pour qu'elle apparaisse sur le site public.</p>
          <Link
            href="/admin/organisations/nouveau"
            className="inline-flex items-center gap-2 bg-purple-800 hover:bg-purple-900 text-white text-sm font-bold rounded-xl px-6 py-3.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Créer maintenant
          </Link>
        </div>
      ) : (
        <OrganizationsTable organizations={serializedOrgs as any} />
      )}
    </div>
  )
}
