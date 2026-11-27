import { MongoClient, ObjectId } from "mongodb"
import { NextResponse } from "next/server"

import type { StoredImage } from "@/lib/image-storage"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 MB

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("image")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image file provided." }, { status: 400 })
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 })
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json({ error: "Image must be smaller than 5 MB." }, { status: 400 })
  }

  const client = new MongoClient(process.env.BETTER_AUTH_DB_URL as string)

  try {
    const db = client.db("wedplan")
    const collection = db.collection<StoredImage>("images")
    const result = await collection.insertOne({
      _id: new ObjectId(),
      data: Buffer.from(await file.arrayBuffer()),
      contentType: file.type,
      createdAt: new Date(),
    })

    return NextResponse.json({ url: `/api/images/${result.insertedId}` })
  } catch (error) {
    console.error("Failed to store image:", error)
    return NextResponse.json({ error: "Failed to store image." }, { status: 500 })
  } finally {
    await client.close()
  }
}
