import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { uploadImageBuffer, uploadVideoBuffer } from "@/lib/cloudinary"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  
  try {
    const formData = await req.formData()
    const title = formData.get("title") as string
    const youtubeUrlInput = formData.get("youtubeUrl") as string | null

    const category = formData.get("category") as string | null
    const publishedAt = formData.get("publishedAt") as string | null
    const videoFile = formData.get("video") as File | null

    const imageFile = formData.get("image") as File | null

    const currentTeaching = await prisma.teaching.findUnique({ where: { id } })
    if (!currentTeaching) return NextResponse.json({ error: "Not found" }, { status: 404 })

    let finalVideoUrl = currentTeaching.videoUrl

    let finalImageUrl = currentTeaching.imageUrl

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      finalImageUrl = await uploadImageBuffer(buffer, "church/teachings/images")
    }

    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      finalVideoUrl = await uploadVideoBuffer(buffer, "church/teachings/videos")
    }



    const teaching = await prisma.teaching.update({
      where: { id },
      data: {
        title: title || undefined,
        youtubeUrl: youtubeUrlInput === "" ? null : youtubeUrlInput || undefined,
        videoUrl: finalVideoUrl,

        imageUrl: finalImageUrl,
        category: category || undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    })

    return NextResponse.json(teaching)
  } catch (error) {
    console.error("Error updating teaching:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await prisma.teaching.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
