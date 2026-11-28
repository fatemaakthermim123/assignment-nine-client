import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ManageServicesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Manage Services</h1>
        <p className="text-muted-foreground">
          Review and manage all listed services.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Services</CardTitle>
          <CardDescription>All services will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
