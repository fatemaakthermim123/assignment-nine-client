"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"

import { EyeIcon, EyeOffIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: implement login functionality here.
    // TODO: on failed login (wrong credentials), show a toast:
    // toast.add({ type: "error", title: "Login failed", description: "..." })
    console.log("Login form data:", formData)
    toast.add({
      type: "success",
      title: "Welcome back!",
      description: "You have signed in successfully.",
    })
  }

  function handleGoogleLogin() {
    // TODO: implement login with Google here.
    console.log("Login with Google")
    toast.add({
      type: "info",
      title: "Google sign-in",
      description: "Google sign-in is not implemented yet.",
    })
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-sm gap-4">
      <Card className="w-full max-w-sm">
        <CardHeader>          <CardTitle className="font-heading">Welcome back</CardTitle>
          <CardDescription>Login to your account to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <InputGroup className="bg-card">
                <InputGroupInput
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="text-foreground"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((data) => ({
                      ...data,
                      email: event.target.value,
                    }))
                  }
                  required
                />
              </InputGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <InputGroup className="bg-card">
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Your password"
                  className="text-foreground"
                  value={formData.password}
                  onChange={(event) =>
                    setFormData((data) => ({
                      ...data,
                      password: event.target.value,
                    }))
                  }
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    variant="ghost"
                    size="icon-xs"
                    className="bg-card text-foreground hover:bg-card hover:text-primary"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((visible) => !visible)}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>

            <div className="relative my-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-2 text-xs text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="size-4" />
              Login with Google
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-primary hover:text-primary-hover"
        >
          Sign up
        </Link>
      </p>
      </div>
    </div>
  )
}
