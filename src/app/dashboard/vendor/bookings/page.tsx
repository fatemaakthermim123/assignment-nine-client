import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function BookingRequestsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Booking Requests</h1>
        <p className="text-muted-foreground">
          Review and respond to incoming booking requests.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
          <CardDescription>New requests will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
