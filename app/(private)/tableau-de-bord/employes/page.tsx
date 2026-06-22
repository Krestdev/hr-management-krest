"use client";
import ErrorComponent from "@/components/error-comp";
import Header from "@/components/header";
import LoadingComponent from "@/components/loading-comp";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useKizunaStore from "@/context/store";
import { formatSalary, formatSeniority, getYearsOfService } from "@/lib/utils";
import UserQuery from "@/queries/employee";
import {
  AddSquareIcon,
  PlusSignSquareIcon,
  UserAccountIcon,
  UserBlock02Icon,
  UserEdit01Icon,
  UserGroupIcon,
  UserRemove01Icon,
  UserUnlock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EllipsisIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ViewProfile from "./view-profile";
import { Employee } from "@/types/types";
import EditProfile from "./edit-profile";
import Link from "next/link";
import WarningModal from "@/components/WarningModal";
import { toast } from "sonner";
import AddDipe from "./add-dipe";
import SalarialQuery from "@/queries/salarials";
import { useDebounce } from "@/hooks/useDebounce";

type LengthOfService = "under" | "over" | "equal";

function matchYearsFilter(
  startDate: Date | string,
  filterType: LengthOfService,
  filter: number,
): boolean {
  const years = Math.floor(getYearsOfService(startDate));
  if (filterType === "equal") return years === filter;
  if (filterType === "over") return years > filter;
  return years < filter;
}

function Page() {
  const { user } = useKizunaStore();
  const usersQuery = new UserQuery();
  const dipeQuery = new SalarialQuery();

  // États pour les filtres backend
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // Debounce pour la recherche (évite trop de requêtes)
  const debouncedSearch = useDebounce(searchTerm, 500);

  // États pour les filtres locaux (ancienneté)
  const [yearsFilter, setYearsFilter] = useState<LengthOfService>("over");
  const [years, setYears] = useState<number>(0);
  const inclueSensitive = true

  // Récupérer les employés avec les filtres backend
  const { data, isSuccess, isLoading, isError, error } = useQuery({
    queryKey: [
      "employees",
      page,
      limit,
      user?.companyId,
      departmentFilter,
      statusFilter,
      debouncedSearch,
      includeInactive,
    ],
    queryFn: () => usersQuery.getAll(
      page,
      limit,
      user?.companyId || "",
      departmentFilter !== "all" ? departmentFilter : "",
      "",
      statusFilter,
      debouncedSearch,
      includeInactive,
      inclueSensitive
    ),
    enabled: !!user?.companyId,
  });



  const diactivate = useMutation({
    mutationKey: ["diactivate-employee"],
    mutationFn: (uuid: string) => usersQuery.delete(uuid),
    onSuccess: () => {
      toast.success("Employe désactivé avec succès")
    },
    onError: (error) => {
      toast.error("Erreur lors de la désactivation de l'employe" + error.message)
    }
  })


  const resume = useMutation({
    mutationKey: ["resume-employee"],
    mutationFn: (uuid: string) => usersQuery.reactivate(uuid),
    onSuccess: () => {
      toast.success("Employe activé avec succès")
    },
    onError: (error) => {
      toast.error("Erreur lors de l'activation de l'employe" + error.message)
    }
  })

  // const {
  //   data: salarialData,
  //   isSuccess: isSuccessSalarial,
  //   isLoading: isLoadingSalarial,
  //   isError: isErrorSalarial,
  //   error: errorSalarial,
  // } = useQuery({
  //   queryKey: ["salarials"],
  //   queryFn: dipeQuery.getAll,
  // });

  const [departments, setDepartments] = useState<Array<string>>([]);
  const [selected, setSelected] = useState<Employee>();
  const [openProfile, setOpenProfile] = useState(false);
  const [viewEdit, setViewEdit] = useState(false);
  const [viewSuspend, setViewSuspend] = useState(false);
  const [viewResume, setViewResume] = useState(false);
  const [viewDelete, setViewDelete] = useState(false);
  const [openAddDipe, setOpenAddDipe] = useState(false);

  function viewSelected(e: Employee): void {
    setSelected(e);
    setOpenProfile(true);
  }
  function editSelected(e: Employee): void {
    setSelected(e);
    setViewEdit(true);
  }
  function suspendSelected(e: Employee): void {
    setSelected(e);
    setViewSuspend(true);
  }
  function resumeSelected(e: Employee): void {
    setSelected(e);
    setViewResume(true);
  }
  function deleteSelected(e: Employee): void {
    setSelected(e);
    setViewDelete(true);
  }

  function openDipe(e: Employee): void {
    setSelected(e);
    setOpenAddDipe(true);
  }

  useEffect(() => {
    if (isSuccess && data) {
      // Extraire le premier département de chaque tableau
      const uniqueDepartments = Array.from(
        new Set(
          data.data
            .map((user) => user.department?.[0]) // Prendre le premier élément du tableau
            .filter(Boolean)
        )
      );
      setDepartments(uniqueDepartments as string[]);
    }
  }, [isSuccess, data]);

  // Filtrage local pour l'ancienneté
  const filteredData = useMemo(() => {
    if (!isSuccess || !data) return [];

    return data.data
      .filter((employee) => {
        const matchYears = matchYearsFilter(
          employee.hireDate,
          yearsFilter,
          years,
        );
        return matchYears;
      })
      .sort((a, b) =>
        a.lastName.localeCompare(b.lastName, "fr", { sensitivity: "base" }),
      );
  }, [isSuccess, data, yearsFilter, years]);

  // Réinitialiser tous les filtres
  function resetFilters() {
    setSearchTerm("");
    setDepartmentFilter("all");
    setStatusFilter("ACTIVE");
    setIncludeInactive(false);
    setYearsFilter("over");
    setYears(0);
    setPage(1);
  }

  if (isLoading) {
    return <LoadingComponent />;
  }
  if (isError) {
    return <ErrorComponent description={error.message} />;
  }
  // if (isErrorSalarial) {
  //   return <ErrorComponent description={errorSalarial.message} />;
  // }
  if (!isSuccess) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Gestion des Employés" variant={"primary"} />
      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Liste des employés"}</h3>
          <div className="filters">
            {/* Recherche par nom - Backend */}
            <div className="filter-group">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Rechercher par nom"
                className="min-w-60"
              />
            </div>

            {/* Filtre département - Backend */}
            <div className="filter-group">
              <Label htmlFor="department">{"Département"}</Label>
              <Select
                name="department"
                value={departmentFilter}
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{"Tous"}</SelectItem>
                  {departments.map((item, id) => (
                    <SelectItem key={id} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filtre statut - Backend */}
            <div className="filter-group">
              <Label htmlFor="status">{"Statut"}</Label>
              <Select
                name="status"
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">{"Actif"}</SelectItem>
                  <SelectItem value="SUSPENDED">{"Suspendu"}</SelectItem>
                  <SelectItem value="INACTIVE">{"Inactif"}</SelectItem>
                  <SelectItem value="ALL">{"Tous"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtre ancienneté - Local */}
            <div className="filter-group">
              <Label htmlFor="years">{"Ancienneté"}</Label>
              <Select
                name="years"
                value={yearsFilter}
                onValueChange={(val) => setYearsFilter(val as LengthOfService)}
              >
                <SelectTrigger className="min-w-32">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="over">{"Plus de"}</SelectItem>
                  <SelectItem value="under">{"Moins de"}</SelectItem>
                  <SelectItem value="equal">{"Egal à"}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                placeholder="ex 1"
                className="w-20"
              />
            </div>

            {/* Bouton Ajouter */}
            <Link href={"/tableau-de-bord/employes/ajouter"}>
              <Button variant={"accent"}>
                {"Ajouter un employé"}
                <HugeiconsIcon icon={PlusSignSquareIcon} strokeWidth={2} />
              </Button>
            </Link>
          </div>

          {/* Boutons d'actions supplémentaires */}
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              {"Réinitialiser les filtres"}
            </Button>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="includeInactive"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
              />
              <Label htmlFor="includeInactive" className="text-sm">
                {`Inclure les inactifs (${data.data.filter((emp) => emp.isActive === false).length})`}
              </Label>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Noms"}</TableHead>
              <TableHead>{"Poste"}</TableHead>
              <TableHead>{"Département"}</TableHead>
              <TableHead>{"Statut"}</TableHead>
              <TableHead>{"Ancienneté"}</TableHead>
              <TableHead>{"Salaire de base"}</TableHead>
              <TableHead>{"Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-6">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>
                        <HugeiconsIcon icon={UserGroupIcon} />
                      </EmptyMedia>
                      <EmptyTitle>{"Aucun employé trouvé"}</EmptyTitle>
                      <EmptyDescription>
                        {data.data.length === 0
                          ? "Aucun employé enregistré. Commencez par ajouter un employé pour l'afficher dans cette liste."
                          : "Aucun employé correspondant à votre recherche."}
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      {data.data.length !== 0 && (
                        <Button variant={"outline"} onClick={resetFilters}>
                          {"Réinitialiser les filtres"}
                        </Button>
                      )}
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((employee) => (
                <TableRow key={employee.uuid}>
                  <TableCell>
                    {employee.firstName} {employee.lastName}
                  </TableCell>
                  <TableCell>{employee.position ?? "--"}</TableCell>
                  <TableCell>
                    {Array.isArray(employee.department)
                      ? employee.department[0] ?? "--"
                      : employee.department ?? "--"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${employee.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}>
                      {employee.isActive ? "Actif" : "Inactif"}
                    </span>
                  </TableCell>
                  <TableCell>{formatSeniority(employee.hireDate)}</TableCell>
                  <TableCell>{formatSalary(employee?.contracts![0].baseSalary!)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"ghost"}>
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => viewSelected(employee)}
                        >
                          <HugeiconsIcon icon={UserAccountIcon} />
                          {"Voir le profil"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => editSelected(employee)}
                        >
                          <HugeiconsIcon icon={UserEdit01Icon} />
                          {"Modifier le profil"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDipe(employee)}>
                          <HugeiconsIcon icon={AddSquareIcon} />
                          {"Ajouter le DIPE"}
                        </DropdownMenuItem>
                        {employee.isActive ?
                          <DropdownMenuItem
                            onClick={() => suspendSelected(employee)}
                          >
                            <HugeiconsIcon icon={UserBlock02Icon} />
                            {"Suspendre"}
                          </DropdownMenuItem>
                          : <DropdownMenuItem
                            onClick={() => resumeSelected(employee)}
                          >
                            <HugeiconsIcon icon={UserUnlock01Icon} />
                            {"Activer"}
                          </DropdownMenuItem>
                        }
                        {user?.role === "SUPER_ADMIN" && (
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => deleteSelected(employee)}
                          >
                            <HugeiconsIcon icon={UserRemove01Icon} />
                            {"Supprimer"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination - Backend */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground">
              {data.meta.total} employés au total
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Précédent
              </Button>
              <div className="flex items-center gap-1">
                <span className="text-sm">
                  Page {page} sur {data.meta.totalPages}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                disabled={page === data.meta.totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <>
          <ViewProfile
            isOpen={openProfile}
            openChange={setOpenProfile}
            employee={selected}
            users={data.data}
          />
          <EditProfile
            isOpen={viewEdit}
            openChange={setViewEdit}
            employee={selected}
            users={data.data}
          />
          {/* <AddDipe
            isOpen={openAddDipe}
            openChange={setOpenAddDipe}
            salarial={salarialData.items}
            employee={selected}
          /> */}
        </>
      )}
      <WarningModal
        open={viewSuspend}
        onOpenChange={setViewSuspend}
        title={"Etes-vous sur de vouloir suspendre cet employé?"}
        action={() => diactivate.mutate(selected!.uuid)}
        variant="warning"
        actionLabel="Suspendre"
        cancelLabel="Annuler"
      />
      <WarningModal
        open={viewResume}
        onOpenChange={setViewResume}
        title={"Etes-vous sur de vouloir activer cet employé?"}
        action={() => resume.mutate(selected!.uuid)}
        variant="warning"
        actionLabel="Activer"
        cancelLabel="Annuler"
      />
      <WarningModal
        open={viewDelete}
        onOpenChange={setViewDelete}
        title={"Etes-vous sur de vouloir Supprimer cet employé?"}
        action={() => {
          toast.success("L'employé a bien été supprimé !");
        }}
        variant="error"
        actionLabel="Supprimer"
        cancelLabel="Annuler"
      />
    </div>
  );
}

export default Page;