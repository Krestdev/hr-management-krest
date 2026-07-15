"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  HOLDING_ROUTES,
  COMPAGNIE_ROUTES,
  MON_PROFIL_ROUTES,
} from "@/data/config";
import { HugeiconsIcon } from "@hugeicons/react";
import Logo from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreVerticalIcon } from "@hugeicons/core-free-icons";
import useKizunaStore from "@/context/store";
import { getInitials } from "@/lib/utils";
import { useEmployeeQuery } from "@/queries/employee";
import { Button } from "./ui/button";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "./ui/badge";

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const { user, logout } = useKizunaStore();

  // Get user by id user.employeeId
  const userData = useEmployeeQuery(user?.employeeId!, true)

  const userRole = userData?.data?.role || "EMPLOYEE";

  const getVisibleRoutes = () => {
    const visibleRoutes = [];
    if (userRole === "COMPANY_ADMIN" || userRole === "SUPER_ADMIN") {
      visibleRoutes.push(
        { label: "Holding", routes: HOLDING_ROUTES },
        { label: "Compagnie", routes: COMPAGNIE_ROUTES },
        { label: "Mon Profil", routes: MON_PROFIL_ROUTES }
      );
    }
    else if (userRole === "ADMIN") {
      visibleRoutes.push(
        { label: "Compagnie", routes: COMPAGNIE_ROUTES },
        { label: "Mon Profil", routes: MON_PROFIL_ROUTES }
      );
    }
    else if (userRole === "EMPLOYEE") {
      visibleRoutes.push(
        { label: "Mon Profil", routes: MON_PROFIL_ROUTES }
      );
    }
    else {
      visibleRoutes.push(
        { label: "Mon Profil", routes: MON_PROFIL_ROUTES }
      );
    }

    return visibleRoutes;
  };

  const visibleSections = getVisibleRoutes();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-15 justify-center">
        <Logo className="px-2 w-full overflow-hidden" />
      </SidebarHeader>
      <div className="flex items-center gap-1.5 p-2 rounded-[6px]">
        <div className="flex items-center flex-1 gap-2">
          <img className="max-w-8 w-full h-auto aspect-square rounded-[6px] object-cover" src={userData?.data?.photo ? userData.data.photo : "/avatar.png"} alt="profile" />
          <div className="flex flex-col">
            <p className="text-[14px] font-medium">{`${userData?.data?.firstName} ${userData?.data?.lastName}`}</p>
            <span className="text-xs text-muted-foreground">{userData?.data?.user.email}</span>
          </div>
        </div>
        <Button variant='ghost'>
          <EllipsisVertical />
        </Button>
      </div>
      <SidebarContent>
        {visibleSections.map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel className={`text-xs first-letter:uppercase tracking-wider font-medium ${section.label === "Holding" ? "text-[#1A8DA8]" : section.label === "Compagnie" ? "text-[#CE2337]" : "text-[#828282]"}`}>
              {section.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {section.routes.map(({ href, title, icon, badge }) => (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      tooltip={title}
                      isActive={path === href}
                      className="h-[32px] text-[14px] flex items-center"
                    >
                      <Link href={href} className="flex-1 flex items-center gap-2">
                        <HugeiconsIcon icon={icon} strokeWidth={2} className="h4 w-4" />
                        <span>{title}</span>
                      </Link>
                      {badge && badge > 0 && <Badge className="max-w-6 w-full h-auto aspect-square" variant="orange">{badge}</Badge>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
              <div className="w-full px-2 py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar>
                    <AvatarImage src={user.photo} />
                    <AvatarFallback>
                      {user.firstName && user.lastName ?
                        getInitials(user.firstName.concat(" ", user.lastName))
                        :
                        getInitials("Krest Dev")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="group-data-[collapsible=icon]:hidden">
                    <p className="text-sm leading-[100%] truncate w-fit">
                      {user.firstName}
                    </p>
                    <span className="text-xs leading-[100%] text-gray-600 truncate block">
                      {user.email}
                    </span>
                  </div>
                </div>
                <HugeiconsIcon icon={MoreVerticalIcon} />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                variant="destructive"
                className="cursor-pointer"
              >
                {"Se déconnecter"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}