import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const dashboards = [
  {
    title: "Customer Dashboard",
    description: "Bookings, saved vendors, and your wedding plans.",
    href: "/dashboard/customer",
  },
  {
    title: "Vendor Dashboard",
    description: "Your services, inquiries, and bookings.",
    href: "/dashboard/vendor",
  },
  {
    title: "Admin Dashboard",
    description: "Users, vendors, and platform overview.",
    href: "/dashboard/admin",
  },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Choose a dashboard to get started.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((dashboard) => (
          <Card key={dashboard.href}>
            <CardHeader>
              <CardTitle>{dashboard.title}</CardTitle>
              <CardDescription>{dashboard.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={dashboard.href} />}
              >
                Open dashboard
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
