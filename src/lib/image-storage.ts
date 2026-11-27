import type { Binary, ObjectId } from "mongodb"

export type StoredImage = {
  _id: ObjectId
  data: Binary | Uint8Array
  contentType: string
  createdAt: Date
}
