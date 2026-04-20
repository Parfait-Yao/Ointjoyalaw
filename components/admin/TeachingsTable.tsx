"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, AlertTriangle, Loader2, Eye, Play, Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface Teaching {
  id: string
  title: string
  youtubeUrl: string | null
  videoUrl: string | null

  category: string | null
  publishedAt: Date | string
}

interface TeachingsTableProps {
  teachings: Teaching[]
}

export function TeachingsTable({ teachings }: TeachingsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [teachingToDelete, setTeachingToDelete] = useState<{ id: string, title: string } | null>(null)
  const [selectedTeaching, setSelectedTeaching] = useState<Teaching | null>(null)

  const openDeleteModal = (id: string, title: string) => {
    setTeachingToDelete({ id, title })
    setDeleteModalOpen(true)
  }

  const openPreview = (teaching: Teaching) => {
    setSelectedTeaching(teaching)
    setPreviewModalOpen(true)
  }

  const handleDelete = async () => {
    if (!teachingToDelete) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/teachings/${teachingToDelete.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteModalOpen(false)
        toast.success("Enseignement supprimé avec succès.")
        router.refresh()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const getYoutubeId = (url: string | null) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? match[1] : null
  }

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold">Titre</TableHead>
            <TableHead className="font-bold">Catégorie</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="font-bold">Médias</TableHead>
            <TableHead className="text-right px-6 font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                Aucun enseignement trouvé
              </TableCell>
            </TableRow>
          ) : (
            teachings.map((t) => {
              const date = new Date(t.publishedAt)
              return (
                <TableRow key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold text-gray-900">{t.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 font-bold text-[10px] uppercase tracking-wider">
                      {t.category || "Foi"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {format(date, "d MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5 font-bold">
                        {(t.youtubeUrl || t.videoUrl) && (
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 text-[10px] uppercase">
                                <Play className="h-3 w-3" /> Vidéo
                            </div>
                        )}

                    </div>
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openPreview(t)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-all" render={<Link href={`/admin/enseignements/${t.id}`} />}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openDeleteModal(t.id, t.title)} 
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl">Supprimer l'enseignement ?</DialogTitle>
            <DialogDescription className="text-gray-500 pt-2">
              Cette action supprimera définitivement l'enseignement <strong>{teachingToDelete?.title}</strong> ainsi que ses médias associés.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)} disabled={loading} className="rounded-xl">
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={loading} 
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-6"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden max-h-[95vh] flex flex-col">
          <div className="bg-[#3b0a68] p-6 text-white relative">
            <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-500/20 text-purple-200 border-purple-500/30 text-[10px] font-bold uppercase tracking-widest">
                    {selectedTeaching?.category || "Enseignement"}
                </Badge>
                <span className="text-xs text-purple-300">Publié le {selectedTeaching?.publishedAt && format(new Date(selectedTeaching.publishedAt), "d MMMM yyyy", { locale: fr })}</span>
            </div>
            <DialogTitle className="text-2xl font-black text-white leading-tight">
                {selectedTeaching?.title}
            </DialogTitle>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Video Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Play className="h-3 w-3 text-red-500" />
                Aperçu Vidéo
              </h4>
              {selectedTeaching?.youtubeUrl ? (
                <div className="rounded-2xl overflow-hidden aspect-video shadow-2xl bg-black">
                  <iframe 
                    src={`https://www.youtube.com/embed/${getYoutubeId(selectedTeaching.youtubeUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              ) : selectedTeaching?.videoUrl ? (
                <div className="rounded-2xl overflow-hidden aspect-video shadow-2xl bg-black">
                  <video src={selectedTeaching.videoUrl} controls className="w-full h-full" />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300">
                    <Play className="h-10 w-10 mb-2 opacity-20" />
                    <p className="text-sm font-medium">Aucun média vidéo</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                          <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Publication</p>
                          <p className="text-sm font-bold text-gray-900">Programmé</p>
                      </div>
                  </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-gray-50/50 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setPreviewModalOpen(false)} className="rounded-xl w-full sm:w-auto">
              Fermer
            </Button>
            <Button className="bg-purple-800 hover:bg-purple-900 rounded-xl w-full sm:w-auto" render={<Link href={`/admin/enseignements/${selectedTeaching?.id}`} />}>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
