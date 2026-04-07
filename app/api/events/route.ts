import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDate: "asc" }
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error("Failed to fetch events:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const { title, description, startDate, location, capacity, imageUrl } = json

    const event = await prisma.event.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        location,
        capacity: capacity ? parseInt(capacity) : null,
        imageUrl,
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Failed to create event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
