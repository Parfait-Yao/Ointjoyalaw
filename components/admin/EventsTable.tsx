"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, AlertTriangle, Loader2, Eye, Calendar, MapPin, Users, Tag } from "lucide-react"
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

interface EventRow {
  id: string
  title: string
  description?: string | null
  startDate: Date | string
  location: string | null
  capacity: number | null
  imageUrl?: string | null
  category?: string | null
  _count?: { tickets: number }
  organizations?: { id: string; name: string; acronym: string | null }[]
}

interface EventsTableProps {
  events: EventRow[]
}

export function EventsTable({ events }: EventsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<{ id: string, title: string } | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null)

  const openDeleteModal = (id: string, title: string) => {
    setEventToDelete({ id, title })
    setDeleteModalOpen(true)
  }

  const openPreview = (event: EventRow) => {
    setSelectedEvent(event)
    setPreviewModalOpen(true)
  }

  const handleDelete = async () => {
    if (!eventToDelete) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/events/${eventToDelete.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteModalOpen(false)
        toast.success("Événement supprimé avec succès.")
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

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow>
            <TableHead className="font-bold">Titre</TableHead>
            <TableHead className="font-bold">Catégorie</TableHead>
            <TableHead className="font-bold">Date</TableHead>
            <TableHead className="font-bold">Organisations</TableHead>
            <TableHead className="font-bold">Lieu</TableHead>
            <TableHead className="text-center font-bold">Capacité</TableHead>
            <TableHead className="text-center font-bold">Billets</TableHead>
            <TableHead className="text-right px-6 font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500 py-12">
                Aucun événement trouvé
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => {
              const date = new Date(event.startDate)
              const isPast = date < new Date()
              return (
                <TableRow key={event.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold text-gray-900">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 font-bold text-[10px] uppercase tracking-wider">
                      {event.category || "Autre"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {format(date, "d MMM yyyy", { locale: fr })}
                    {isPast && <Badge variant="secondary" className="ml-2 text-xs opacity-60">Passé</Badge>}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {event.organizations && event.organizations.length > 0 ? (
                        event.organizations.map((org) => (
                          <Badge key={org.id} variant="secondary" className="text-[9px] font-bold px-1.5 py-0 bg-gray-100 text-gray-600 border-none shrink-0">
                            {org.acronym || org.name.substring(0, 3)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-300 mx-auto">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{event.location || "—"}</TableCell>
                  <TableCell className="text-center text-gray-600">{event.capacity ?? "∞"}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-bold text-gray-900">{event._count?.tickets ?? 0}</span>
                  </TableCell>
                  <TableCell className="text-right px-6 space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-green-600 hover:bg-green-50 transition-all" 
                      render={<Link href={`/admin/evenements/${event.id}/inscrits`} />}
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openPreview(event)}
                      className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-purple-700 hover:bg-purple-50 transition-all" 
                      render={<Link href={`/admin/evenements/${event.id}`} />}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => openDeleteModal(event.id, event.title)} 
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
            <DialogTitle className="text-xl">Supprimer l'événement ?</DialogTitle>
            <DialogDescription className="text-gray-500 pt-2">
              Cette action supprimera définitivement <strong>{eventToDelete?.title}</strong>. Cette opération ne peut pas être annulée.
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
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {selectedEvent?.imageUrl && (
            <div className="relative w-full h-64 bg-gray-100">
              <img 
                src={selectedEvent.imageUrl} 
                alt={selectedEvent.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-white/90 text-purple-700 hover:bg-white backdrop-blur-sm border-none shadow-sm font-bold">
                  {selectedEvent.category || "Événement"}
                </Badge>
              </div>
            </div>
          )}
          
          <div className="p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-1">{selectedEvent?.title}</DialogTitle>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  {selectedEvent?.startDate && format(new Date(selectedEvent.startDate), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  {selectedEvent?.location || "Lieu non défini"}
                </div>
              </div>
              {selectedEvent?.organizations && selectedEvent.organizations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2 py-1">Partenaires:</span>
                  {selectedEvent.organizations.map((org) => (
                    <Badge key={org.id} className="bg-purple-50 text-purple-700 border-purple-100 font-bold text-[10px] uppercase px-3 py-1">
                      {org.name} {org.acronym && `(${org.acronym})`}
                    </Badge>
                  ))}
                </div>
              )}
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-1 text-gray-400">
                    <Users className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Capacité</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedEvent?.capacity || "Illimitée"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-1 text-gray-400">
                    <Tag className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Billets vendus</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedEvent?._count?.tickets || 0}</p>
                </div>
              </div>

              {selectedEvent?.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</h4>
                  <div className="prose prose-sm max-w-none text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <p className="whitespace-pre-wrap">{selectedEvent.description}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-6 border-t bg-gray-50/50">
            <Button variant="outline" onClick={() => setPreviewModalOpen(false)} className="rounded-xl w-full sm:w-auto">
              Fermer l'aperçu
            </Button>
            <Button className="bg-purple-800 hover:bg-purple-900 rounded-xl w-full sm:w-auto" render={<Link href={`/admin/evenements/${selectedEvent?.id}`} />}>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
