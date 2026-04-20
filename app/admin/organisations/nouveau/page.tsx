"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, UploadCloud, Users } from "lucide-react"
import { toast } from "sonner"

export default function NewOrganizationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [acronym, setAcronym] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [creationDate, setCreationDate] = useState("")
  const [image, setImage] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      setError("Le nom de l'organisation est requis.")
      return
    }

    setLoading(true)
    setError("")

    const formData = new FormData()
    formData.append("name", name)
    if (acronym) formData.append("acronym", acronym)
    if (role) formData.append("role", role)
    if (description) formData.append("description", description)
    if (websiteUrl) formData.append("websiteUrl", websiteUrl)
    if (creationDate) formData.append("creationDate", creationDate)
    if (image) formData.append("image", image)

    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        toast.success("Organisation créée avec succès !")
        router.push("/admin/organisations")
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || "Une erreur est survenue lors de la création.")
      }
    } catch (err) {
      console.error(err)
      toast.error("Une erreur inattendue est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link href="/admin/organisations" className="inline-flex items-center text-sm text-gray-500 hover:text-purple-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux organisations
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Nouvelle Organisation</h1>
            <p className="text-sm text-gray-500">Créez une organisation affiliée au ministère.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Nom de l'organisation *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:bg-white transition-all"
              placeholder="Ex: Let There Be Joy"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Acronyme</label>
            <input
              type="text"
              value={acronym}
              onChange={(e) => setAcronym(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:bg-white transition-all"
              placeholder="Ex: LTBJ"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Rôle / Catégorie</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:bg-white transition-all"
              placeholder="Ex: Action Sociale"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Date de création</label>
            <input
              type="date"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:bg-white transition-all"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-gray-700">Lien du site Web (Optionnel)</label>
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:bg-white transition-all"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600/50 focus:bg-white transition-all resize-none"
            placeholder="Décrivez l'objectif et les actions de l'organisation..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Logo ou Photo (Optionel)</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-1 text-center">
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <span className="relative rounded-md font-medium text-purple-600">
                  {image ? image.name : "Cliquez pour sélectionner un fichier"}
                </span>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP jusqu'à 5MB</p>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <Link
            href="/admin/organisations"
            className="px-6 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center bg-purple-800 hover:bg-purple-900 text-white text-sm font-bold rounded-xl px-8 py-3 transition-colors disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Création...
              </>
            ) : (
              "Créer l'organisation"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
