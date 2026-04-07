import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const { amount, currency, email, name } = json

    let user = null
    if (email) {
      user = await prisma.user.findUnique({ where: { email } })
      if (!user && name) {
        user = await prisma.user.create({
          data: { email, name }
        })
      }
    }

    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        currency: currency || "XOF",
        userId: user?.id
      }
    })

    return NextResponse.json(donation, { status: 201 })
  } catch (error) {
    console.error("Failed to process donation:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
