import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { EditTeachingForm } from "@/components/admin/EditTeachingForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditTeachingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const teaching = await prisma.teaching.findUnique({ where: { id } })
  if (!teaching) notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/enseignements"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'Enseignement</h1>
          <p className="text-sm text-gray-500">Les modifications seront visibles sur le site immédiatement.</p>
        </div>
      </div>
      <EditTeachingForm teaching={teaching} />
    </div>
  )
}
