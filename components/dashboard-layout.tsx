'use client'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import NavigationBreadcrumb from "./breadcrumb-main"
import { Button } from "./ui/button"
import useKizunaStore from "@/context/store"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useCompaniesQuery } from "@/hooks/queries-hooks"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, selectedCompanyId, setSelectedCompanyId } = useKizunaStore();
  const router = useRouter();

  const { data: companies, isLoading: isLoadingCompanies } = useCompaniesQuery();

  // Ensure companies is always an array
  const companiesArray = Array.isArray(companies) ? companies : [];

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-[#f5f5f5] flex-1 @container/main">
        <div className="h-15 w-full px-4 bg-white flex justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger>Menu</SidebarTrigger>
            <NavigationBreadcrumb />
          </div>
          <div className="flex items-center gap-2">
            {/* Choisir la société */}
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={isLoadingCompanies ? "Chargement..." : "Tous"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {companiesArray.map((company) => (
                  <SelectItem key={company.uuid} value={company.uuid}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}