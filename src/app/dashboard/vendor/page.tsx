import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    title: "My services",
    description: "Services and packages you offer to customers.",
  },
  {
    title: "Inquiries",
    description: "Messages and requests from interested customers.",
  },
  {
    title: "Bookings",
    description: "Confirmed and pending bookings for your services.",
  },
]

export default function VendorDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your services, inquiries, and bookings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Content coming soon.
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
