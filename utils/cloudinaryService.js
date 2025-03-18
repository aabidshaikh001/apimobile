import { v2 as cloudinary } from "cloudinary"
import dotenv from "dotenv"

dotenv.config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

class CloudinaryService {
  // Upload an image to Cloudinary
  async uploadImage(fileBuffer, folder = "users") {
    try {
      // Convert buffer to base64
      const base64String = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64String, {
        folder,
        resource_type: "image",
      })

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error)
      throw error
    }
  }

  // Upload a document to Cloudinary
  async uploadDocument(fileBuffer, folder = "documents") {
    try {
      // Convert buffer to base64
      const base64String = `data:application/pdf;base64,${fileBuffer.toString("base64")}`

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64String, {
        folder,
        resource_type: "auto",
      })

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      }
    } catch (error) {
      console.error("Error uploading document to Cloudinary:", error)
      throw error
    }
  }

  // Delete a file from Cloudinary
  async deleteFile(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return {
        success: result.result === "ok",
        message: result.result,
      }
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error)
      throw error
    }
  }
}

export default new CloudinaryService()

