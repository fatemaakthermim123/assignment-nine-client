"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { authClient } from "@/lib/auth-client"

function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    console.log("Session:", session)
  }, [session])

  const user = session?.user

  async function handleSignOut() {
    setPopoverOpen(false)
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex w-full items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Left: logo */}
        <div data-slot="navbar-start" className="flex shrink-0 items-center gap-1">
          <Link href="/" className="flex items-center transition-opacity hover:opacity-80">
            <img
              src="/logo.png"
              alt="Elegant WedPlan logo"
              className="h-15 w-auto"
            />
          </Link>
          <h1 className="font-extrabold text-2xl">WedPlan</h1>
        </div>

        {/* Middle: navigation links */}
        <nav
          data-slot="navbar-links"
          className="flex items-center gap-1 rounded-full bg-muted/60 p-1 text-sm font-medium sm:gap-2"
        >
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 transition-colors hover:text-primary-hover ${
              pathname === "/"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/services"
            aria-current={pathname === "/services" ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 transition-colors hover:text-primary-hover ${
              pathname === "/services"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            Browse Services
          </Link>
        </nav>

        {/* Right: auth actions or user menu */}
        <nav
          data-slot="navbar-actions"
          className="flex shrink-0 items-center gap-2"
        >
          {user ? (
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger className="flex items-center gap-2 rounded-full border border-border bg-background py-1 pr-3 pl-1 transition-colors hover:border-primary hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring outline-none">
                <Avatar size="default">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                  )}
                  <AvatarFallback>
                    {(user.name ?? "U").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-28 truncate text-sm font-medium">
                  {user.name ?? user.email}
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" sideOffset={8} className="w-56 p-1.5">
                <div className="border-b border-border px-2.5 py-2">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted"
                  onClick={() => {
                    setPopoverOpen(false)
                    router.push("/profile")
                  }}
                >
                  My profile
                </button>
                <button
                  type="button"
                  className="flex w-full items-center rounded-md px-2.5 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              </PopoverContent>
            </Popover>
          ) : !isPending ? (
            <>
              <Button
                className="w-40"
                nativeButton={false}
                render={<Link href="/sign-up" />}
              >
                Sign Up
              </Button>
              <Button
                className="w-40"
                variant="outline"
                nativeButton={false}
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>
            </>
          ) : null}
        </nav>
      </div>
    </header>
  )
}

export { Navbar }
