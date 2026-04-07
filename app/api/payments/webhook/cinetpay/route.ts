import { prisma } from "@/lib/prisma"
import { verifyCinetPaySignature } from "@/lib/payments/cinetpay"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("x-token") as string

  if (!verifyCinetPaySignature(signature, body)) {
    return new Response("Invalid Signature", { status: 400 })
  }

  const data = JSON.parse(body)

  if (data.cpm_result === "00") {
    const payment = await prisma.payment.findUnique({
      where: { id: data.cpm_trans_id } // We used payment ID as trans_id
    })

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "COMPLETED" }
      })

      if (payment.ticketId) {
        await prisma.ticket.update({
          where: { id: payment.ticketId },
          data: { status: "PAID" }
        })
      }
    }
  }

  return new Response("OK", { status: 200 })
}
