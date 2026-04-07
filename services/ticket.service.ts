import { prisma } from "@/lib/prisma"

export async function generateTicket(userId: string, eventId: string, ticketTypeId: string) {
  // Check availability
  const type = await prisma.ticketType.findUnique({
    where: { id: ticketTypeId },
    include: { _count: { select: { tickets: true } } }
  })

  if (!type) throw new Error("Ticket type not found")
  if (type._count.tickets >= type.quantity) throw new Error("Sold out")

  // Create ticket with PENDING status
  const ticket = await prisma.ticket.create({
    data: {
      userId,
      eventId,
      ticketTypeId,
      // qrCode string is auto-generated in Schema
    }
  })

  return ticket
}

export async function validateTicket(qrCode: string) {
  const ticket = await prisma.ticket.findUnique({
    where: { qrCode }
  })

  if (!ticket) throw new Error("Invalid Ticket")
  if (ticket.status === "USED") throw new Error("Ticket already used")
  if (ticket.status !== "PAID") throw new Error("Ticket not paid")

  return await prisma.ticket.update({
    where: { id: ticket.id },
    data: { status: "USED" }
  })
}
