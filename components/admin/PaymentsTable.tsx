import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface PaymentRow {
  id: string
  amount: number | string
  currency: string
  method: "STRIPE" | "CINETPAY"
  status: "PENDING" | "COMPLETED" | "FAILED"
  createdAt: Date | string
  ticket?: { event: { title: string } } | null
  donation?: { id: string } | null
}

interface PaymentsTableProps {
  payments: PaymentRow[]
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  COMPLETED: "Complété",
  FAILED: "Échoué",
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Référence</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Méthode</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                Aucun paiement trouvé
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {payment.ticket ? "Billet" : payment.donation ? "Don" : "—"}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {payment.ticket?.event?.title || `Don #${payment.donation?.id.slice(0, 8)}`}
                </TableCell>
                <TableCell className="font-semibold">
                  {Number(payment.amount).toLocaleString()} {payment.currency}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{payment.method}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[payment.status]}>
                    {statusLabels[payment.status]}
                  </Badge>
                </TableCell>
                <TableCell>{format(new Date(payment.createdAt), "d MMM yyyy", { locale: fr })}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
