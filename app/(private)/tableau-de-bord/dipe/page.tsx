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
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SalarialQuery from "@/queries/salarials";
import UserQuery from "@/queries/users";
import { useQuery } from "@tanstack/react-query";
import { EllipsisIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";
import React, { useMemo } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AddSquareIcon,
  UserAccountIcon,
  UserEdit01Icon,
  UserGroupIcon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddDipe from "../employes/add-dipe";
import { Employee } from "@/types/types";
import ShowDipe from "./showDipe";

type Montant = {
  montant: number;
  type: "INDEMNITE" | "PRIME" | "AVANTAGE";
  est_taxable: boolean;
  est_cotisable: boolean;
};

type Salarial = {
  id: number;
  userId: number;
  salaire_base: Montant;
  indem_transport: Montant;
  indem_representation: Montant;
  prime_outil: Montant;
  prime_responsable: Montant;
  prime_gestion: Montant;
  logement: Montant;
  nourriture: Montant;
  vehicule: Montant;
  domestique: Montant;
  electricite: Montant;
  eau: Montant;
  carburant: Montant;
  telephone: Montant;
  gardiennage: Montant;
  internet: Montant;
};

type User = {
  id: number;
  firstName: string;
  lastName: string;
  position?: string;
  department?: string;
  startDate?: string;
};

type SalarialWithUser = Salarial & {
  user?: User;
};

function Page() {
  const usersQuery = new UserQuery();
  const salarialsQuery = new SalarialQuery();

  const {
    data: users,
    isSuccess: isUsersSuccess,
    isLoading: isUsersLoading,
    isError: isUsersError,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: usersQuery.getAll,
  });

  const {
    data: salarials,
    isSuccess: isSalarialsSuccess,
    isLoading: isSalarialsLoading,
    isError: isSalarialsError,
    error: salarialsError,
  } = useQuery({
    queryKey: ["salarials"],
    queryFn: salarialsQuery.getAll,
  });

  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState<string>("all");
  const [openAddDipe, setOpenAddDipe] = React.useState(false);
  const [selected, setSelected] = React.useState<Employee | null>(null);
  const [openShowDipe, setOpenShowDipe] = React.useState(false);
  const [selectedSalarial, setSelectedSalarial] =
    React.useState<Salarial | null>(null);

  // Combine salarials with user data
  const salarialsWithUsers: SalarialWithUser[] = useMemo(() => {
    if (!isSalarialsSuccess || !salarials || !isUsersSuccess || !users)
      return [];

    return salarials.items.map((salarial: Salarial) => {
      const user = users.find((u) => u.id === salarial.userId);
      return {
        ...salarial,
        user: user
          ? {
              ...user,
              startDate:
                user.startDate instanceof Date
                  ? user.startDate.toISOString()
                  : user.startDate,
            }
          : undefined,
      };
    });
  }, [salarials, users, isSalarialsSuccess, isUsersSuccess]);

  // Filter salarials based on search and filter type
  const filteredSalarials = useMemo(() => {
    if (!salarialsWithUsers.length) return [];

    return salarialsWithUsers.filter((salarial) => {
      // Filter by search (employee name)
      const fullName = salarial.user
        ? `${salarial.user.firstName} ${salarial.user.lastName}`.toLowerCase()
        : "";
      const matchesSearch =
        search === "" || fullName.includes(search.toLowerCase());

      // Filter by type (you can implement additional filters based on filterType)
      const matchesFilter = filterType === "all" || true; // Add your filter logic here

      return matchesSearch && matchesFilter;
    });
  }, [salarialsWithUsers, search, filterType]);

  const formatMontant = (montant: Montant) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(montant.montant);
  };

  const resetFilters = () => {
    setSearch("");
    setFilterType("all");
  };

  const viewSelected = (salarial: SalarialWithUser) => {
    setSelectedSalarial(salarial);
    setSelected(users?.find((u) => u.id === salarial.userId) || null);
    setOpenShowDipe(true);
  };

  const editSelected = (salarial: SalarialWithUser) => {
    // Implement edit logic
    console.log("Edit", salarial);
  };

  const openDipe = (salarial: SalarialWithUser) => {
    // Implement DIPE logic
    setSelected(users?.find((u) => u.id === salarial.userId) || null);
    setOpenAddDipe(true);
  };

  // const deleteSelected = (salarial: SalarialWithUser) => {
  //   // Implement delete logic
  //   console.log("Delete", salarial);
  // };

  if (isUsersLoading || isSalarialsLoading) {
    return <LoadingComponent />;
  }

  if (isUsersError) {
    return <ErrorComponent description={usersError.message} />;
  }

  if (isSalarialsError) {
    return <ErrorComponent description={salarialsError.message} />;
  }

  if (!isUsersSuccess || !isSalarialsSuccess) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Configuration DIPE" variant={"primary"} />
      <div className="flex items-center gap-4 ml-auto">
        <input
          type="text"
          placeholder="Rechercher un employé..."
          className="px-3 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select name="filtre" value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="Indem. & Primes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{"Tous"}</SelectItem>
            <SelectItem value="with_primes">{"Avec primes"}</SelectItem>
            <SelectItem value="with_indemnites">{"Avec indemnités"}</SelectItem>
          </SelectContent>
        </Select>
        <Link href={"/tableau-de-bord/dipe/historique"}>
          <Button variant={"accent"}>
            <HistoryIcon />
            {"Historique DIPE"}
          </Button>
        </Link>
      </div>

      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Tableau des DIPE"}</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Employés"}</TableHead>
              <TableHead>{"Salaire de base"}</TableHead>
              <TableHead>{"Pr. outillage"}</TableHead>
              <TableHead>{"Pr. responsabilité"}</TableHead>
              <TableHead>{"Pr. gestion"}</TableHead>
              <TableHead>{"Indem. transport"}</TableHead>
              <TableHead>{"Indem. représentation"}</TableHead>
              <TableHead>{"Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSalarials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="p-6">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>
                        <HugeiconsIcon icon={UserGroupIcon} />
                      </EmptyMedia>
                      <EmptyTitle>
                        {"Aucune donnée salariale trouvée"}
                      </EmptyTitle>
                      <EmptyDescription>
                        {salarialsWithUsers.length === 0
                          ? "Aucune configuration salariale enregistrée."
                          : "Aucune configuration correspondant à votre recherche."}
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      {salarialsWithUsers.length !== 0 && (
                        <Button variant={"outline"} onClick={resetFilters}>
                          {"Réinitialiser les filtres"}
                        </Button>
                      )}
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              filteredSalarials.map((salarial) => (
                <TableRow key={salarial.id}>
                  <TableCell>
                    {salarial.user
                      ? `${salarial.user.firstName} ${salarial.user.lastName}`
                      : `Utilisateur #${salarial.userId}`}
                  </TableCell>
                  <TableCell>{formatMontant(salarial.salaire_base)}</TableCell>
                  <TableCell>{formatMontant(salarial.prime_outil)}</TableCell>
                  <TableCell>
                    {formatMontant(salarial.prime_responsable)}
                  </TableCell>
                  <TableCell>{formatMontant(salarial.prime_gestion)}</TableCell>
                  <TableCell>
                    {formatMontant(salarial.indem_transport)}
                  </TableCell>
                  <TableCell>
                    {formatMontant(salarial.indem_representation)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size={"icon"} variant={"ghost"}>
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => viewSelected(salarial)}
                        >
                          <HugeiconsIcon icon={UserAccountIcon} />
                          {"Voir"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => editSelected(salarial)}
                        >
                          <HugeiconsIcon icon={UserEdit01Icon} />
                          {"Modifier"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDipe(salarial)}>
                          <HugeiconsIcon icon={AddSquareIcon} />
                          {"Ajouter le DIPE"}
                        </DropdownMenuItem>
                        {/* {user?.role === "MANAGER" && (
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => deleteSelected(salarial)}
                        >
                          <HugeiconsIcon icon={UserRemove01Icon} />
                          Supprimer
                        </DropdownMenuItem>
                      )} */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedSalarial && selected && (
        <>
          <AddDipe
            isOpen={openAddDipe}
            openChange={setOpenAddDipe}
            salarial={salarials.items}
            employee={selected}
          />
          <ShowDipe
            isOpen={openShowDipe}
            openChange={setOpenShowDipe}
            salarial={selectedSalarial}
            employee={selected}
          />
        </>
      )}
    </div>
  );
}

export default Page;
