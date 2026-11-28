"use client"

import { useRef, useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ImageIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

import { authClient } from "@/lib/auth-client"
import { SERVICE_CATEGORIES } from "@/lib/api/service"
import { createService } from "@/lib/actions/service"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

function uploadImageToImgbb(file: File) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) {
    return Promise.reject(new Error("MISSING_IMGBB_API_KEY"))
  }

  const body = new FormData()
  body.append("image", file)

  return fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data?.data?.url) {
        throw new Error("IMGBB_UPLOAD_FAILED")
      }
      return data.data.url as string
    })
}

export default function AddServicePage() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    serviceName: "",
    category: "",
    description: "",
    price: "",
    location: "",
  })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((data) => ({ ...data, [field]: value }))
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.add({
        type: "error",
        title: "Invalid file",
        description: "Please choose an image file.",
      })
      return
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.add({
        type: "error",
        title: "Image too large",
        description: "Please choose an image smaller than 5MB.",
      })
      return
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const vendorEmail = session?.user?.email
    if (!vendorEmail) {
      toast.add({
        type: "error",
        title: "Not signed in",
        description: "Please sign in as a vendor first.",
      })
      return
    }

    if (!formData.category) {
      toast.add({
        type: "error",
        title: "Category required",
        description: "Please select a service category.",
      })
      return
    }

    const price = Number(formData.price)
    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        type: "error",
        title: "Invalid price",
        description: "Price must be a number greater than 0.",
      })
      return
    }

    if (!image) {
      toast.add({
        type: "error",
        title: "Service image required",
        description: "Please upload an image for your service.",
      })
      return
    }


    setIsSubmitting(true)

    let imageUrl: string
    try {
      imageUrl = await toast.promise(uploadImageToImgbb(image), {
        loading: "Uploading service image…",
        success: "Service image uploaded",
        error: "Image upload failed",
      })
    } catch {
      setIsSubmitting(false)
      return
    }

    try {
      await createService({
        serviceName: formData.serviceName.trim(),
        category: formData.category,
        description: formData.description.trim(),
        price,
        location: formData.location.trim(),
        images: [imageUrl],
        vendorEmail,
      })

      toast.add({
        type: "success",
        title: "Service added",
        description: "Your service is pending admin approval.",
      })
      router.push("/dashboard/vendor/services")
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not add service",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Add Service</h1>
        <p className="text-muted-foreground">
          Create a new service to offer to customers.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service details</CardTitle>
          <CardDescription>
            New services are reviewed by an admin before customers can see them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="serviceName">Service name</Label>
              <InputGroup className="bg-card">
                <InputGroupInput
                  id="serviceName"
                  type="text"
                  placeholder="e.g. Royal Garden Wedding Venue"
                  className="text-foreground"
                  value={formData.serviceName}
                  onChange={(event) =>
                    updateField("serviceName", event.target.value)
                  }
                  required
                />
              </InputGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Service category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(event) => updateField("category", event.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              >
                <option value="" disabled>
                  Select a category
                </option>
                {SERVICE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                placeholder="Describe what you offer, what is included, and anything customers should know."
                value={formData.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                className="min-h-28 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (৳)</Label>
                <InputGroup className="bg-card">
                  <InputGroupInput
                    id="price"
                    type="number"
                    min="1"
                    step="any"
                    placeholder="e.g. 50000"
                    className="text-foreground"
                    value={formData.price}
                    onChange={(event) => updateField("price", event.target.value)}
                    required
                  />
                </InputGroup>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <InputGroup className="bg-card">
                  <InputGroupInput
                    id="location"
                    type="text"
                    placeholder="e.g. Dhaka"
                    className="text-foreground"
                    value={formData.location}
                    onChange={(event) =>
                      updateField("location", event.target.value)
                    }
                    required
                  />
                </InputGroup>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Service image</Label>
              <div className="flex items-center gap-3">
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="size-20 rounded-lg border border-border object-cover"
                  />
                ) : (
                  <span className="flex size-20 items-center justify-center rounded-lg border border-border text-muted-foreground">
                    <ImageIcon className="size-6" aria-hidden="true" />
                  </span>
                )}
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose file
                  </Button>
                  {image && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {image && (
                <p className="truncate text-xs text-muted-foreground">
                  {image.name}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Add Service"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}