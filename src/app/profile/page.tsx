"use client"

import { useRouter } from "next/navigation"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { authClient } from "@/lib/auth-client"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16 text-muted-foreground">
        Loading profile…
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
        <h1 className="font-heading text-2xl font-bold">Sign in to view your profile</h1>
        <p className="text-muted-foreground">
          Your profile is available once you are signed in.
        </p>
        <Button nativeButton={false} render={<a href="/sign-in" />}>
          Go to sign in
        </Button>
      </div>
    )
  }

  const { user } = session

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
      <Card className="w-full max-w-lg">
        <CardHeader className="items-center text-center">
          <Avatar size="lg" className="size-16">
            {user.image && <AvatarImage src={user.image} alt={user.name ?? "User"} />}
            <AvatarFallback className="text-xl">
              {(user.name ?? "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="font-heading text-2xl">
            {user.name ?? "WedPlan member"}
          </CardTitle>
          <CardDescription>Your WedPlan account details</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <dl className="grid gap-3 text-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="truncate font-medium">{user.email}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
              <dt className="text-muted-foreground">Account role</dt>
              <dd className="font-medium capitalize">{user.role ?? "customer"}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">Member since</dt>
              <dd className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
          <Button variant="outline" className="w-full" onClick={handleSignOut}>
            Sign out
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
