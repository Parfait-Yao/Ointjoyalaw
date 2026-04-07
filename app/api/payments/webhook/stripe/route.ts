import { NextRequest, NextResponse } from "next-response"
import { stripe } from "@/lib/payments/stripe"
import { prisma } from "@/lib/prisma"
import { validateTicket } from "@/services/ticket.service"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    const payment = await prisma.payment.findFirst({
      where: { externalId: session.id }
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
        
        // TODO: Generate PDF and send Email with service
      }
    }
  }

  return new Response("OK", { status: 200 })
}
