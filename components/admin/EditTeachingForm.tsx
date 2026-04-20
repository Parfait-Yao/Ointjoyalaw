"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, BookOpen, Video, Calendar, Upload, Play } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Teaching {
  id: string
  title: string
  youtubeUrl: string | null
  videoUrl: string | null
  imageUrl: string | null

  category: string | null
  publishedAt: Date
}

export function EditTeachingForm({ teaching }: { teaching: Teaching }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState(teaching.youtubeUrl ?? "")
  const [uploadType, setUploadType] = useState<"youtube" | "local">(teaching.videoUrl ? "local" : "youtube")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(teaching.videoUrl)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(teaching.imageUrl)


  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? match[1] : null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }



  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const submitData = new FormData()
    
    submitData.append("title", formData.get("title") as string)
    submitData.append("category", formData.get("category") as string)
    submitData.append("publishedAt", formData.get("publishedAt") as string)

    if (uploadType === "youtube") {
      submitData.append("youtubeUrl", youtubeUrl || "")
    } else if (videoFile) {
      submitData.append("video", videoFile)
      submitData.append("youtubeUrl", "") // Clear YouTube if using local
    }

    if (imageFile) {
      submitData.append("image", imageFile)
    }



    try {
      const res = await fetch(`/api/teachings/${teaching.id}`, {
        method: "PATCH",
        body: submitData,
      })
      if (res.ok) {
        toast.success("Enseignement mis à jour avec succès !")
        router.push("/admin/enseignements")
        router.refresh()
      } else {
        const error = await res.json()
        toast.error(`Erreur: ${error.error || "Inconnue"}`)
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  const ytId = getYoutubeId(youtubeUrl)
  const defaultDate = new Date(teaching.publishedAt).toISOString().split("T")[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <h2 className="font-semibold text-gray-900 text-sm">Informations générales</h2>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="title">Titre *</label>
            <input
              id="title" name="title" required defaultValue={teaching.title}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="publishedAt">
                <Calendar className="inline w-3.5 h-3.5 mr-1" />Date de publication
              </label>
              <input
                id="publishedAt" name="publishedAt" type="date" defaultValue={defaultDate}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="category">Catégorie</label>
              <select
                id="category" name="category" defaultValue={teaching.category ?? "Foi"}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              >
                <option value="Foi">Foi</option>
                <option value="Grâce">Grâce</option>
                <option value="Vie Chrétienne">Vie Chrétienne</option>
                <option value="Jeunesse">Jeunesse</option>
                <option value="Prière">Prière</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Cover Image */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Upload className="w-4 h-4 text-purple-600" />
            <h2 className="font-semibold text-gray-900 text-sm">Image de Couverture</h2>
          </div>
          
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`w-full ${imagePreview ? 'h-48' : 'h-32'} rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 group-hover:bg-gray-100 group-hover:border-purple-300 transition-all flex flex-col items-center justify-center gap-2 overflow-hidden`}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-500">Image de couverture (Optionnel)</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              <h2 className="font-semibold text-gray-900 text-sm">Médias Vidéo</h2>
            </div>
            
            <div className="flex p-1 bg-gray-100 rounded-lg">
              <button
                type="button" onClick={() => setUploadType("youtube")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  uploadType === "youtube" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                YouTube
              </button>
              <button
                type="button" onClick={() => setUploadType("local")}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  uploadType === "local" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Local
              </button>
            </div>
          </div>

          {uploadType === "youtube" ? (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="youtubeUrl">URL YouTube</label>
              <input
                id="youtubeUrl" name="youtubeUrl" type="url"
                value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
              />
            </div>
          ) : (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-medium text-gray-700">Fichier Vidéo (Laisser vide pour conserver l'actuel)</label>
              <div className="relative group">
                <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 group-hover:bg-gray-100 group-hover:border-purple-300 transition-all flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-gray-500">
                    {videoFile ? videoFile.name : teaching.videoUrl ? "Remplacer la vidéo actuelle" : "Cliquez ou glissez une vidéo ici"}
                  </p>
                </div>
              </div>
            </div>
          )}


        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/admin/enseignements"
            className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </Link>
          <button
            type="submit" disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 transition-all shadow-lg shadow-purple-600/20"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Enregistrement..." : "Mettre à jour l'enseignement"}
          </button>
        </div>
      </form>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[300px]">
          <h2 className="font-semibold text-gray-900 text-sm mb-4">Aperçu du contenu</h2>
          {uploadType === "youtube" ? (
            ytId ? (
              <div className="rounded-xl overflow-hidden aspect-video shadow-2xl">
                <iframe src={`https://www.youtube.com/embed/${ytId}`} className="w-full h-full" allowFullScreen />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <Play className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs text-center px-4">Aucune URL YouTube renseignée</p>
              </div>
            )
          ) : (
            videoPreview ? (
              <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-2xl">
                <video src={videoPreview} controls className="w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <Upload className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs text-center px-4">Aucune vidéo uploadée</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
