import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import path from "path"

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
    const pdfUrlInput = formData.get("pdfUrl") as string | null
    const category = formData.get("category") as string | null
    const publishedAt = formData.get("publishedAt") as string | null
    const videoFile = formData.get("video") as File | null
    const pdfFile = formData.get("pdf") as File | null
    const imageFile = formData.get("image") as File | null

    const currentTeaching = await prisma.teaching.findUnique({ where: { id } })
    if (!currentTeaching) return NextResponse.json({ error: "Not found" }, { status: 404 })

    let finalVideoUrl = currentTeaching.videoUrl
    let finalPdfUrl = currentTeaching.pdfUrl
    let finalImageUrl = currentTeaching.imageUrl

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`
      const uploadDir = path.join(process.cwd(), "public/uploads/images")
      await writeFile(path.join(uploadDir, filename), buffer)
      finalImageUrl = `/uploads/images/${filename}`
    }

    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      const filename = `${Date.now()}-${videoFile.name.replaceAll(" ", "_")}`
      const uploadDir = path.join(process.cwd(), "public/uploads/videos")
      await writeFile(path.join(uploadDir, filename), buffer)
      finalVideoUrl = `/uploads/videos/${filename}`
    }

    if (pdfFile && pdfFile.size > 0) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer())
      const filename = `${Date.now()}-${pdfFile.name.replaceAll(" ", "_")}`
      const uploadDir = path.join(process.cwd(), "public/uploads/pdfs")
      await writeFile(path.join(uploadDir, filename), buffer)
      finalPdfUrl = `/uploads/pdfs/${filename}`
    } else if (pdfUrlInput) {
       finalPdfUrl = pdfUrlInput
    }

    const teaching = await prisma.teaching.update({
      where: { id },
      data: {
        title: title || undefined,
        youtubeUrl: youtubeUrlInput === "" ? null : youtubeUrlInput || undefined,
        videoUrl: finalVideoUrl,
        pdfUrl: finalPdfUrl,
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
