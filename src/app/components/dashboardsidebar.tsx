"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import {
    CalendarCheck,
    CalendarHeart,
    ClipboardCheck,
    Crown,
    LayoutDashboard,
    Package,
    PlusCircle,
    Receipt,
    Settings,
    Users,
    type LucideIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Role = "customer" | "vendor" | "admin"

type MenuItem = {
    id: string
    name: string
    url: string
    icon: LucideIcon
}

const ROLES: Role[] = ["customer", "vendor", "admin"]

const menuItemsByRole: Record<Role, MenuItem[]> = {
    customer: [
        { id: "overview", name: "Overview", url: "/dashboard/customer", icon: LayoutDashboard },
        { id: "my-bookings", name: "My Bookings", url: "/dashboard/customer/bookings", icon: CalendarHeart },
        { id: "profile-settings", name: "Profile Settings", url: "/dashboard/customer/settings", icon: Settings },
    ],
    vendor: [
        { id: "overview", name: "Overview", url: "/dashboard/vendor", icon: LayoutDashboard },
        { id: "my-services", name: "My Services", url: "/dashboard/vendor/services", icon: Package },
        { id: "add-service", name: "Add Service", url: "/dashboard/vendor/addService", icon: PlusCircle },
        { id: "booking-requests", name: "Booking Requests", url: "/dashboard/vendor/bookings", icon: CalendarCheck },
        { id: "subscription", name: "Subscription", url: "/dashboard/vendor/subscription", icon: Crown },
        { id: "profile-settings", name: "Profile Settings", url: "/dashboard/vendor/settings", icon: Settings },
    ],
    admin: [
        { id: "overview", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
        { id: "manage-users", name: "Manage Users", url: "/dashboard/admin/users", icon: Users },
        { id: "manage-services", name: "Manage Services", url: "/dashboard/admin/services", icon: ClipboardCheck },
        { id: "transactions", name: "Transactions", url: "/dashboard/admin/transactions", icon: Receipt },
    ],
}

// Converts whatever the session gives us into a safe Role.
function getRole(value: unknown): Role {
    return typeof value === "string" && ROLES.includes(value as Role)
        ? (value as Role)
        : "customer"
}

export function DashboardSidebar() {
    const { data: session, isPending } = authClient.useSession()

    const user = session?.user
    const role = getRole((user as { role?: string } | undefined)?.role)

    return (
       <Sidebar className="top-20 !h-[calc(100svh-5rem)]">
            <SidebarHeader >
                {!isPending && user && (
                    <div className="flex min-w-0 items-center gap-2 px-2 py-1">
                        <Avatar size="lg">
                            {user.image && (
                                <AvatarImage src={user.image} alt={user.name ?? "User"} />
                            )}
                            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                                {(user.name ?? "U").charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium text-sidebar-foreground">
                                {user.name}
                            </span>
                            <span className="truncate text-xs text-sidebar-foreground/70">
                                {user.email}
                            </span>
                        </div>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                {!isPending && (
                    <SidebarGroup>
                        <SidebarMenu>
                            {menuItemsByRole[role].map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton render={<Link href={item.url} />}>
                                        <item.icon />
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <Link href="/" className="flex items-center gap-2 px-2 py-2">
                    <Image src="/logo.png" alt="WedPlan logo" width={32} height={32} />
                    <span className="font-heading text-lg text-sidebar-foreground">
                        WedPlan
                    </span>
                </Link>
            </SidebarFooter>
        </Sidebar>
    )
}