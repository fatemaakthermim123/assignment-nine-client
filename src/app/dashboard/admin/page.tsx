import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    title: "Users",
    description: "Customers and vendors registered on the platform.",
  },
  {
    title: "Vendors",
    description: "Vendor accounts and their listed services.",
  },
  {
    title: "Overview",
    description: "Platform activity and key metrics.",
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, vendors, and the platform overview.
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
