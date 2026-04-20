import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/services/email.service"
import QRCode from "qrcode"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Payload from CENTRAL APIS callback
    // { partner_reference, state, transaction_reference, result... }
    const { partner_reference, state, transaction_reference } = body

    if (!partner_reference) {
      return NextResponse.json({ error: "Missing partner_reference" }, { status: 400 })
    }

    // partner_reference was saved as payment.id when initiating the payment.
    const payment = await prisma.payment.findUnique({
      where: { id: partner_reference },
      include: { ticket: { include: { event: true } } },
    })

    if (!payment || !payment.ticket) {
      return NextResponse.json({ error: "Payment or Ticket not found" }, { status: 404 })
    }

    const ticket = payment.ticket
    const event = ticket.event

    // Log the callback
    console.log(`CentralAPIs Webhook: Payment ${payment.id} state updated to ${state}`)

    if (state === "DONE") {
      // Payment Successful
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: "COMPLETED",
            externalId: transaction_reference || payment.externalId 
          },
        }),
        prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: "PAID" },
        })
      ])

      // Send confirmation email
      if ((ticket as any).guestEmail) {
        try {
          const qrDataUrl = await QRCode.toDataURL((ticket as any).qrCode, { margin: 1, width: 300 })
          const eventDate = format(new Date(event.startDate), "EEEE d MMMM yyyy 'à' HH:mm", { locale: fr })
          
          const htmlEmail = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 20px auto; color: #333;">
              <!-- Ticket Container -->
              <div style="display: flex; flex-direction: row; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); min-height: 220px; background-color: #fff;">
                
                <!-- Left Side: Event Image & Content -->
                <div style="flex: 1.5; position: relative; background: #3b0a68 url('${event.imageUrl || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"}') center/cover no-repeat; color: white; padding: 25px;">
                  <!-- Overlay -->
                  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(59, 10, 104, 0.95), rgba(0,0,0,0.4));"></div>
                  
                  <div style="position: relative; z-index: 1;">
                    <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 10px; font-weight: bold; color: #d4af37; margin: 0 0 10px;">JOY ALAWEY MINISTRIES</p>
                    <h2 style="font-size: 24px; margin: 0 0 15px; line-height: 1.1; font-weight: 800;">${event.title.toUpperCase()}</h2>
                    
                    <div style="font-size: 13px; margin-bottom: 20px; opacity: 0.9;">
                      <p style="margin: 5px 0;">📅 ${eventDate}</p>
                      <p style="margin: 5px 0;">📍 ${event.location || "Abidjan, Côte d'Ivoire"}</p>
                    </div>

                    <div style="display: flex; align-items: center; gap: 15px;">
                      <div style="background: #d4af37; color: #000; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;">
                        BILLET PAYÉ
                      </div>
                      <span style="font-size: 12px; color: rgba(255,255,255,0.7);">Billet de: ${(ticket as any).guestName}</span>
                    </div>
                  </div>
                </div>

                <!-- Separator (Perforation) -->
                <div style="width: 1px; border-left: 2px dashed #ddd; background-color: #f9f9f9; position: relative;">
                   <div style="position: absolute; top: -10px; left: -10px; width: 20px; height: 20px; background: #f8f7ff; border-radius: 50%;"></div>
                   <div style="position: absolute; bottom: -10px; left: -10px; width: 20px; height: 20px; background: #f8f7ff; border-radius: 50%;"></div>
                </div>

                <!-- Right Side: QR Code & Validation -->
                <div style="flex: 1; background-color: #fff; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center;">
                  <p style="font-size: 9px; font-weight: bold; color: #999; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Scannez ici</p>
                  <img src="${qrDataUrl}" alt="QR Code" style="width: 110px; height: 110px; margin-bottom: 10px;" />
                  <p style="font-size: 9px; font-family: monospace; color: #ccc; margin: 0;">REF: ${(ticket as any).qrCode}</p>
                </div>
              </div>
              
              <div style="margin-top: 20px; text-align: center;">
                <p style="font-size: 12px; color: #6b7280;">Veuillez présenter ce billet numérique ou imprimé à l'entrée de l'événement.</p>
              </div>
            </div>
          `

          await sendEmail({
            to: (ticket as any).guestEmail,
            subject: `🎟️ Billet confirmé — ${event.title}`,
            html: htmlEmail,
          })
        } catch (emailErr) {
          console.error("Failed to send webhook confirmation email:", emailErr)
        }
      }

    } else if (state === "FAILURE") {
      // Payment Failed
      await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: { 
            status: "FAILED",
            externalId: transaction_reference || payment.externalId 
          },
        }),
        prisma.ticket.update({
          where: { id: ticket.id },
          data: { status: "CANCELLED" },
        })
      ])
    }

    return NextResponse.json({ received: true, status: "processed" })
  } catch (error) {
    console.error("CentralAPIs Webhook Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
