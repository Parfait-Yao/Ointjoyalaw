// v2: Support de imageUrl
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { uploadImageBuffer, uploadVideoBuffer } from "@/lib/cloudinary"

export async function GET() {
  const teachings = await prisma.teaching.findMany({
    orderBy: { publishedAt: "desc" },
  })
  return NextResponse.json(teachings)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const youtubeUrlInput = formData.get("youtubeUrl") as string | null

    const category = formData.get("category") as string | null
    const publishedAt = formData.get("publishedAt") as string | null
    const videoFile = formData.get("video") as File | null

    const imageFile = formData.get("image") as File | null

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

    let finalVideoUrl = null

    let finalImageUrl = null

    // Handling Image Upload to Cloudinary
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      finalImageUrl = await uploadImageBuffer(buffer, "church/teachings/images")
    }

    // Handling Video Upload to Cloudinary
    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      finalVideoUrl = await uploadVideoBuffer(buffer, "church/teachings/videos")
    }



    const teaching = await prisma.teaching.create({
      data: {
        title,
        youtubeUrl: youtubeUrlInput || null,
        videoUrl: finalVideoUrl,

        imageUrl: finalImageUrl,
        category: category || "Foi",
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    })

    return NextResponse.json(teaching, { status: 201 })
  } catch (error) {
    console.error("Error creating teaching:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}