"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { MapPin, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"
import { DeleteServiceDialog } from "@/app/components/delete-dialog"

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

  // null মানে ডাটা এখনও আসেনি (লোডিং)
  const [services, setServices] = useState<Service[] | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(EMPTY_FORM)
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const list = services ?? []
  const loading = services === null && (isPending || Boolean(email))

  // ডাটা আনা: setState শুধু কলব্যাকের ভেতরে হচ্ছে
  useEffect(() => {
    if (!email) return

    let ignore = false
    getServices(email)
      .then((data) => {
        if (!ignore) setServices(data)
      })
      .catch((error) => {
        if (ignore) return
        toast.add({
          type: "error",
          title: "Could not load services",
          description: errorMessage(error),
        })
        setServices((current) => current ?? [])
      })

    return () => {
      ignore = true
    }
  }, [email, reloadKey])

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
      setReloadKey((key) => key + 1)
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

  async function handleDelete(service: Service) {
    setBusyId(service._id)
    try {
      await deleteService(service._id)
      toast.add({ type: "success", title: "Service deleted" })
      setDeleteTarget(null)
      setReloadKey((key) => key + 1)
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
            <div key={n} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      )}

      {!loading && list.length === 0 && (
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
        list.map((service) => {
          const busy = busyId === service._id
          const editing = editingId === service._id

          return (
            <Card key={service._id} className="gap-0 overflow-hidden py-0">
              <div className="flex flex-col sm:flex-row">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={service.images?.[0]}
                  alt={service.serviceName}
                  className="h-44 w-full object-cover sm:h-auto sm:w-56"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
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
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" aria-hidden="true" />
                        {service.location}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        variant={editing ? "secondary" : "outline"}
                        size="icon"
                        aria-label="Edit service"
                        title="Edit"
                        disabled={busy}
                        onClick={() =>
                          editing ? setEditingId(null) : startEdit(service)
                        }
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete service"
                        title="Delete"
                        disabled={busy}
                        onClick={() => setDeleteTarget(service)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {service.category}
                    </span>
                    <p className="text-lg font-semibold text-primary">
                      ৳{service.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {editing && (
                <form
                  onSubmit={(event) => handleUpdate(event, service._id)}
                  className="grid gap-3 border-t border-border bg-muted/30 p-4"
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
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={busy}>
                      {busy ? "Saving…" : "Save changes"}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          )
        })}

      <DeleteServiceDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        serviceName={deleteTarget?.serviceName ?? ""}
        loading={busyId !== null && busyId === deleteTarget?._id}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget)
        }}
      />
    </div>
  )
}