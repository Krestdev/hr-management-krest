'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import NavigationBreadcrumb from "./breadcrumb-main"
import { Button } from "./ui/button"
import useKizunaStore from "@/context/store"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useKizunaStore();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-[#f5f5f5] flex-1 @container/main">
        <div className="h-15 w-full px-4 bg-white flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <NavigationBreadcrumb/>
          </div>
          <Button onClick={()=>logout()}>{"Déconnexion"}</Button>
        </div>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}