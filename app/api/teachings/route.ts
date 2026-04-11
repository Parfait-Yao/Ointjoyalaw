// v2: Support de imageUrl
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { writeFile } from "fs/promises"
import path from "path"

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
    const pdfUrlInput = formData.get("pdfUrl") as string | null
    const category = formData.get("category") as string | null
    const publishedAt = formData.get("publishedAt") as string | null
    const videoFile = formData.get("video") as File | null
    const pdfFile = formData.get("pdf") as File | null
    const imageFile = formData.get("image") as File | null

    if (!title) return NextResponse.json({ error: "Title required" }, { status: 400 })

    let finalVideoUrl = null
    let finalPdfUrl = null
    let finalImageUrl = null

    // Handling Image Upload
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`
      const uploadDir = path.join(process.cwd(), "public/uploads/images")
      await writeFile(path.join(uploadDir, filename), buffer)
      finalImageUrl = `/uploads/images/${filename}`
    }

    // Handing Video Upload
    if (videoFile && videoFile.size > 0) {
      const buffer = Buffer.from(await videoFile.arrayBuffer())
      const filename = `${Date.now()}-${videoFile.name.replaceAll(" ", "_")}`
      const uploadDir = path.join(process.cwd(), "public/uploads/videos")
      await writeFile(path.join(uploadDir, filename), buffer)
      finalVideoUrl = `/uploads/videos/${filename}`
    }

    // Handling PDF Upload
    if (pdfFile && pdfFile.size > 0) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer())
      const filename = `${Date.now()}-${pdfFile.name.replaceAll(" ", "_")}`
      const uploadDir = path.join(process.cwd(), "public/uploads/pdfs")
      await writeFile(path.join(uploadDir, filename), buffer)
      finalPdfUrl = `/uploads/pdfs/${filename}`
    } else if (pdfUrlInput) {
      finalPdfUrl = pdfUrlInput
    }

    const teaching = await prisma.teaching.create({
      data: {
        title,
        youtubeUrl: youtubeUrlInput || null,
        videoUrl: finalVideoUrl,
        pdfUrl: finalPdfUrl,
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