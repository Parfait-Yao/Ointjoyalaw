import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/services/email.service"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import QRCode from "qrcode"
import crypto from "node:crypto"

export async function POST(req: Request) {
  try {
    console.log(">>> REGISTER ROUTE EXECUTING (RAW SQL BYPASS) <<<")
    const body = await req.json()
    const { eventId, name, email, phone, paymentMethod } = body

    if (!eventId || !name || !email) {
      return NextResponse.json(
        { error: "Nom, email et événement sont requis" },
        { status: 400 }
      )
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { tickets: true } } },
    })

    if (!event) {
      return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 })
    }

    // Check capacity
    if (event.capacity && event._count.tickets >= event.capacity) {
      return NextResponse.json(
        { error: "Cet événement est complet" },
        { status: 400 }
      )
    }

    // Create the ticket
    const ticket = await prisma.ticket.create({
      data: {
        eventId,
        guestName: name,
        guestEmail: email,
        guestPhone: phone || null,
        status: (event as any).isFree ? "PAID" : "PENDING",
      } as any,
      include: { event: true },
    })
    if ((event as any).isFree) {
      // Free event → send confirmation email directly
      const qrDataUrl = await QRCode.toDataURL(ticket.qrCode, { margin: 1, width: 300 })
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
                
                <div style="font-size: 13px; margin-bottom: 20px; opacitiy: 0.9;">
                  <p style="margin: 5px 0;">📅 ${eventDate}</p>
                  <p style="margin: 5px 0;">📍 ${event.location || "Abidjan, Côte d'Ivoire"}</p>
                </div>

                <div style="display: flex; align-items: center; gap: 15px;">
                  <div style="background: #d4af37; color: #000; padding: 4px 12px; border-radius: 4px; font-weight: bold; font-size: 12px;">
                    ${(event as any).isFree ? "BILLET GRATUIT" : `${Number((event as any).price).toLocaleString()} FCFA`}
                  </div>
                  <span style="font-size: 12px; color: rgba(255,255,255,0.7);">Billet de: ${name}</span>
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
              <p style="font-size: 9px; font-family: monospace; color: #ccc; margin: 0;">REF: ${ticket.qrCode}</p>
            </div>
          </div>
          
          <div style="margin-top: 20px; text-align: center;">
            <p style="font-size: 12px; color: #6b7280;">Veuillez présenter ce billet numérique ou imprimé à l'entrée de l'événement.</p>
          </div>
        </div>
      `

      try {
        await sendEmail({
          to: email,
          subject: `✅ Inscription confirmée — ${event.title}`,
          html: htmlEmail,
        })
      } catch (emailErr) {
        console.error("Email sending failed:", emailErr)
      }

      return NextResponse.json({
        success: true,
        ticket: { id: ticket.id, qrCode: ticket.qrCode, status: ticket.status },
        message: "Inscription réussie ! Un email de confirmation a été envoyé.",
      })
    } else {
      // Paid event → initiate CinetPay payment
      if (!paymentMethod || !phone) {
        return NextResponse.json(
          { error: "Le numéro de téléphone et le moyen de paiement sont requis pour les événements payants" },
          { status: 400 }
        )
      }

      // Clean phone number (remove +225 or 225 prefixes)
      const cleanPhone = phone.replace(/^(\+225|225)/, "")
      
      const paymentId = crypto.randomBytes(6).toString('hex') // 12-char alphanumeric reference
      // Bypass stale client validation with Raw SQL
      await prisma.$executeRawUnsafe(
        `INSERT INTO "Payment" ("id", "amount", "method", "ticketId", "currency", "status", "createdAt") 
         VALUES ($1, $2, 'CENTRAL_APIS'::"PaymentMethod", $3, 'XOF', 'PENDING', NOW())`,
        paymentId, 
        Number((event as any).price), 
        ticket.id
      )

      const payment = { id: paymentId }

      try {
        const payload = {
          numberClient: cleanPhone,
          typeService: paymentMethod.toLowerCase(),
          amount: Number((event as any).price),
          reference: payment.id,
          urlCallback: (process.env.CALLBACK_URL || "").trim()
        }
        
        console.log("CentralAPIs Payload:", JSON.stringify(payload, null, 2))
        
        const depositRes = await fetch("https://api.centralapis.com/api/v1/finance/deposit", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "x-app-access": (process.env.CLIENT_ID || "").trim(),
            "x-app-token": (process.env.CLIENT_SECRET || "").trim(),
          },
          body: JSON.stringify(payload),
        })
        
        const depositData = await depositRes.json()
        console.log("CentralAPIs Response:", depositData)

        if (depositData.etat === false) {
           const errorMsg = Array.isArray(depositData.error) ? depositData.error[0] : (depositData.message || "Erreur CentralAPIs")
           return NextResponse.json({ success: false, error: errorMsg }, { status: 400 })
        }

        // Provide frontend with success and payment details
        return NextResponse.json({
          success: true,
          ticket: { id: ticket.id, qrCode: ticket.qrCode },
          paymentUrl: depositData.result?.payment_url || null,
          message: depositData.result?.payment_url 
            ? "Veuillez cliquer sur le bouton payer pour valider avec Wave." 
            : "Demande de paiement envoyée sur votre mobile. Veuillez valider avec votre code secret."
        })
      } catch (payErr) {
        console.error("Central APIs init error:", payErr)
        return NextResponse.json(
          { error: "Erreur lors de l'initialisation du paiement." },
          { status: 502 }
        )
      }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
