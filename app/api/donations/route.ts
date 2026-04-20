import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import crypto from "node:crypto"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { amount, email, name, phone, paymentMethod } = json

    if (!amount || !email || !name || !phone || !paymentMethod) {
      return NextResponse.json(
        { error: "Tous les champs sont requis (montant, nom, email, téléphone, méthode)" },
        { status: 400 }
      )
    }

    // 1. Manage User
    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: { email, name }
      })
    }

    // 2. Create Donation Record
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        currency: "XOF",
        userId: user.id
      }
    })

    // 3. Create Payment Record (using raw SQL if needed, but let's try Prisma first)
    const paymentId = crypto.randomBytes(6).toString('hex')
    
    // We use the same pattern as tickets for consistency
    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "Payment" ("id", "amount", "method", "donationId", "currency", "status", "createdAt") 
       VALUES ($1, $2, 'CENTRAL_APIS'::"PaymentMethod", $3, 'XOF', 'PENDING', NOW())`,
      paymentId, 
      parseFloat(amount), 
      donation.id
    )

    // 4. Initiate CentralAPIs Payment
    const cleanPhone = phone.replace(/^(\+225|225)/, "")
    
    const payload = {
      numberClient: cleanPhone,
      typeService: paymentMethod.toLowerCase(),
      amount: parseFloat(amount),
      reference: paymentId,
      urlCallback: (process.env.CALLBACK_URL || "").trim()
    }
    
    console.log("CentralAPIs Donation Payload:", JSON.stringify(payload, null, 2))
    
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
    console.log("CentralAPIs Donation Response:", depositData)

    if (depositData.etat === false) {
       const errorMsg = Array.isArray(depositData.error) ? depositData.error[0] : (depositData.message || "Erreur CentralAPIs")
       return NextResponse.json({ success: false, error: errorMsg }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      donationId: donation.id,
      paymentUrl: depositData.result?.payment_url || null,
      message: depositData.result?.payment_url 
        ? "Veuillez cliquer sur le bouton payer pour valider avec Wave." 
        : "Demande de paiement envoyée sur votre mobile. Veuillez valider avec votre code secret."
    }, { status: 201 })

  } catch (error) {
    console.error("Failed to process donation:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
