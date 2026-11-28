"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

import { authClient } from "@/lib/auth-client"
import {
  SERVICE_CATEGORIES,
  getServices,
  type Service,
} from "@/lib/api/service"
import { deleteService, updateService } from "@/lib/actions/service"

const STATUS_STYLES: Record<Service["status"], string> = {
  pending: "bg-accent/30 text-foreground",
  approved: "bg-primary/15 text-primary",
  rejected: "bg-destructive/10 text-destructive",
}

const EMPTY_FORM = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  location: "",
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong."
}

export default function MyServicesPage() {
  const { data: session, isPending } = authClient.useSession()
  const email = session?.user?.email

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  async function loadServices(vendorEmail: string) {
    try {
      setServices(await getServices(vendorEmail))
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not load services",
        description: errorMessage(error),
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!email) {
      if (!isPending) {
        void Promise.resolve().then(() => setLoading(false))
      }
      return
    }

    void Promise.resolve().then(() => loadServices(email))
  }, [email, isPending])

  function startEdit(service: Service) {
    setEditingId(service._id)
    setEditForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      location: service.location,
    })
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault()

    const price = Number(editForm.price)
    if (!Number.isFinite(price) || price <= 0) {
      toast.add({
        type: "error",
        title: "Invalid price",
        description: "Price must be a number greater than 0.",
      })
      return
    }

    setBusyId(id)
    try {
      await updateService(id, {
        serviceName: editForm.serviceName.trim(),
        category: editForm.category,
        description: editForm.description.trim(),
        price,
        location: editForm.location.trim(),
      })
      toast.add({ type: "success", title: "Service updated" })
      setEditingId(null)
      if (email) await loadServices(email)
    } catch (error) {
      toast.add({
        type: "error",
        title: "Update failed",
        description: errorMessage(error),
      })
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id)
    try {
      await deleteService(id)
      toast.add({ type: "success", title: "Service deleted" })
      setConfirmDeleteId(null)
      if (email) await loadServices(email)
    } catch (error) {
      toast.add({
        type: "error",
        title: "Delete failed",
        description: errorMessage(error),
      })
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My Services</h1>
          <p className="text-muted-foreground">
            Manage the services you offer to customers.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/dashboard/vendor/addService" />}>
          Add Service
        </Button>
      </div>

      {loading && (
        <div className="grid gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!loading && services.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t added any services yet.
            </p>
            <Button nativeButton={false} render={<Link href="/dashboard/vendor/addService" />}>
              Add your first service
            </Button>
          </CardContent>
        </Card>
      )}

      {!loading &&
        services.map((service) => {
          const busy = busyId === service._id
          const editing = editingId === service._id

          return (
            <Card key={service._id}>
              <CardContent className="grid gap-4 py-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={service.images?.[0]}
                    alt={service.serviceName}
                    className="h-32 w-full rounded-lg border border-border object-cover sm:w-44"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-lg font-semibold">
                        {service.serviceName}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[service.status]}`}
                      >
                        {service.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {service.category} · {service.location}
                    </p>
                    <p className="font-medium text-primary">
                      ৳{service.price.toLocaleString()}
                    </p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {service.description}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={() =>
                          editing ? setEditingId(null) : startEdit(service)
                        }
                      >
                        {editing ? "Cancel edit" : "Edit"}
                      </Button>

                      {confirmDeleteId === service._id ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            disabled={busy}
                            onClick={() => handleDelete(service._id)}
                          >
                            {busy ? "Deleting…" : "Confirm delete"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setConfirmDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          disabled={busy}
                          onClick={() => setConfirmDeleteId(service._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {editing && (
                  <form
                    onSubmit={(event) => handleUpdate(event, service._id)}
                    className="grid gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor={`name-${service._id}`}>Service name</Label>
                      <InputGroup className="bg-card">
                        <InputGroupInput
                          id={`name-${service._id}`}
                          value={editForm.serviceName}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, serviceName: e.target.value }))
                          }
                          required
                        />
                      </InputGroup>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`cat-${service._id}`}>Category</Label>
                      <select
                        id={`cat-${service._id}`}
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, category: e.target.value }))
                        }
                        className="h-9 w-full rounded-lg border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      >
                        {SERVICE_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor={`desc-${service._id}`}>Description</Label>
                      <textarea
                        id={`desc-${service._id}`}
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, description: e.target.value }))
                        }
                        className="min-h-24 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        required
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor={`price-${service._id}`}>Price (৳)</Label>
                        <InputGroup className="bg-card">
                          <InputGroupInput
                            id={`price-${service._id}`}
                            type="number"
                            min="1"
                            step="any"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, price: e.target.value }))
                            }
                            required
                          />
                        </InputGroup>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor={`loc-${service._id}`}>Location</Label>
                        <InputGroup className="bg-card">
                          <InputGroupInput
                            id={`loc-${service._id}`}
                            value={editForm.location}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, location: e.target.value }))
                            }
                            required
                          />
                        </InputGroup>
                      </div>
                    </div>
                    <Button type="submit" disabled={busy}>
                      {busy ? "Saving…" : "Save changes"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )
        })}
    </div>
  )
}
