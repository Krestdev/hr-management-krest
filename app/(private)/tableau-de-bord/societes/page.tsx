"use client"

import StatisticCard from "@/components/statistic-card"
import { Button } from "@/components/ui/button"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserGroupIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Building2, MoreVertical, PlusSquare, Search } from "lucide-react"
import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import LoadingComponent from "@/components/loading-comp"
import ErrorComponent from "@/components/error-comp"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { CompanyDialog } from "./company-dialog"
import { Company } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCompaniesQuery, useDeleteCompanyMutation } from "@/hooks/queries-hooks"

const Page = () => {
    const router = useRouter()
    const companies = useCompaniesQuery()
    const deleteMutation = useDeleteCompanyMutation()

    const [search, setSearch] = useState("")

    // Modal states
    const [companyDialogOpen, setCompanyDialogOpen] = useState(false)
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [companyToDelete, setCompanyToDelete] = useState<string | null>(null)

    const companyTable = companies.data || []

    const filteredTable = useMemo(() => {
        if (!search) return companyTable
        return companyTable.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    }, [companyTable, search])

    const totalEmployees = useMemo(() => {
        return companyTable.reduce((acc, company) => acc + (company.employees?.length || 0), 0)
    }, [companyTable])

    const resetFilters = () => setSearch("")

    const onSelectCompany = (id: string) => {
        // Implémentez ici la redirection
        console.log("View detail", id)
    }

    const onAddCompany = () => {
        setSelectedCompany(null)
        setCompanyDialogOpen(true)
    }

    const onEditDialogOpenCompany = (company: Company) => {
        setSelectedCompany(company)
        setCompanyDialogOpen(true)
    }

    const onDeleteDialogCompany = (id: string) => {
        setCompanyToDelete(id)
        setDeleteDialogOpen(true)
    }

    const handleDeleteConfirm = async () => {
        if (companyToDelete) {
            try {
                await deleteMutation.mutateAsync(companyToDelete)
            } catch (error) {
                console.error("Erreur lors de la suppression:", error)
            }
        }
        setDeleteDialogOpen(false)
        setCompanyToDelete(null)
    }

    if (companies.isLoading) return <LoadingComponent />
    if (companies.isError) return <ErrorComponent description={companies.error.message} />

    return (
        <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-4">
                <StatisticCard
                    title="Sociétés"
                    value={companyTable.length}
                    advanced={{ title: "Employés", value: totalEmployees }}
                    isIcon={false}
                    iconBg="bg-[#0CB2F9]"
                >
                    <Building2 className="text-white w-4 h-4" />
                </StatisticCard>
            </div>

            <div className="flex items-center justify-between mt-4">
                {/* Recherche */}
                <div className="relative">
                    <Search className="absolute top-3 left-2 text-[#9A9A9A] size-4" />
                    <Input
                        className="pl-8 max-w-[220px] w-full"
                        placeholder="Rechercher"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button variant={"primary"} onClick={onAddCompany}>
                    {"Créer une société"}
                    <PlusSquare className="ml-2 size-4" />
                </Button>
            </div>

            {/* Tableau des société */}
            <div className="card-1 mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{"Entreprise"}</TableHead>
                            <TableHead>{"Employés"}</TableHead>
                            <TableHead>{"Masse salariale"}</TableHead>
                            <TableHead>{"Statut"}</TableHead>
                            <TableHead>{"Action"}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTable.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="p-6">
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant={"icon"}>
                                                <HugeiconsIcon icon={UserGroupIcon} />
                                            </EmptyMedia>
                                            <EmptyTitle>Aucune entreprise trouvée</EmptyTitle>
                                            <EmptyDescription>
                                                {companyTable.length === 0
                                                    ? "Aucune entreprise enregistrée."
                                                    : "Aucune donnée correspondant à votre recherche."}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                        <EmptyContent>
                                            {companyTable.length !== 0 && (
                                                <Button variant={"outline"} onClick={resetFilters}>
                                                    Réinitialiser les filtres
                                                </Button>
                                            )}
                                        </EmptyContent>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTable.map((table, index) => {
                                const masseSalariale = table.contracts?.reduce((acc, curr) => acc + (Number(curr.baseSalary) || 0), 0) || 0;
                                return (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{table.name}</TableCell>
                                        <TableCell>{table.employees?.length || 0}</TableCell>
                                        <TableCell>{masseSalariale.toLocaleString()} {table.contracts?.[0]?.currency || "FCFA"}</TableCell>
                                        <TableCell><Badge variant={table.isActive ? "success" : "destructive"}>{table.isActive ? "Actif" : "Inactif"}</Badge></TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant={"link"}>
                                                        <MoreVertical />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => onSelectCompany(table.uuid)}>
                                                        Voir les détails
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onEditDialogOpenCompany(table)}>
                                                        Modifier
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => onDeleteDialogCompany(table.uuid)}>
                                                        Supprimer
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            <CompanyDialog
                open={companyDialogOpen}
                onOpenChange={setCompanyDialogOpen}
                company={selectedCompany}
            />

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Supprimer la société"
                description="Êtes-vous sûr de vouloir supprimer cette société ? Cette action est irréversible."
                onConfirm={handleDeleteConfirm}
                variant="destructive"
                isLoading={deleteMutation.isPending}
            />
        </div>
    )
}

export default Page