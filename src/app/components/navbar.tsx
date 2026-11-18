"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="mx-auto flex w-full  items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        {/* Left: logo */}
        <div data-slot="navbar-start" className="flex shrink-0 items-center gap-1">
          <Link href="/" className="flex items-center">
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
          className="flex items-center gap-6 text-sm font-medium"
        >
          <Link
            href="/"
            className="text-foreground hover:text-primary-hover"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="text-muted-foreground hover:text-primary-hover"
          >
            Browse Services
          </Link>
        </nav>

        {/* Right: auth actions */}
        <nav
          data-slot="navbar-actions"
          className="flex shrink-0 items-center gap-2"
        >
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
        </nav>
      </div>
    </header>
  )
}

export { Navbar }
