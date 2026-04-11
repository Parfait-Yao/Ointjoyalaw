import { prisma } from "@/lib/prisma"
import { PaymentsTable } from "@/components/admin/PaymentsTable"

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      ticket: { include: { event: true } },
      donation: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100
  })

  const formattedPayments = payments.map(p => ({
    ...p,
    status: p.status as "PENDING" | "COMPLETED" | "FAILED",
    amount: Number(p.amount)
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paiements</h1>
          <p className="text-gray-500">Historique complet des transactions (billets et dons).</p>
        </div>
      </div>

      <PaymentsTable payments={formattedPayments} />
    </div>
  )
}
