import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function VendorSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Update your business and account details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your profile information here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Content coming soon.
        </CardContent>
      </Card>
    </div>
  )
}
