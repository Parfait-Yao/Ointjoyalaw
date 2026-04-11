import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { uploadImageBuffer } from "@/lib/cloudinary"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        ticketTypes: true
      }
    })
    if (!event) return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 })
    return NextResponse.json(event)
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string | null
    const startDate = formData.get("startDate") as string
    const location = formData.get("location") as string | null
    const capacity = formData.get("capacity") as string | null
    const category = formData.get("category") as string | null
    const imageFile = formData.get("image") as File | null

    const updateData: any = {
      title,
      description: description || null,
      startDate: new Date(startDate),
      location: location || null,
      capacity: capacity ? parseInt(capacity) : null,
      category: category || "Autre",
    }

    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      updateData.imageUrl = await uploadImageBuffer(buffer, "church-events")
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(event)
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    await prisma.event.delete({
      where: { id }
    })

    return NextResponse.json({ message: "Événement supprimé" })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}
