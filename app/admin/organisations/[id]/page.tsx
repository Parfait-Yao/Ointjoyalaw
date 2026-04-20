import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit2, Calendar, Globe, Building } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default async function OrganizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const org = await prisma.organization.findUnique({
    where: { id: resolvedParams.id }
  })

  if (!org) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <Link href="/admin/organisations" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </Link>
        <Link
          href={`/admin/organisations/${org.id}/modifier`}
          className="inline-flex items-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-bold rounded-xl px-4 py-2 transition-colors"
        >
          <Edit2 className="w-4 h-4" /> Modifier
        </Link>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {/* Banner/Header */}
        <div className="h-48 bg-gradient-to-r from-purple-900 to-indigo-800 relative">
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            {org.imageUrl ? (
              <div className="w-32 h-32 rounded-2xl border-4 border-white overflow-hidden bg-white relative">
                <Image src={org.imageUrl} alt={org.name} fill className="object-cover" sizes="128px" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl border-4 border-white bg-purple-50 flex items-center justify-center text-4xl font-black text-purple-600">
                {org.acronym || org.name.substring(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="pt-20 px-8 pb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900">{org.name}</h1>
              <p className="text-gray-500 font-medium mt-1">
                {org.acronym && <span className="mr-3">{org.acronym}</span>}
                {org.role && <span className="inline-flex items-center gap-1.5"><Building className="w-4 h-4" /> {org.role}</span>}
              </p>
            </div>
            {org.creationDate && (
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 bg-gray-50 rounded-xl px-4 py-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Créé le {format(new Date(org.creationDate), "d MMMM yyyy", { locale: fr })}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">À propos</h2>
              <div className="bg-gray-50 rounded-2xl p-6 text-gray-700 leading-relaxed text-sm">
                {org.description || "Aucune description fournie pour cette organisation."}
              </div>
            </div>

            {org.websiteUrl && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-3">Liens extérieurs</h2>
                <a
                  href={org.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" /> Visiter le site web
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
