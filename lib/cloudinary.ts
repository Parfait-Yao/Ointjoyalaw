import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImageBuffer(buffer: Buffer, folder: string = "church/images"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error)
        } else {
          resolve(result.secure_url)
        }
      }
    )

    uploadStream.end(buffer)
  })
}

export async function uploadVideoBuffer(buffer: Buffer, folder: string = "church/videos"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "video" },
      (error, result) => {
        if (error || !result) {
          reject(error)
        } else {
          resolve(result.secure_url)
        }
      }
    )

    uploadStream.end(buffer)
  })
}

export async function uploadPdfBuffer(buffer: Buffer, folder: string = "church/pdfs"): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "raw" },
      (error, result) => {
        if (error || !result) {
          reject(error)
        } else {
          resolve(result.secure_url)
        }
      }
    )

    uploadStream.end(buffer)
  })
}
