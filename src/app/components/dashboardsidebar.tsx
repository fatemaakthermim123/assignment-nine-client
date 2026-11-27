"use client"

import { LayoutDashboard } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

export function DashboardSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <LayoutDashboard className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-semibold">WedPlan</span>
            <span className="text-xs text-sidebar-foreground/70">Dashboard</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu items will be added here later. */}
      <SidebarContent />

      <SidebarFooter />

      <SidebarRail />
    </Sidebar>
  )
}
