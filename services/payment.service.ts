import { prisma } from "@/lib/prisma"
import { PaymentMethod } from "@prisma/client"
import { initiateCentralApiDeposit } from "@/services/centralapis.service"

export async function createCheckoutSession(
  ticketId: string,
  method: PaymentMethod,
  successUrl: string,
  cancelUrl: string
) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { ticketType: true, user: true, event: true }
  })

  if (!ticket) throw new Error("Ticket not found")
  if (!ticket.ticketType) throw new Error("Ticket type not found")

  // Create pending payment in DB
  const payment = await prisma.payment.create({
    data: {
      amount: ticket.ticketType.price,
      method,
      ticketId: ticket.id,
      currency: "XOF"
    }
  })

  if (method === "CENTRAL_APIS") {
    const response = await initiateCentralApiDeposit({
      numberClient: ticket.guestPhone || "",
      amount: Number(ticket.ticketType.price),
      typeService: "MTN",
      reference: payment.id,
    })

    await prisma.payment.update({
      where: { id: payment.id },
      data: { externalId: response?.reference || payment.id }
    })

    return { url: successUrl, paymentId: payment.id }
  }

  throw new Error("Invalid payment method")
}
