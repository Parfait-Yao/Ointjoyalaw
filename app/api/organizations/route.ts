import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { uploadImageBuffer } from "@/lib/cloudinary"

export async function GET() {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const name = formData.get("name") as string
    const role = formData.get("role") as string | null
    const acronym = formData.get("acronym") as string | null
    const description = formData.get("description") as string | null
    const websiteUrl = formData.get("websiteUrl") as string | null
    const creationDateInput = formData.get("creationDate") as string | null
    const imageFile = formData.get("image") as File | null

    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 })

    let finalImageUrl = null

    // Handling Image Upload to Cloudinary
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      finalImageUrl = await uploadImageBuffer(buffer, "church/organizations/images")
    }

    const organization = await prisma.organization.create({
      data: {
        name,
        role: role || null,
        acronym: acronym || null,
        description: description || null,
        websiteUrl: websiteUrl || null,
        imageUrl: finalImageUrl,
        creationDate: creationDateInput ? new Date(creationDateInput) : null,
      },
    })

    return NextResponse.json(organization, { status: 201 })
  } catch (error) {
    console.error("Error creating organization:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
