"use client"

import * as React from "react"
import {
  AudioWaveform,
  Badge,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Gauge,
  Map,
  PieChart,
  ReceiptText,
  Settings2,
  Sparkle,
  SquareTerminal,
  Users,
} from "lucide-react"

import { NavMain } from "~/components/nav-main"
import { NavUser } from "~/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import { useLocation } from "react-router"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  // This is sample data.
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Đơn hàng",
        url: "/dashboard",
        icon: ReceiptText,
        isActive: location.pathname === "/dashboard",
      },
      {
        title: "Danh mục",
        url: "/dashboard/categories",
        icon: GalleryVerticalEnd,
        isActive: location.pathname === "/dashboard/categories",
      },
      {
        title: "Thương hiệu",
        url: "/dashboard/brands",
        icon: Badge,
        isActive: location.pathname === "/dashboard/brands",
      },
      {
        title: "Sản phẩm",
        url: "/dashboard/products",
        icon: Sparkle,
        isActive: location.pathname === "/dashboard/products",
      },
      {
        title: "Khách hàng",
        url: "/dashboard/customers",
        icon: Users,
        isActive: location.pathname === "/dashboard/customers",
      },
    ]
  }
  return (
    <Sidebar collapsible="icon" {...props} >
      <SidebarHeader className="border-b border-sidebar-border/30 px-2 py-6">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-sidebar-accent/50 transition-colors duration-200">
              <a href="#" className="flex flex-col items-start">
                <div className="flex flex-col gap-1 leading-none">
                  <span className="text-xl font-bold text-sidebar-foreground">EW. Dashboard</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
