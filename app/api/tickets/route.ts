import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tickets = await prisma.ticket.findMany({
      include: {
        user: true,
        event: true,
        ticketType: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Failed to fetch tickets:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
