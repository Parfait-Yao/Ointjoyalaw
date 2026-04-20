"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Calendar, MapPin, FileText, CheckCircle2, Type, Tags, Building2, ImagePlus, Globe, AlignLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function NouveauEvenementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [selectedOrgs, setSelectedOrgs] = useState<string[]>([])
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isFree, setIsFree] = useState(true)

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await fetch("/api/organizations")
        if (res.ok) {
          const data = await res.json()
          setOrganizations(data)
        }
      } catch (err) {
        console.error("Failed to fetch organizations", err)
      }
    }
    fetchOrgs()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewUrl(URL.createObjectURL(file))
    } else {
      setPreviewUrl(null)
    }
  }

  const toggleOrg = (id: string) => {
    setSelectedOrgs(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    // Synchronize checkboxes
    formData.delete("organizationIds")
    selectedOrgs.forEach(id => formData.append("organizationIds", id))
    formData.append("isFree", isFree.toString())

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        body: formData,
      })
      if (res.ok) {
        toast.success("Événement créé avec succès !")
        router.push("/admin/evenements")
        router.refresh()
      } else {
        toast.error("Erreur lors de la création de l'événement")
      }
    } catch (e) {
      console.error(e)
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 px-4 sm:px-6">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" render={<Link href="/admin/evenements" />} className="bg-white/50 hover:bg-white border shadow-sm rounded-full shrink-0 h-10 w-10 transition-all hover:-translate-x-1">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold tracking-widest uppercase mb-2 border border-purple-100">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Billetterie
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Publier un Événement</h1>
            <p className="text-gray-500 text-sm mt-1">Générez des tickets et attirez plus de participants.</p>
          </div>
        </div>
      </div>

      {/* ── FORM ─────────────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Informations Générales */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Informations Générales</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-700 font-semibold flex items-center gap-2">
                  <Type className="w-4 h-4 text-gray-400" /> Titre de l'événement <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="title" 
                  name="title" 
                  required 
                  className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base"
                  placeholder="Ex: Culte de Célébration, Conférence LTBJ..." 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-700 font-semibold flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-gray-400" /> Description approfondie 
                </Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  rows={5} 
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none text-base p-4"
                  placeholder="Détails de l'événement, liste des orateurs, programme spécifique..." 
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-semibold flex items-center gap-2">
                    <Tags className="w-4 h-4 text-gray-400" /> Tarification <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-4 h-12">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tarification" 
                        checked={isFree}
                        onChange={() => setIsFree(true)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Gratuit</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="tarification" 
                        checked={!isFree}
                        onChange={() => setIsFree(false)}
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Payant</span>
                    </label>
                  </div>
                </div>

                {!isFree && (
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-gray-700 font-semibold flex items-center gap-2">
                      <Tags className="w-4 h-4 text-gray-400" /> Prix (FCFA) <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      min="0" 
                      required={!isFree}
                      className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-base"
                      placeholder="Ex: 5000" 
                    />
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Tags className="w-4 h-4 text-gray-400" /> Catégorie <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <select 
                      id="category" 
                      name="category" 
                      required
                      className="w-full h-12 appearance-none rounded-xl border border-gray-200 bg-gray-50/50 px-4 text-sm focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-700"
                    >
                      <option value="Culte">Culte & Célébration</option>
                      <option value="Jeunesse">Jeunesse & Étudiants</option>
                      <option value="Séminaire">Séminaire & Étude</option>
                      <option value="Concert">Concert & Adoration</option>
                      <option value="Conférence">Conférence</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" /> Capacité maximale
                  </Label>
                  <Input 
                    id="capacity" 
                    name="capacity" 
                    type="number" 
                    min="1" 
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    placeholder="Laissez vide si illimité" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Date & Lieu */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Planification & Emplacement</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-gray-700 font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" /> Date et Heure <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="datetime-local" 
                    required 
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-700 font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" /> Lieu / Adresse
                  </Label>
                  <Input 
                    id="location" 
                    name="location" 
                    className="h-12 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                    placeholder="Ex: Siège d'Ointjoyalaw, Cocody" 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Media & Organizations */}
          <div className="space-y-6">
            
            {/* Section 3: Affiche / Image */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <ImagePlus className="w-5 h-5 text-blue-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Affiche Officielle</h2>
              </div>

              <div className="space-y-4">
                <div className="relative group cursor-pointer">
                  <div className={cn(
                    "w-full aspect-[4/5] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden bg-gray-50",
                    previewUrl ? "border-transparent" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                  )}>
                    {previewUrl ? (
                      <div className="relative w-full h-full">
                        <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                             Changer l'image
                           </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 transition-transform">
                          <ImagePlus className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Cliquez pour uploader</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG ou WEBP (Max. 5MB)</p>
                      </div>
                    )}
                    <input 
                      id="image" 
                      name="image" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Organisations */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
               <div className="flex items-center gap-3 border-b border-gray-50 pb-4 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">Organisations</h2>
              </div>
              
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {organizations.length > 0 ? (
                  organizations.map((org) => {
                    const isSelected = selectedOrgs.includes(org.id)
                    return (
                      <div 
                        key={org.id} 
                        onClick={() => toggleOrg(org.id)}
                        className={cn(
                          "cursor-pointer p-3 rounded-2xl border-2 transition-all flex items-center gap-4",
                          isSelected 
                            ? "border-green-500 bg-green-50/50 shadow-sm shadow-green-100" 
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0",
                          isSelected ? "bg-green-500 text-white" : "border-2 border-gray-300"
                        )}>
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-bold truncate", isSelected ? "text-green-900" : "text-gray-700")}>
                            {org.name}
                          </p>
                          {org.acronym && (
                            <p className="text-[10px] text-gray-400 font-extrabold tracking-widest uppercase mt-0.5">
                              {org.acronym}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-500 font-medium">Aucune organisation trouvée.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── STICKY FOOTER ACTION BAR ─────────────────────────────────────── */}
        <div className="sticky bottom-6 mt-10 p-4 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl shadow-purple-900/10 rounded-3xl flex items-center justify-between gap-4 z-40">
          <p className="text-sm text-gray-500 hidden sm:block font-medium pl-4">
            Vérifiez vos informations avant de publier.
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              type="button" 
              render={<Link href="/admin/evenements" />}
              className="rounded-full px-6 h-12 font-bold text-gray-600 border-gray-200 hover:bg-gray-50 hidden sm:flex"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1 sm:flex-none rounded-full px-8 h-12 bg-[#3b0a68] hover:bg-[#2d0852] text-white font-bold shadow-lg shadow-purple-900/20 transition-transform active:scale-95" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Création en cours...
                </>
              ) : (
                "Publier l'événement"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
