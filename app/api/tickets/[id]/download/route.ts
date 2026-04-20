import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateTicketPDFDocument } from "@/services/pdf.service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: { event: true, ticketType: true },
    })

    if (!ticket) {
      return NextResponse.json({ error: "Billet non trouvé" }, { status: 404 })
    }

    const pdfBuffer = await generateTicketPDFDocument({
      id: ticket.id,
      qrCode: ticket.qrCode,
      eventTitle: ticket.event.title,
      ticketType: ticket.event.isFree ? "Gratuit" : `${Number(ticket.event.price).toLocaleString()} FCFA`,
      userName: ticket.guestName || "Invité",
      date: format(new Date(ticket.event.startDate), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr }),
      location: ticket.event.location || "Abidjan, Côte d'Ivoire",
      price: ticket.event.isFree ? "GRATUIT" : `${Number(ticket.event.price).toLocaleString()} FCFA`,
      imageUrl: ticket.event.imageUrl || undefined,
    })

    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="billet-${ticket.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Download ticket error:", error)
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}
