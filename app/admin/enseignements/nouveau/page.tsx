"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, BookOpen, Video, Calendar, Upload, Play } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NouvelEnseignementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [uploadType, setUploadType] = useState<"youtube" | "local">("youtube")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)


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
      submitData.append("youtubeUrl", youtubeUrl)
    } else if (videoFile) {
      submitData.append("video", videoFile)
    }

    if (imageFile) {
      submitData.append("image", imageFile)
    }



    try {
      const res = await fetch("/api/teachings", {
        method: "POST",
        body: submitData,
      })
      if (res.ok) {
        toast.success("Enseignement publié avec succès !")
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/enseignements"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouvel Enseignement</h1>
          <p className="text-sm text-gray-500">Ajoutez un message ou une étude biblique au site.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-600" />
              <h2 className="font-semibold text-gray-900 text-sm">Informations générales</h2>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700" htmlFor="title">Titre *</label>
              <input
                id="title"
                name="title"
                required
                placeholder="Ex: La Foi qui Déplace les Montagnes"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="publishedAt">
                  <Calendar className="inline w-3.5 h-3.5 mr-1" />Date
                </label>
                <input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="category">Catégorie</label>
                <select
                  id="category"
                  name="category"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
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
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
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
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">JPG, PNG jusqu'à 5Mo</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-500" />
                <h2 className="font-semibold text-gray-900 text-sm">Médias Vidéo</h2>
              </div>
              
              {/* Toggle Upload Type */}
              <div className="flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setUploadType("youtube")}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    uploadType === "youtube" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                <Play className="w-3.5 h-3.5" />
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType("local")}
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
                <label className="text-sm font-medium text-gray-700" htmlFor="youtubeUrl">
                  URL YouTube
                </label>
                <input
                  id="youtubeUrl"
                  name="youtubeUrl"
                  type="url"
                  value={youtubeUrl}
                  onChange={e => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                />
              </div>
            ) : (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm font-medium text-gray-700">Fichier Vidéo</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 group-hover:bg-gray-100 group-hover:border-purple-300 transition-all flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-medium text-gray-500">
                      {videoFile ? videoFile.name : "Cliquez ou glissez une vidéo ici"}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">MP4, MOV jusqu'à 100Mo</p>
                  </div>
                </div>
              </div>
            )}


          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Link
              href="/admin/enseignements"
              className="px-6 py-3 rounded-xl text-sm font-bold text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 transition-all shadow-lg shadow-purple-600/20 active:scale-95"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Chiffrement et Envoi..." : "Publier l'enseignement"}
            </button>
          </div>
        </form>

        {/* Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 text-sm mb-4">Aperçu du contenu</h2>
            
            {uploadType === "youtube" ? (
              ytId ? (
                <div className="rounded-xl overflow-hidden aspect-video shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Play className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs">Collez une URL YouTube</p>
                </div>
              )
            ) : (
              videoPreview ? (
                <div className="rounded-xl overflow-hidden aspect-video bg-black shadow-2xl">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <Upload className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-xs">Uploadez une vidéo</p>
                </div>
              )
            )}
            
            <div className="mt-6 p-4 rounded-xl bg-purple-50/50 border border-purple-100 italic">
               <p className="text-[11px] text-purple-700 leading-relaxed">
                 &quot;Votre enseignement sera accessible partout dans le monde dès la publication.&quot;
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
