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

  const formattedPayments = payments.map((p: any) => ({
    ...p,
    status: p.status as "PENDING" | "COMPLETED" | "FAILED",
    amount: Number(p.amount)
  }))

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Paiements</h1>
          <p className="text-sm text-gray-500">Historique complet des transactions (billets et dons).</p>
        </div>
      </div>

      <PaymentsTable payments={formattedPayments} />
    </div>
  )
}
