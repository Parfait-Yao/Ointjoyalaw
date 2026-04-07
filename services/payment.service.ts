import { prisma } from "@/lib/prisma"
import { PaymentMethod } from "@/app/generated/prisma/client"
import { stripe } from "@/lib/payments/stripe"
import { initializeCinetPayPayment } from "@/lib/payments/cinetpay"

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

  // Create pending payment in DB
  const payment = await prisma.payment.create({
    data: {
      amount: ticket.ticketType.price,
      method,
      ticketId: ticket.id,
      currency: "XOF"
    }
  })

  if (method === "STRIPE") {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "xof",
            product_data: {
              name: `Billet : ${ticket.event.title} - ${ticket.ticketType.name}`,
            },
            unit_amount: Number(ticket.ticketType.price) * 100, // Stripe expects minimum unit
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: payment.id,
    })

    await prisma.payment.update({
      where: { id: payment.id },
      data: { externalId: session.id }
    })

    return { url: session.url }
  } else if (method === "CINETPAY") {
    const transactionId = payment.id // Using payment.id as transaction ref
    const response = await initializeCinetPayPayment({
      transaction_id: transactionId,
      amount: Number(ticket.ticketType.price),
      currency: "XOF",
      description: `Billet : ${ticket.event.title}`,
      customer_name: ticket.user.name ?? "Client",
      customer_email: ticket.user.email,
      return_url: successUrl,
      notify_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/webhook/cinetpay`,
    });

    if (response.code === "201") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { externalId: response.data.payment_token }
      })
      return { url: response.data.payment_url }
    } else {
      throw new Error("Failed to initialize CinetPay payment")
    }
  }

  throw new Error("Invalid payment method")
}
