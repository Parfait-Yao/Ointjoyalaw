"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Save, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [event, setEvent] = useState<any>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [associatedOrgIds, setAssociatedOrgIds] = useState<string[]>([])
  const [isFree, setIsFree] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${resolvedParams.id}`)
        if (res.ok) {
          const data = await res.json()
          setEvent(data)
          setIsFree(data.isFree ?? true)
        } else {
          toast.error("Événement non trouvé")
          router.push("/admin/evenements")
        }
      } catch (err) {
        console.error(err)
      } finally {
        setFetching(false)
      }
    }
    fetchEvent()

    const fetchAllOrgs = async () => {
      try {
        const res = await fetch("/api/organizations")
        if (res.ok) {
          const data = await res.json()
          setOrganizations(data)
        }
      } catch (err) {
        console.error("Failed to fetch all organizations", err)
      }
    }
    fetchAllOrgs()
  }, [resolvedParams.id, router])

  useEffect(() => {
    if (event?.organizations) {
      setAssociatedOrgIds(event.organizations.map((o: any) => o.id))
    }
  }, [event])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("isFree", isFree.toString())

    try {
      const res = await fetch(`/api/events/${resolvedParams.id}`, {
        method: "PATCH",
        body: formData,
      })
      if (res.ok) {
        toast.success("Événement modifié avec succès !")
        router.push("/admin/evenements")
        router.refresh()
      } else {
        toast.error("Erreur lors de la mise à jour")
      }
    } catch (e) {
      console.error(e)
      toast.error("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${resolvedParams.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Événement supprimé avec succès.")
        router.push("/admin/evenements")
        router.refresh()
      } else {
        toast.error("Erreur lors de la suppression")
        setShowDeleteModal(false)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
        <p className="text-gray-500">Chargement de l'événement...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" render={<Link href="/admin/evenements" />}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Modifier l'événement</h1>
            <p className="text-gray-500 text-sm">Mettez à jour les détails ou la billetterie.</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => setShowDeleteModal(true)} 
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'événement *</Label>
            <Input id="title" name="title" required defaultValue={event?.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optionnel)</Label>
            <Textarea id="description" name="description" rows={4} defaultValue={event?.description || ""} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date et Heure *</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="datetime-local" 
                required 
                defaultValue={event?.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : ""} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité (Optionnel)</Label>
              <Input id="capacity" name="capacity" type="number" min="1" defaultValue={event?.capacity || ""} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700 font-semibold flex items-center gap-2">
                Tarification *
              </Label>
              <div className="flex items-center gap-4 h-10">
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
                   Prix (FCFA) *
                </Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0" 
                  required={!isFree}
                  defaultValue={event?.price || ""}
                  className="w-full"
                  placeholder="Ex: 5000" 
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" name="location" defaultValue={event?.location || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie d'événement *</Label>
            <select 
              id="category" 
              name="category" 
              required
              defaultValue={event?.category || "Autre"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="Culte">Culte & Célébration</option>
              <option value="Jeunesse">Jeunesse & Étudiants</option>
              <option value="Séminaire">Séminaire & Étude</option>
              <option value="Concert">Concert & Adoration</option>
              <option value="Conférence">Conférence</option>
              <option value="Autre">Autre</option>
            </select>
          </div>

          <div className="space-y-3">
            <Label>Organisations impliquées</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <label key={org.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg transition-colors cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="organizationIds" 
                      value={org.id}
                      defaultChecked={associatedOrgIds.includes(org.id)}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                        {org.name}
                      </span>
                      {org.acronym && (
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          {org.acronym}
                        </span>
                      )}
                    </div>
                  </label>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic col-span-full">Chargement des organisations...</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image de couverture (Laissez vide pour conserver l'actuelle)</Label>
            <div className="flex gap-2">
              <Input id="image" name="image" type="file" accept="image/*" className="file:bg-purple-50 file:text-purple-700 file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-purple-100 transition-colors" />
            </div>
            {event?.imageUrl && (
              <p className="text-xs text-green-600 mt-1">✓ Une image est déjà enregistrée pour cet événement.</p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t">
          <Button variant="outline" type="button" render={<Link href="/admin/evenements" />}>
            Annuler
          </Button>
          <Button type="submit" className="bg-purple-800 hover:bg-purple-900" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Enregistrer les modifications
          </Button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Supprimer l'événement ?</DialogTitle>
            <DialogDescription className="text-gray-500 pt-2">
              Cette action est irréversible. Toutes les données associées à <strong>{event?.title}</strong> seront définitivement supprimées.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={loading}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Confirmer la suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
