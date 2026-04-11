"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2, Upload } from "lucide-react"
import Link from "next/link"

export default function NouveauEvenementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    // No need to manually build JSON. We send formData directly

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        // Do NOT set Content-Type header when sending FormData
        body: formData,
      })
      if (res.ok) {
        router.push("/admin/evenements")
        router.refresh()
      } else {
        alert("Erreur lors de la création")
      }
    } catch (e) {
      console.error(e)
      alert("Erreur réseau")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/admin/evenements" />}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Nouvel Événement</h1>
          <p className="text-gray-500 text-sm">Créez un nouvel événement et ouvrez la billetterie.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'événement *</Label>
            <Input id="title" name="title" required placeholder="Ex: Culte de Célébration, Conférence LTBJ..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optionnel)</Label>
            <Textarea id="description" name="description" rows={4} placeholder="Détails de l'événement, orateurs, programme..." />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date et Heure *</Label>
              <Input id="startDate" name="startDate" type="datetime-local" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacité (Optionnel)</Label>
              <Input id="capacity" name="capacity" type="number" min="1" placeholder="Nombre de places maximum" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" name="location" placeholder="Ex: Siège d'Ointjoyalaw, Cocody Angré" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Catégorie d'événement *</Label>
            <select 
              id="category" 
              name="category" 
              required
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

          <div className="space-y-2">
            <Label htmlFor="image">Image de couverture</Label>
            <div className="flex gap-2">
              <Input id="image" name="image" type="file" accept="image/*" className="file:bg-purple-50 file:text-purple-700 file:border-0 file:rounded-md file:px-4 file:py-1 hover:file:bg-purple-100 transition-colors" />
            </div>
            <p className="text-xs text-gray-500">L'image sera automatiquement téléchargée vers notre serveur Cloudinary.</p>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t">
          <Button variant="outline" type="button" render={<Link href="/admin/evenements" />}>
            Annuler
          </Button>
          <Button type="submit" className="bg-purple-800 hover:bg-purple-900" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer l'événement
          </Button>
        </div>
      </form>
    </div>
  )
}
