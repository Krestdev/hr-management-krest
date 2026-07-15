"use client"

import useKizunaStore from "@/context/store"
import StatisticCard from "@/components/statistic-card"
import { useDeleteEmployeeMutation, useEmployeesQuery, useReactivateEmployeeMutation } from "@/queries/employee"
import { useCompaniesQuery } from "@/queries/company"
import { useDepartmentsQuery } from "@/queries/department"
import { usePositionsQuery } from "@/queries/positions"
import { UserSquare2, Search, PlusSquare, MoreVertical, Loader2, ChevronLeft, ChevronRight, Filter } from "lucide-react"
import React, { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserGroupIcon } from "@hugeicons/core-free-icons"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import ViewUserDialog from "@/components/Utilisateurs/ViewUser"
import EditUserDialog from "@/components/Utilisateurs/EditUser"
import { Employee, roleColors, roleLabels } from "@/types/types"
import ChangePassword from "@/components/Utilisateurs/ChangePassword"

const Page = () => {
    const [search, setSearch] = useState("")
    const [querySearch, setQuerySearch] = useState("")
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    const router = useRouter()

    // États pour la modale de visualisation et d'édition
    const [openViewUser, setOpenViewUser] = useState(false)
    const [openEditUser, setOpenEditUser] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [selectedUser, setSelectedUser] = useState<Employee | null>(null)

    // États pour le Drawer de filtres (brouillons)
    const [departmentId, setDepartmentId] = useState<string>("")
    const [positionUuid, setPositionUuid] = useState<string>("")
    const [status, setStatus] = useState<string>("ACTIVE")
    const [includeInactive, setIncludeInactive] = useState<boolean>(false)
    const [includeSensitive, setIncludeSensitive] = useState<boolean>(false)

    // États appliqués pour la requête
    const [appliedDepartmentId, setAppliedDepartmentId] = useState<string>("")
    const [appliedPositionUuid, setAppliedPositionUuid] = useState<string>("")
    const [appliedStatus, setAppliedStatus] = useState<string>("ACTIVE")
    const [appliedIncludeInactive, setAppliedIncludeInactive] = useState<boolean>(false)
    const [appliedIncludeSensitive, setAppliedIncludeSensitive] = useState<boolean>(false)

    const [isSheetOpen, setIsSheetOpen] = useState(false)

    const { selectedCompanyId } = useKizunaStore()
    const activeCompanyId = selectedCompanyId === "all" ? "" : selectedCompanyId;

    // Requêtes
    const { data: employeesRes, isLoading: isLoadingEmployees } = useEmployeesQuery(
        page,
        limit,
        activeCompanyId,
        appliedDepartmentId,
        appliedPositionUuid,
        appliedStatus,
        querySearch,
        appliedIncludeInactive,
        appliedIncludeSensitive
    )
    const { data: companies, isLoading: isLoadingCompanies } = useCompaniesQuery()

    const activateEmployee = useReactivateEmployeeMutation()
    const deactivateEmployee = useDeleteEmployeeMutation()

    const handleToggleActive = (user: Employee) => {
        if (user.isActive) {
            deactivateEmployee.mutate(user.uuid)
        } else {
            activateEmployee.mutate(user.uuid)
        }
    }

    // Requêtes pour alimenter les Selects du Drawer de filtres
    const { data: departments } = useDepartmentsQuery(activeCompanyId, !!activeCompanyId)
    const { data: positions } = usePositionsQuery(activeCompanyId, !!activeCompanyId)

    const userTable = employeesRes?.data || []
    const meta = employeesRes?.meta
    const totalPages = meta?.totalPages || 1

    // Mapping UUID de société -> Nom de la société
    const companiesMap = useMemo(() => {
        if (!companies) return {}
        return companies.reduce((acc, c) => {
            acc[c.uuid] = c.name
            return acc
        }, {} as Record<string, string>)
    }, [companies])

    // Filtre local par recherche textuelle (en complément du back-end si besoin, ou on peut se fier uniquement au back-end)
    const filteredTable = useMemo(() => {
        if (!querySearch) return userTable
        return userTable.filter(u =>
            u.firstName?.toLowerCase().includes(querySearch.toLowerCase()) ||
            u.lastName?.toLowerCase().includes(querySearch.toLowerCase()) ||
            u.email?.toLowerCase().includes(querySearch.toLowerCase())
        )
    }, [userTable, querySearch])

    const totalActiveAccounts = userTable.filter(u => u.isActive).length
    const totalCompanies = companies?.length || 0

    // Compte du nombre de filtres actifs pour le bouton "Filtres (X)"
    const activeFiltersCount = [appliedDepartmentId, appliedPositionUuid, appliedStatus !== "ACTIVE", appliedIncludeInactive, appliedIncludeSensitive].filter(Boolean).length

    const handleOpenSheet = (open: boolean) => {
        setIsSheetOpen(open)
        if (open) {
            setDepartmentId(appliedDepartmentId)
            setPositionUuid(appliedPositionUuid)
            setStatus(appliedStatus)
            setIncludeInactive(appliedIncludeInactive)
            setIncludeSensitive(appliedIncludeSensitive)
        }
    }

    const applyFilters = () => {
        setAppliedDepartmentId(departmentId)
        setAppliedPositionUuid(positionUuid)
        setAppliedStatus(status)
        setAppliedIncludeInactive(includeInactive)
        setAppliedIncludeSensitive(includeSensitive)
        setPage(1)
        setIsSheetOpen(false)
    }

    const resetFilters = () => {
        setSearch("")
        setQuerySearch("")
        setDepartmentId("")
        setPositionUuid("")
        setStatus("ACTIVE")
        setIncludeInactive(false)
        setIncludeSensitive(false)

        setAppliedDepartmentId("")
        setAppliedPositionUuid("")
        setAppliedStatus("ACTIVE")
        setAppliedIncludeInactive(false)
        setAppliedIncludeSensitive(false)
        setPage(1)
    }

    return (
        <div className="flex flex-col gap-2.5">
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-4 gap-4">
                <StatisticCard
                    title="Utilisateurs"
                    value={meta?.total || userTable.length}
                    advanced={{ title: "Comptes actifs", value: totalActiveAccounts }}
                    isIcon={false}
                    iconBg="bg-[#0CB2F9]"
                >
                    <UserSquare2 className="text-white w-4 h-4" />
                </StatisticCard>
                <StatisticCard
                    title="Employés"
                    value={meta?.totalAssigned ?? 0}
                    advanced={{ title: "Filiales", value: totalCompanies.toString().padStart(2, '0') }}
                    isIcon={false}
                    iconBg="bg-[#8B5CF6]"
                >
                    <UserSquare2 className="text-white w-4 h-4" />
                </StatisticCard>
            </div>


            <Button className="w-fit ml-auto" onClick={() => router.push("/tableau-de-bord/utilisateurs/creer")} variant={"primary"}>
                {"Créer un utilisateur"}
                <PlusSquare className="ml-2 size-4" />
            </Button>

            {/* Barre de recherche & Boutons */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute top-3 left-2 text-[#9A9A9A] size-4" />
                        <Input
                            className="pl-8 max-w-[220px] w-full"
                            placeholder="Rechercher"
                            value={search}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSearch(val);
                                if (val === "") {
                                    setQuerySearch("");
                                    setPage(1);
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    setQuerySearch(search);
                                    setPage(1);
                                }
                            }}
                        />
                    </div>
                    <Button variant="primary" onClick={() => { setQuerySearch(search); setPage(1); }}>
                        Rechercher
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    {/* DRAWER DE FILTRES */}
                    <Sheet open={isSheetOpen} onOpenChange={handleOpenSheet}>
                        <SheetTrigger asChild>
                            <Button variant={"outline"} className="bg-white w-fit ml-auto">
                                {"Filtres"} ({activeFiltersCount})
                                <ChevronRight className="size-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] p-4">
                            <SheetHeader>
                                <SheetTitle className="text-[18px]">{"Filtres"}</SheetTitle>
                                <SheetDescription>
                                    {"Configurer les filtres pour affiner les données"}
                                </SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-6 mt-6">
                                {/* Département */}
                                <div className="space-y-2">
                                    <Label>{"Département"}</Label>
                                    <Select value={departmentId} onValueChange={(val) => setDepartmentId(val === "all" ? "" : val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tous les départements" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{"Tous les départements"}</SelectItem>
                                            {departments?.map(d => (
                                                <SelectItem key={d.uuid} value={d.uuid}>{d.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Poste */}
                                <div className="space-y-2">
                                    <Label>{"Poste"}</Label>
                                    <Select value={positionUuid} onValueChange={(val) => setPositionUuid(val === "all" ? "" : val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Tous les postes" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">{"Tous les postes"}</SelectItem>
                                            {positions?.map(p => (
                                                <SelectItem key={p.uuid} value={p.uuid}>{p.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Statut */}
                                <div className="space-y-2">
                                    <Label>{"Statut"}</Label>
                                    <Select value={status} onValueChange={(val) => setStatus(val)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">{"Actif"}</SelectItem>
                                            <SelectItem value="INACTIVE">{"Inactif"}</SelectItem>
                                            <SelectItem value="SUSPENDED">{"Suspendu"}</SelectItem>
                                            <SelectItem value="ALL">{"Tous les statuts"}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Include Inactive */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <Label>{"Inclure les inactifs"}</Label>
                                        <span className="text-sm text-gray-500">{"Afficher également les utilisateurs désactivés"}</span>
                                    </div>
                                    <Switch checked={includeInactive} onCheckedChange={(val) => setIncludeInactive(val)} />
                                </div>

                                {/* Include Sensitive */}
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-1">
                                        <Label>{"Données sensibles"}</Label>
                                        <span className="text-sm text-gray-500">{"Inclure les informations confidentielles"}</span>
                                    </div>
                                    <Switch checked={includeSensitive} onCheckedChange={(val) => setIncludeSensitive(val)} />
                                </div>

                                <div className="mt-4 flex justify-end gap-2">
                                    <Button variant="outline" onClick={resetFilters}>
                                        {"Réinitialiser"}
                                    </Button>
                                    <Button variant="primary" onClick={applyFilters}>
                                        {"Appliquer"}
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>

            {/* Tableau principal */}
            <div className="card-1 mt-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <div className="flex items-center gap-3">
                                    <Checkbox />
                                    <span>{"Utilisateur"}</span>
                                </div>
                            </TableHead>
                            <TableHead>{"Rôle"}</TableHead>
                            <TableHead>{"Société"}</TableHead>
                            <TableHead>{"Statut"}</TableHead>
                            <TableHead>{"Dernière connexion"}</TableHead>
                            <TableHead>{"Actions"}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoadingEmployees || isLoadingCompanies ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : filteredTable.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="p-6">
                                    <Empty>
                                        <EmptyHeader>
                                            <EmptyMedia variant={"icon"}>
                                                <HugeiconsIcon icon={UserGroupIcon} />
                                            </EmptyMedia>
                                            <EmptyTitle>{"Aucun utilisateur trouvé"}</EmptyTitle>
                                            <EmptyDescription>
                                                {userTable.length === 0
                                                    ? "Aucun utilisateur enregistré."
                                                    : "Aucune donnée correspondant à vos critères de recherche ou de filtre."}
                                            </EmptyDescription>
                                        </EmptyHeader>
                                    </Empty>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTable.map((user, index) => {
                                const roleName = roleLabels[user.role] || user.role
                                const roleColor = roleColors[user.role] || "bg-gray-500 text-white"
                                const companyName = companiesMap[user.companyId] || "Aucune entreprise"

                                return (
                                    <TableRow key={user.uuid || index}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Checkbox />
                                                <Avatar className="w-10 h-10 border">
                                                    <AvatarImage src={user.photo || ""} />
                                                    <AvatarFallback className="bg-primary/10 text-primary uppercase">
                                                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                                                    <span className="text-sm text-gray-500">{user.email}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`font-normal ${roleColor}`} variant="outline">
                                                {roleName}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{companyName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                <span className="text-sm">{user.isActive ? "Actif" : "Inactif"}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {/* Si user.updatedAt est défini, afficher la date relative, sinon 'Maintenant' */}
                                            {user.updatedAt ? formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true, locale: fr }) : "Maintenant"}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedUser(user)
                                                        setOpenViewUser(true)
                                                    }}>{"Voir le profil"}</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => {
                                                        setSelectedUser(user)
                                                        setOpenEditUser(true)
                                                    }}>{"Modifier"}</DropdownMenuItem>
                                                    {/* <DropdownMenuItem onClick={() => {
                                                        setSelectedUser(user)
                                                        setOpenChangePassword(true)
                                                    }}>{"Changer le mot de passe"}</DropdownMenuItem> */}
                                                    <DropdownMenuItem
                                                        onClick={() => handleToggleActive(user)}
                                                        className="text-destructive"
                                                    >
                                                        {user.isActive ? "Suspendre" : "Réactiver"}
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

                {/* PAGINATION */}
                {meta && meta.totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t">
                        <div className="text-sm text-gray-500">
                            Affichage de {((meta.page - 1) * meta.limit) + 1} à {Math.min(meta.page * meta.limit, meta.total)} sur {meta.total} résultats
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Précédent
                            </Button>
                            <div className="text-sm font-medium">
                                Page {page} sur {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Suivant
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <ViewUserDialog
                isOpen={openViewUser}
                setIsOpen={setOpenViewUser}
                employee={selectedUser}
            />
            <EditUserDialog
                open={openEditUser}
                onOpenChange={setOpenEditUser}
                userId={selectedUser?.uuid || ""}
            />
            <ChangePassword
                open={openChangePassword}
                onOpenChange={setOpenChangePassword}
                userId={selectedUser?.uuid || ""}
            />
        </div>
    )
}

export default Page