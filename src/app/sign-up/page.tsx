"use client"

import { useRef, useState, type FormEvent } from "react"
import Link from "next/link"

import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  ImageIcon,
  StoreIcon,
  UserIcon,
  XIcon,
} from "lucide-react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

const PASSWORD_RULES = [
  { label: "At least 6 characters", test: (value: string) => value.length >= 6 },
  { label: "One uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "One lowercase letter", test: (value: string) => /[a-z]/.test(value) },
]

function uploadImageToImgbb(file: File) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
  if (!apiKey) {
    return Promise.reject(new Error("MISSING_IMGBB_API_KEY"))
  }

  const body = new FormData()
  body.append("image", file)

  return fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body,
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data?.data?.url) {
        throw new Error("IMGbb_UPLOAD_FAILED")
      }
      return data.data.url as string
    })
}

export default function RegisterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [role, setRole] = useState("customer")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const isPasswordValid = PASSWORD_RULES.every((rule) =>
    rule.test(formData.password),
  )

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setProfileImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setProfileImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isPasswordValid) {
      toast.add({
        type: "error",
        title: "Invalid password",
        description: "Please meet all the password requirements.",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.add({
        type: "error",
        title: "Passwords don't match",
        description: "Please make sure both passwords are the same.",
      })
      return
    }

    let profileImageUrl: string | null = null
    if (profileImage) {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY
      if (!apiKey) {
        toast.add({
          type: "warning",
          title: "Image upload disabled",
          description:
            "Add NEXT_PUBLIC_IMGBB_API_KEY to .env to enable profile image uploads.",
        })
      } else {
        try {
          profileImageUrl = await toast.promise(uploadImageToImgbb(profileImage), {
            loading: "Uploading profile image…",
            success: "Profile image uploaded",
            error: "Image upload failed",
          })
        } catch {
          return
        }
      }
    }

    const payload = {
      ...formData,
      role,
      profileImage: profileImageUrl,
    }

    // TODO: implement registration functionality here.
    // TODO: role-specific logic (vendor vs customer) will be handled later.
    console.log("Register form data:", payload)

    toast.add({
      type: "success",
      title: "Account created!",
      description: "Welcome aboard.",
    })
  }

  function handleGoogleRegister() {
    // TODO: implement registration with Google here.
    console.log("Register with Google")
    toast.add({
      type: "info",
      title: "Google sign-up",
      description: "Google registration is not implemented yet.",
    })
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <div className="grid w-full max-w-sm gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="font-heading">Create an account</CardTitle>
            <CardDescription>
              Sign up to get started with your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <InputGroup className="bg-card">
                  <InputGroupInput
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    className="text-foreground"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((data) => ({
                        ...data,
                        name: event.target.value,
                      }))
                    }
                    required
                  />
                </InputGroup>
              </div>
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
                    autoComplete="new-password"
                    placeholder="Create a password"
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
                <ul className="grid gap-1 text-xs">
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(formData.password)
                    return (
                      <li
                        key={rule.label}
                        className={`flex items-center gap-1.5 ${
                          met ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {met ? (
                          <CheckIcon className="size-3.5" aria-hidden="true" />
                        ) : (
                          <XIcon className="size-3.5" aria-hidden="true" />
                        )}
                        {rule.label}
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm password</Label>
                <InputGroup className="bg-card">
                  <InputGroupInput
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className="text-foreground"
                    value={formData.confirmPassword}
                    onChange={(event) =>
                      setFormData((data) => ({
                        ...data,
                        confirmPassword: event.target.value,
                      }))
                    }
                    required
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      variant="ghost"
                      size="icon-xs"
                      className="bg-card text-foreground hover:bg-card hover:text-primary"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      onClick={() =>
                        setShowConfirmPassword((visible) => !visible)
                      }
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </div>

              <div className="grid gap-2">
                <Label>Profile image (optional)</Label>
                <div className="flex items-center gap-3">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="size-12 rounded-full border border-border object-cover"
                    />
                  ) : (
                    <span className="flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground">
                      <ImageIcon className="size-5" aria-hidden="true" />
                    </span>
                  )}
                  <div className="flex flex-1 flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose file
                    </Button>
                    {profileImage && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                {profileImage && (
                  <p className="truncate text-xs text-muted-foreground">
                    {profileImage.name}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Account role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as string)}
                  className="grid grid-cols-2 gap-2"
                >
                  <Label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 ${
                      role === "customer"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="customer" />
                    <UserIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                    Customer
                  </Label>
                  <Label
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50 ${
                      role === "vendor"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    <RadioGroupItem value="vendor" />
                    <StoreIcon className="size-4 text-muted-foreground" aria-hidden="true" />
                    Vendor
                  </Label>
                </RadioGroup>
                {/* TODO: role-specific logic (vendor vs customer) will be handled later. */}
              </div>

              <Button type="submit" className="w-full">
                Register
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
                onClick={handleGoogleRegister}
              >
                <GoogleIcon className="size-4" />
                Register with Google
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:text-primary-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
