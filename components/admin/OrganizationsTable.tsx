"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, AlertTriangle, Loader2, ExternalLink, Eye, Edit2 } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import Image from "next/image"

interface Organization {
  id: string
  name: string
  role: string | null
  description: string | null
  creationDate: Date | string | null
  imageUrl: string | null
  websiteUrl: string | null
  acronym: string | null
  createdAt: Date | string
}

interface OrganizationsTableProps {
  organizations: Organization[]
}

export function OrganizationsTable({ organizations }: OrganizationsTableProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [orgToDelete, setOrgToDelete] = useState<{ id: string, name: string } | null>(null)

  const openDeleteModal = (id: string, name: string) => {
    setOrgToDelete({ id, name })
    setDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!orgToDelete) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/organizations/${orgToDelete.id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        setDeleteModalOpen(false)
        toast.success("Organisation supprimée avec succès.")
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
            <TableHead className="font-bold">Nom</TableHead>
            <TableHead className="font-bold">Rôle / Acronyme</TableHead>
            <TableHead className="font-bold">Date de création</TableHead>
            <TableHead className="font-bold">Liens</TableHead>
            <TableHead className="text-right px-6 font-bold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-gray-500 py-12">
                Aucune organisation trouvée
              </TableCell>
            </TableRow>
          ) : (
            organizations.map((org) => {
              return (
                <TableRow key={org.id} className="hover:bg-gray-50/50 transition-colors">
                  <TableCell className="font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      {org.imageUrl ? (
                        <div className="w-10 h-10 relative rounded-lg overflow-hidden shrink-0 border border-gray-100">
                          <Image src={org.imageUrl} alt={org.name} fill className="object-cover" sizes="40px" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold text-xs shrink-0">
                          {org.name.substring(0,2).toUpperCase()}
                        </div>
                      )}
                      {org.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 items-start">
                      {org.role && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100 font-bold text-[10px] uppercase tracking-wider">
                          {org.role}
                        </Badge>
                      )}
                      {org.acronym && (
                        <span className="text-xs text-gray-500">{org.acronym}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {org.creationDate ? format(new Date(org.creationDate), "d MMM yyyy", { locale: fr }) : "ND"}
                  </TableCell>
                  <TableCell>
                    {org.websiteUrl ? (
                      <a href={org.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1 text-xs">
                        <ExternalLink className="w-3 h-3" /> Visiter le site
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">Aucun lien</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/organisations/${org.id}`)}
                        className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/organisations/${org.id}/modifier`)}
                        className="text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
                        title="Modifier"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => openDeleteModal(org.id, org.name)} 
                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
            <DialogTitle className="text-xl">Supprimer l'organisation ?</DialogTitle>
            <DialogDescription className="text-gray-500 pt-2">
              Cette action supprimera définitivement l'organisation <strong>{orgToDelete?.name}</strong>.
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
    </div>
  )
}
