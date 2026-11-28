import Link from "next/link"
import { House } from "lucide-react"

import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/app/components/dashboardsidebar"

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
       <SidebarInset className="min-h-0 min-w-0 overflow-hidden">
 <header className="h-16 shrink-0 flex items-center gap-2 border-b border-border px-4 bg-background">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
           
         
            <Separator orientation="vertical" className="mx-1 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
        </header>
       <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
      {children}
    </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
