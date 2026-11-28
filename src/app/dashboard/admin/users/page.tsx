import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ManageUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Manage Users</h1>
        <p className="text-muted-foreground">
          View and manage users on the platform.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>Registered users will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
