import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface TicketRow {
  id: string
  qrCode: string
  status: "PENDING" | "PAID" | "USED" | "CANCELLED"
  createdAt: Date | string
  user: { name: string | null; email: string } | null
  guestName: string | null
  guestEmail: string | null
  event: { title: string }
  ticketType: { name: string; price: number | string } | null
}

interface TicketsTableProps {
  tickets: TicketRow[]
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  USED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  USED: "Utilisé",
  CANCELLED: "Annulé",
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Événement</TableHead>
            <TableHead>Participant</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Prix</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                Aucun billet trouvé
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell className="font-medium">{ticket.event.title}</TableCell>
                <TableCell>
                  {ticket.user ? (ticket.user.name || ticket.user.email) : (ticket.guestName || ticket.guestEmail || "Inconnu")}
                </TableCell>
                <TableCell>{ticket.ticketType?.name || "Standard"}</TableCell>
                <TableCell>
                  {(ticket.ticketType?.price !== undefined) 
                    ? `${Number(ticket.ticketType.price).toLocaleString()} FCFA` 
                    : "0 FCFA"}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[ticket.status]}>
                    {statusLabels[ticket.status]}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(ticket.createdAt), "d MMM yyyy", { locale: fr })}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
