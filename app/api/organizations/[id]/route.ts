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
    const organization = await prisma.organization.findUnique({
      where: { id }
    })
    
    if (!organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 })
    }

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const formData = await req.formData()
    
    const name = formData.get("name") as string
    const role = formData.get("role") as string | null
    const acronym = formData.get("acronym") as string | null
    const description = formData.get("description") as string | null
    const websiteUrl = formData.get("websiteUrl") as string | null
    const creationDateInput = formData.get("creationDate") as string | null
    const imageFile = formData.get("image") as File | null

    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 })

    const updateData: any = {
      name,
      role: role || null,
      acronym: acronym || null,
      description: description || null,
      websiteUrl: websiteUrl || null,
      creationDate: creationDateInput ? new Date(creationDateInput) : null,
    }

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const finalImageUrl = await uploadImageBuffer(buffer, "church/organizations/images")
      updateData.imageUrl = finalImageUrl
    }

    const organization = await prisma.organization.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params

    await prisma.organization.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    console.error("Error deleting organization:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
