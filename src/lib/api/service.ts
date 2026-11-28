const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export const SERVICE_CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
]

export type Service = {
  _id: string
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images: string[]
  vendorEmail: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export type ServiceInput = {
  serviceName: string
  category: string
  description: string
  price: number
  location: string
  images?: string[]
}

export const getServices = async (vendorEmail: string): Promise<Service[]> => {
  const res = await fetch(
    `${BASE_URL}/services?vendorEmail=${encodeURIComponent(vendorEmail)}`,
  )
  if (!res.ok) {
    throw new Error("Could not load services")
  }
  return res.json()
}