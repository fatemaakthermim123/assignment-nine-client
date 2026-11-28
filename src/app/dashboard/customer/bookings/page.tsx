import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function MyBookingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage the services you have booked.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
          <CardDescription>Your bookings will show up here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
