"use client";

import ErrorComponent from "@/components/error-comp";
import Header from "@/components/header";
import LoadingComponent from "@/components/loading-comp";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkSquare02Icon,
  CancelSquareIcon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import LeavesQuery from "@/queries/leaves";
import UserQuery from "@/queries/users";
import { Leaves, Employee } from "@/types/types";
import WarningModal from "@/components/WarningModal";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, EllipsisIcon, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

function getStatusBadge(status: string) {
  if (status === "APPROVED")
    return (
      <span className="text-blue-600 font-semibold flex items-center gap-2">
        <div className="size-2.5 rounded-full bg-blue-600" />
        {"Approuvé"}
      </span>
    );
  if (status === "IN PROGRESS")
    return (
      <span className="text-orange-500 font-semibold flex items-center gap-2">
        <div className="size-2.5 rounded-full bg-orange-500" />
        {"En cours"}
      </span>
    );
  if (status === "REJECTED")
    return (
      <span className="text-red-600 font-semibold flex items-center gap-2">
        <div className="size-2.5 rounded-full bg-red-600" />
        {"Rejeté"}
      </span>
    );
  if (status === "COMPLETED")
    return (
      <span className="text-green-600 font-semibold flex items-center gap-2">
        <div className="size-2.5 rounded-full bg-green-600" />
        {"Terminé"}
      </span>
    );
  return (
    <span className="text-purple-400 font-semibold flex items-center gap-2">
      <div className="size-2.5 rounded-full bg-purple-400" />
      {"En attente"}
    </span>
  );
}

// Options pour les types de congés
const typeOptions = [
  { value: "ANNUAL", label: "Annuel" },
  { value: "SICK", label: "Maladie" },
  { value: "ERRAND", label: "Course" },
  { value: "MATERNITY", label: "Maternité" },
  { value: "PATERNITY", label: "Paternité" },
  { value: "MARRIAGE", label: "Mariage" },
  { value: "BREAST-FEEDING", label: "Allaitement" },
  { value: "BEREAVEMENT", label: "Deuil" },
];

// Options pour les statuts
const statusOptions = [
  { value: "PENDING", label: "En attente" },
  { value: "APPROVED", label: "Approuvé" },
  { value: "REJECTED", label: "Rejeté" },
  { value: "COMPLETED", label: "Terminé" },
  { value: "IN PROGRESS", label: "En cours" },
];

