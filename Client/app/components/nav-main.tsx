"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { NavLink } from "react-router"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon,
    isActive?: boolean,
    isCollapsibleActive?: boolean,
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  return (
    <SidebarGroup className="px-2 py-2">
      <SidebarMenu className="space-y-2">
        {items.map((item, index) => {
          // If item has subitems, use Collapsible
          if (item.items && item.items.length > 0) {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isCollapsibleActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton 
                      tooltip={item.title}
                      className={`hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 h-11 px-3 ${
                        item.isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                      }`}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1">
                    <SidebarMenuSub className="ml-4 space-y-1">
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <NavLink 
                              to={subItem.url}
                              className={({isActive}) => 
                                `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 h-9 px-3 flex items-center ${
                                  isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : ''
                                }`
                              }
                            >
                              <span>{subItem.title}</span>
                            </NavLink>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          // If item doesn't have subitems, use simple SidebarMenuItem with both manual and URL-based active state
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink 
                  to={item.url}
                  className={
                    `hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 h-11 px-3 flex items-center ${
                      item.isActive? 'bg-sidebar-primary text-sidebar-primary-foreground' : ''
                    }`
                  }
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
