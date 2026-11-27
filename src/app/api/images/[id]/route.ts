import { Binary, MongoClient, ObjectId } from "mongodb"

import type { StoredImage } from "@/lib/image-storage"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  if (!ObjectId.isValid(id)) {
    return new Response("Invalid image id", { status: 400 })
  }

  const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string)

  try {
    const db = client.db("wedplan")
    const image = await db
      .collection<StoredImage>("images")
      .findOne({ _id: new ObjectId(id) })

    if (!image) {
      return new Response("Image not found", { status: 404 })
    }

    const bytes = image.data instanceof Binary
      ? new Uint8Array(image.data.buffer)
      : new Uint8Array(image.data)

    return new Response(bytes, {
      headers: {
        "Content-Type": image.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Failed to read image:", error)
    return new Response("Failed to read image", { status: 500 })
  } finally {
    await client.close()
  }
}