function Page() {
  const leavesQuery = new LeavesQuery();
  const usersQuery = new UserQuery();

  // État pour les filtres
  const [employeeFilter, setEmployeeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("");

  // Deux périodes distinctes
  const [startPeriod, setStartPeriod] = useState<DateRange | undefined>();
  const [endPeriod, setEndPeriod] = useState<DateRange | undefined>();

  const {
    data: leavesData,
    isLoading: isLoadingLeaves,
    isError: isErrorLeaves,
    error: errorLeaves,
    isSuccess: isSuccessLeaves,
  } = useQuery({
    queryKey: ["leaves-history"],
    queryFn: leavesQuery.getAll,
  });

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    isSuccess: isSuccessUsers,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: usersQuery.getAll,
  });

  const [selectedLeave, setSelectedLeave] = useState<Leaves | null>(null);
  const [viewApprove, setViewApprove] = useState(false);
  const [viewReject, setViewReject] = useState(false);

  const tableData = useMemo(() => {
    if (!isSuccessLeaves || !isSuccessUsers) return [];

    return leavesData.items.map((leave: Leaves) => {
      const user = usersData.find((u: Employee) => u.id === leave.userId);

      return {
        ...leave,
        employeeName: user ? `${user.firstName} ${user.lastName}` : "Inconnu",
        employee: user || null,
      };
    });
  }, [isSuccessLeaves, isSuccessUsers, leavesData, usersData]);

  // Données filtrées
  const filteredData = useMemo(() => {
    return tableData.filter((leave) => {
      // Filtre par employé
      if (employeeFilter && employeeFilter !== "all") {
        if (leave.userId.toString() !== employeeFilter) return false;
      }

      // Filtre par statut
      if (statusFilter && statusFilter !== "all") {
        if (leave.status !== statusFilter) return false;
      }

      // Filtre par type
      if (typeFilter && typeFilter !== "all") {
        if (leave.type !== typeFilter) return false;
      }

      const leaveStartDate = new Date(leave.startDate);
      const leaveEndDate = new Date(leave.endDate);

      // Filtre par période de début (startPeriod)
      if (startPeriod?.from) {
        const periodStart = new Date(startPeriod.from);
        periodStart.setHours(0, 0, 0, 0);

        if (startPeriod.to) {
          const periodEnd = new Date(startPeriod.to);
          periodEnd.setHours(23, 59, 59, 999);

          // La date de début du congé doit être dans la période sélectionnée
          if (leaveStartDate < periodStart || leaveStartDate > periodEnd) {
            return false;
          }
        } else {
          // Si seule la date de début est sélectionnée
          if (leaveStartDate < periodStart) return false;
        }
      }

      // Filtre par période de fin (endPeriod)
      if (endPeriod?.from) {
        const periodStart = new Date(endPeriod.from);
        periodStart.setHours(0, 0, 0, 0);

        if (endPeriod.to) {
          const periodEnd = new Date(endPeriod.to);
          periodEnd.setHours(23, 59, 59, 999);

          // La date de fin du congé doit être dans la période sélectionnée
          if (leaveEndDate < periodStart || leaveEndDate > periodEnd) {
            return false;
          }
        } else {
          // Si seule la date de début est sélectionnée
          if (leaveEndDate < periodStart) return false;
        }
      }

      return true;
    });
  }, [
    tableData,
    employeeFilter,
    statusFilter,
    typeFilter,
    startPeriod,
    endPeriod,
  ]);

  // Fonction pour réinitialiser tous les filtres
  const resetFilters = () => {
    setEmployeeFilter("");
    setStatusFilter("");
    setTypeFilter("");
    setStartPeriod(undefined);
    setEndPeriod(undefined);
  };

  // Formatage de l'affichage des périodes
  const formatDateRange = (
    range: DateRange | undefined,
    defaultText: string,
  ) => {
    if (!range?.from) return defaultText;
    if (!range.to) return `À partir du ${format(range.from, "dd/MM/yyyy")}`;
    return `${format(range.from, "dd/MM/yyyy")} - ${format(range.to, "dd/MM/yyyy")}`;
  };

  if (isLoadingLeaves || isLoadingUsers) return <LoadingComponent />;
  if (isErrorLeaves)
    return <ErrorComponent description={errorLeaves.message} />;
  if (isErrorUsers) return <ErrorComponent description={errorUsers.message} />;
  if (!isSuccessLeaves || !isSuccessUsers) return null;

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Historique des congés" variant="primary" />

      {/* FILTRES EN LIGNE */}
      <div className="flex flex-wrap items-center gap-2 bg-muted/40 p-2 rounded-lg">
        {/* Filtre Employé */}
        <div className="min-w-[180px]">
          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger id="employee" className="bg-background">
              <SelectValue placeholder="Tous les employés" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les employés</SelectItem>
              {usersData?.map((user: Employee) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Statut */}
        <div className="min-w-[150px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status" className="bg-background">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Type */}
        <div className="min-w-[150px]">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type" className="bg-background">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              {typeOptions.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre Période de début */}
        <div className="min-w-[250px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-background border-blue-200 hover:border-blue-300"
              >
                <span className="truncate flex items-center gap-2">
                  <CalendarIcon />
                  Début: {formatDateRange(startPeriod, "Sélectionner")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={startPeriod?.from}
                selected={startPeriod}
                onSelect={setStartPeriod}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Filtre Période de fin */}
        <div className="min-w-[250px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-background border-green-200 hover:border-green-300"
              >
                <span className="truncate flex items-center gap-2">
                  <CalendarIcon />
                  Fin: {formatDateRange(endPeriod, "Sélectionner")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={endPeriod?.from}
                selected={endPeriod}
                onSelect={setEndPeriod}
                numberOfMonths={2}
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Bouton de réinitialisation */}
        {(employeeFilter ||
          statusFilter ||
          typeFilter ||
          startPeriod ||
          endPeriod) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetFilters}
            className="ml-auto"
            title="Réinitialiser les filtres"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Historique des demandes de congés"}</h3>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Nom"}</TableHead>
              <TableHead>{"Date début"}</TableHead>
              <TableHead>{"Date fin"}</TableHead>
              <TableHead>{"Statut"}</TableHead>
              <TableHead>{"Motif"}</TableHead>
              <TableHead>{"Actions"}</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>{leave.employeeName}</TableCell>

                  <TableCell>
                    {format(new Date(leave.startDate), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>

                  <TableCell>
                    {format(new Date(leave.endDate), "dd/MM/yyyy", {
                      locale: fr,
                    })}
                  </TableCell>

                  <TableCell>{getStatusBadge(leave.status)}</TableCell>

                  <TableCell>{leave.reason ?? "—"}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {/* ✅ TRAITER */}
                        <DropdownMenuItem
                          disabled={leave.status !== "PENDING"}
                          onClick={() => {
                            setSelectedLeave(leave);
                            setViewApprove(true);
                          }}
                          className="text-green-600"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkSquare02Icon}
                            className="text-green-600"
                          />
                          {"Approuver"}
                        </DropdownMenuItem>

                        {/* ❌ REJETER */}
                        <DropdownMenuItem
                          variant="destructive"
                          disabled={leave.status !== "PENDING"}
                          onClick={() => {
                            setSelectedLeave(leave);
                            setViewReject(true);
                          }}
                        >
                          <HugeiconsIcon icon={CancelSquareIcon} />
                          {"Rejeter"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucune demande de congé trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* MODALS */}
      <WarningModal
        open={viewApprove}
        onOpenChange={setViewApprove}
        title={"Approuver cette demande de congé ?"}
        action={() => {
          toast.success("Demande de congé approuvée !");
        }}
        variant="success"
        actionLabel="Approuver"
        cancelLabel="Annuler"
      />

      <WarningModal
        open={viewReject}
        onOpenChange={setViewReject}
        title={"Rejeter cette demande de congé ?"}
        action={() => {
          toast.success("Demande de congé rejetée !");
        }}
        variant="error"
        actionLabel="Rejeter"
        cancelLabel="Annuler"
      />
    </div>
  );
}

export default Page;
