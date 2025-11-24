"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { BASE_ROUTES } from "@/data/config"
import { HugeiconsIcon } from "@hugeicons/react"
import Logo from "./logo"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { MoreVerticalIcon } from "@hugeicons/core-free-icons"
import useKizunaStore from "@/context/store"
import { getInitials } from "@/lib/utils"

export function AppSidebar() {
  const path = usePathname();
  const { user, logout } = useKizunaStore();
  const navigation = user?.role === "USER" ? BASE_ROUTES.filter((r)=>r.isAdmin !== true) : BASE_ROUTES
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-15 justify-center">
        <Logo className="px-2 w-full overflow-hidden"/>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map(({href, title, icon}) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild tooltip={title} isActive={path === href}>
                    <Link href={href}>
                      <HugeiconsIcon icon={icon} strokeWidth={2}/>
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {
          user &&
          <div className="w-full px-2 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.photo} />
              <AvatarFallback>{getInitials(user.firstName.concat(" ",user.lastName))}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm leading-[100%]">{user.firstName}</p>
              <span className="text-xs leading-[100%] text-gray-600">{user.email}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <HugeiconsIcon icon={MoreVerticalIcon}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={()=>logout()} variant="destructive" className="cursor-pointer">{"Se déconnecter"}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        }
      </SidebarFooter>
    </Sidebar>
  )
}