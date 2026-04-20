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

import { uploadImageBuffer } from "@/lib/cloudinary"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string | null
    const startDate = formData.get("startDate") as string
    const location = formData.get("location") as string | null
    const capacity = formData.get("capacity") as string | null
    const imageFile = formData.get("image") as File | null
    const category = formData.get("category") as string | null
    const organizationIds = formData.getAll("organizationIds") as string[]
    
    const isFree = formData.get("isFree") === "true"
    const priceStr = formData.get("price") as string | null
    const price = !isFree && priceStr ? parseFloat(priceStr) : null

    if (!title || !startDate) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 })
    }

    let imageUrl = null

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      imageUrl = await uploadImageBuffer(buffer, "church-events")
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        startDate: new Date(startDate),
        location: location || null,
        capacity: capacity ? parseInt(capacity) : null,
        imageUrl,
        category: category || "Autre",
        isFree,
        price,
        organizations: {
          connect: organizationIds.map(id => ({ id }))
        }
      },
      include: {
        organizations: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error("Failed to create event:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
