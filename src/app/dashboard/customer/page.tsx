import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const sections = [
  {
    title: "My bookings",
    description: "Upcoming and past service bookings will appear here.",
  },
  {
    title: "Saved vendors",
    description: "Vendors you have shortlisted for your event.",
  },
  {
    title: "Profile",
    description: "Your account details and preferences.",
  },
]

export default function CustomerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Customer Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your bookings, saved vendors, and wedding plans.
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
