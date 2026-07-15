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
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
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
import { useEmployeesQuery, useDeleteEmployeeMutation, useReactivateEmployeeMutation } from "@/queries/employee";
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
import { EllipsisIcon, Search, Filter, ChevronRight, Loader2, UserSquare2, Users, Banknote, Briefcase, FileText } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import ViewProfile from "./view-profile";
import { Department, Employee } from "@/types/types";
import EditProfile from "./edit-profile";
import Link from "next/link";
import WarningModal from "@/components/WarningModal";
import { toast } from "sonner";
import AddDipe from "./add-dipe";
import { useSalarialsQuery } from "@/queries/salarials";
import { useDebounce } from "@/hooks/useDebounce";
import { useDepartmentsQuery } from "@/queries/department";
import StatisticCard from "@/components/statistic-card";

type LengthOfService = "under" | "over" | "equal" | "none";

function matchYearsFilter(
  startDate: Date | string | undefined | null,
  filterType: LengthOfService,
  filter: number,
): boolean {
  if (filterType === "none") return true;
  const years = Math.floor(getYearsOfService(startDate));
  if (filterType === "equal") return years === filter;
  if (filterType === "over") return years > filter;
  return years < filter;
}

function Page() {
  const { user, isHydrated } = useKizunaStore();
  // États pour les filtres backend
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [querySearchTerm, setQuerySearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
  const [includeInactive, setIncludeInactive] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // États appliqués
  const [appliedDepartmentFilter, setAppliedDepartmentFilter] = useState<string>("all");
  const [appliedStatusFilter, setAppliedStatusFilter] = useState<string>("ACTIVE");
  const [appliedIncludeInactive, setAppliedIncludeInactive] = useState<boolean>(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // États pour les filtres locaux (ancienneté)
  const [yearsFilter, setYearsFilter] = useState<LengthOfService>("none");
  const [years, setYears] = useState<number>(0);

  const [appliedYearsFilter, setAppliedYearsFilter] = useState<LengthOfService>("none");
  const [appliedYears, setAppliedYears] = useState<number>(0);
  const inclueSensitive = true

  // Récupérer les employés avec les filtres backend
  const { data, isSuccess, isLoading, isPending, isError, error } = useEmployeesQuery(
    page,
    limit,
    user?.companyId || "",
    appliedDepartmentFilter !== "all" ? appliedDepartmentFilter : "",
    "",
    appliedStatusFilter,
    querySearchTerm,
    appliedIncludeInactive,
    inclueSensitive,
    isHydrated && !!user
  );

  const diactivate = useDeleteEmployeeMutation();
  const resume = useReactivateEmployeeMutation();
  const departmentData = useDepartmentsQuery(user?.companyId!, true);

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

  const [departments, setDepartments] = useState<Array<Department>>([]);
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
    if (departmentData.isSuccess && departmentData.data) {
      setDepartments(departmentData.data);
    }
  }, [departmentData.isSuccess, departmentData.data]);


  // Filtrage local pour l'ancienneté
  const filteredData = useMemo(() => {
    if (!isSuccess || !data) return [];

    return data.data
      .filter((employee) => {
        if (!employee.companyId) return false;

        const matchYears = matchYearsFilter(
          employee.hireDate,
          appliedYearsFilter,
          appliedYears,
        );

        if (!matchYears) return false;

        if (querySearchTerm) {
          const searchLower = querySearchTerm.toLowerCase();
          const matchesSearch =
            employee.firstName?.toLowerCase().includes(searchLower) ||
            employee.lastName?.toLowerCase().includes(searchLower) ||
            employee.email?.toLowerCase().includes(searchLower);

          if (!matchesSearch) return false;
        }

        return true;
      })
      .sort((a, b) =>
        (a.lastName || "").localeCompare(b.lastName || "", "fr", { sensitivity: "base" }),
      );
  }, [isSuccess, data, yearsFilter, years]);

  // Réinitialiser tous les filtres
  function resetFilters() {
    setSearchTerm("");
    setQuerySearchTerm("");
    setDepartmentFilter("all");
    setStatusFilter("ACTIVE");
    setIncludeInactive(false);
    setYearsFilter("none");
    setYears(0);
    setPage(1);

    setAppliedDepartmentFilter("all");
    setAppliedStatusFilter("ACTIVE");
    setAppliedIncludeInactive(false);
    setAppliedYearsFilter("none");
    setAppliedYears(0);
  }

  const handleOpenSheet = (open: boolean) => {
    setIsSheetOpen(open);
    if (open) {
      setDepartmentFilter(appliedDepartmentFilter);
      setStatusFilter(appliedStatusFilter);
      setIncludeInactive(appliedIncludeInactive);
      setYearsFilter(appliedYearsFilter);
      setYears(appliedYears);
    }
  };

  const applyFilters = () => {
    setAppliedDepartmentFilter(departmentFilter);
    setAppliedStatusFilter(statusFilter);
    setAppliedIncludeInactive(includeInactive);
    setAppliedYearsFilter(yearsFilter);
    setAppliedYears(years);
    setPage(1);
    setIsSheetOpen(false);
  };

  const activeFiltersCount = [
    appliedDepartmentFilter !== "all",
    appliedStatusFilter !== "ACTIVE",
    appliedYearsFilter !== "none",
    appliedIncludeInactive
  ].filter(Boolean).length;

  const validEmployees = useMemo(() => {
    return (data?.data || []).filter((emp) => !!emp.companyId);
  }, [data?.data]);

  const totalMasseSalariale = useMemo(() => {
    return validEmployees.reduce((acc, emp) => acc + (emp.contracts?.[0]?.baseSalary || 0), 0);
  }, [validEmployees]);

  const moyenneSalariale = useMemo(() => {
    return validEmployees.length > 0 ? totalMasseSalariale / validEmployees.length : 0;
  }, [validEmployees, totalMasseSalariale]);

  const countCDI = useMemo(() => {
    return validEmployees.filter((emp) => emp.contracts?.[0]?.contract_type === "CDI").length;
  }, [validEmployees]);

  const countCDD = useMemo(() => {
    return validEmployees.filter((emp) => emp.contracts?.[0]?.contract_type === "CDD").length;
  }, [validEmployees]);

  if (isError) {
    return <ErrorComponent description={error.message} />;
  }
  // if (isErrorSalarial) {
  //   return <ErrorComponent description={errorSalarial.message} />;
  // }


  return (
    <div className="grid gap-1.5 sm:gap-2.5">
      {/* <Header title="Gestion des Employés" variant={"primary"} /> */}
      {/* Bouton Ajouter */}
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        <StatisticCard
          title="Employés"
          value={validEmployees.length}
          advanced={{ title: "Départements", value: departmentData.data?.length || 0 }}
          isIcon={false}
          iconBg="bg-[#630CF9]"
        >
          <Users className="text-white w-4 h-4" />
        </StatisticCard>
        <StatisticCard
          title="Masse salariale"
          value={formatSalary(totalMasseSalariale)}
          advanced={{ title: "Moyenne", value: formatSalary(moyenneSalariale) }}
          isIcon={false}
          iconBg="bg-[#64BD16]"
        >
          <Banknote className="w-4 h-4 text-white" />
        </StatisticCard>
        <StatisticCard
          title="CDI"
          value={countCDI}
          advanced={{ title: "CDD", value: countCDD }}
          isIcon={false}
          iconBg="bg-[#B416BD]"
        >
          <FileText className="w-4 h-4 text-white" />
        </StatisticCard>
      </div>
      <Link className="ml-auto" href={"/tableau-de-bord/employes/ajouter"}>
        <Button variant={"primary"}>
          {"Enregistrer un employé"}
          <HugeiconsIcon icon={PlusSignSquareIcon} strokeWidth={2} />
        </Button>
      </Link>

      {/* Barre de recherche & Boutons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-3 left-2 text-[#9A9A9A] size-4" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                const val = e.target.value;
                setSearchTerm(val);
                if (val === "") {
                  setQuerySearchTerm("");
                  setPage(1);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setQuerySearchTerm(searchTerm);
                  setPage(1);
                }
              }}
              type="search"
              placeholder="Rechercher par nom"
              className="pl-8 max-w-[280px] w-full bg-white"
            />
          </div>
          <Button variant="primary" onClick={() => { setQuerySearchTerm(searchTerm); setPage(1); }}>
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
                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tous" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"Tous les départements"}</SelectItem>
                      {departments.map((item, id) => (
                        <SelectItem key={id} value={item.uuid}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <Label>{"Statut"}</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">{"Actif"}</SelectItem>
                      <SelectItem value="SUSPENDED">{"Suspendu"}</SelectItem>
                      <SelectItem value="INACTIVE">{"Inactif"}</SelectItem>
                      <SelectItem value="ALL">{"Tous les statuts"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ancienneté */}
                <div className="space-y-2">
                  <Label>{"Ancienneté"}</Label>
                  <div className="flex gap-2">
                    <Select
                      value={yearsFilter}
                      onValueChange={(val) => setYearsFilter(val as LengthOfService)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">{"Aucun filtre"}</SelectItem>
                        <SelectItem value="over">{"Plus de"}</SelectItem>
                        <SelectItem value="under">{"Moins de"}</SelectItem>
                        <SelectItem value="equal">{"Egal à"}</SelectItem>
                      </SelectContent>
                    </Select>
                    {yearsFilter !== "none" && (
                      <Input
                        type="number"
                        value={years}
                        onChange={(e) => setYears(Number(e.target.value))}
                        placeholder="ex: 1"
                        className="w-24"
                      />
                    )}
                  </div>
                </div>

                {/* Include Inactive */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label>{"Inclure les inactifs"}</Label>
                    <span className="text-sm text-gray-500">{"Afficher également les employés désactivés"}</span>
                  </div>
                  <Switch checked={includeInactive} onCheckedChange={(val) => setIncludeInactive(val)} />
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

      <div className="card-1">
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
            {isPending || isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
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
                  <TableCell>{formatSalary(employee.contracts?.[0]?.baseSalary ?? 0)}</TableCell>
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
        {data?.meta && data.meta.totalPages > 1 && (
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
            users={data?.data}
          />
          <EditProfile
            isOpen={viewEdit}
            openChange={setViewEdit}
            employee={selected}
            users={data?.data}
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
        action={() => diactivate.mutate(selected!.uuid, {
          onSuccess: () => {
            toast.success("Employe désactivé avec succès");
          },
          onError: (error) => {
            toast.error("Erreur lors de la désactivation de l'employe: " + error.message);
          }
        })}
        variant="warning"
        actionLabel="Suspendre"
        cancelLabel="Annuler"
      />
      <WarningModal
        open={viewResume}
        onOpenChange={setViewResume}
        title={"Etes-vous sur de vouloir activer cet employé?"}
        action={() => resume.mutate(selected!.uuid, {
          onSuccess: () => {
            toast.success("Employe activé avec succès");
          },
          onError: (error) => {
            toast.error("Erreur lors de l'activation de l'employe: " + error.message);
          }
        })}
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