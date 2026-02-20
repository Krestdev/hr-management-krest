"use client";

import Header from "@/components/header";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { useQuery } from "@tanstack/react-query";
import PresenceQuery from "@/queries/presences";
import UserQuery from "@/queries/users";
import { Employee } from "@/types/types";
import { id } from "date-fns/locale";
import PresenceComp from "./PresenceComp";

/* ================= TYPES ================= */

type PresenceFlag =
  | "PRESENT"
  | "EXCEPTIONAL"
  | "VALID"
  | "ABSENT"
  | "LATE"
  | "FIELD"
  | "EXCUSED"
  | "ON_LEAVE";

type Presence = {
  id: number;
  userId: number;
  date: string;
  statut: PresenceFlag[];
  createdAt: string;
  updatedAt?: string;
};

type PresenceSummary = {
  id: number;
  userId: number;
  name: string;
  PRESENT: number;
  EXCEPTIONAL: number;
  VALID: number;
  ABSENT: number;
  LATE: number;
  FIELD: number;
  EXCUSED: number;
  ON_LEAVE: number;
  joursTravailles: number;
};

/* ================= CONSTANTS ================= */

const WORKED_FLAGS: PresenceFlag[] = [
  "PRESENT",
  "EXCEPTIONAL",
  "VALID",
  "LATE",
  "FIELD",
  "EXCUSED",
];

/* ================= PAGE ================= */

export default function Page() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const presenceQuery = new PresenceQuery();
  const usersQuery = new UserQuery();

  const {
    data: presenceRes,
    isLoading: isLoadingPresence,
    isError: isErrorPresence,
    error: errorPresence,
    isSuccess: isSuccessPresence,
  } = useQuery({
    queryKey: ["presences"],
    queryFn: presenceQuery.getAll,
  });

  const {
    data: usersRes,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    isSuccess: isSuccessUsers,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: usersQuery.getAll,
  });

  /* ===== BUILD TABLE ===== */
  const presenceTable: PresenceSummary[] = useMemo(() => {
    if (!isSuccessPresence || !isSuccessUsers) return [];

    const table = presenceRes.items.reduce<Record<number, PresenceSummary>>(
      (acc, curr: Presence) => {
        const user = usersRes.find((u: Employee) => u.id === curr.userId);

        if (!acc[curr.userId]) {
          acc[curr.userId] = {
            id: curr.id,
            userId: curr.userId,
            name: user
              ? `${user.firstName} ${user.lastName}`
              : `Employé ${curr.userId}`,
            PRESENT: 0,
            EXCEPTIONAL: 0,
            VALID: 0,
            ABSENT: 0,
            LATE: 0,
            FIELD: 0,
            EXCUSED: 0,
            ON_LEAVE: 0,
            joursTravailles: 0,
          };
        }

        // Comptage statuts
        curr.statut.forEach((flag) => {
          acc[curr.userId][flag] += 1;
        });

        // Jours travaillés
        if (curr.statut.some((s) => WORKED_FLAGS.includes(s))) {
          acc[curr.userId].joursTravailles += 1;
        }

        return acc;
      },
      {},
    );

    return Object.values(table);
  }, [isSuccessPresence, isSuccessUsers, presenceRes, usersRes]);

  /* ===== FILTER ===== */
  const filteredTable = useMemo(() => {
    return presenceTable.filter((row) => {
      // 🔎 Search
      if (search && !row.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }

      // 🎯 Filter type
      if (filterType === "present") return row.PRESENT > 0;
      if (filterType === "absent") return row.ABSENT > 0;

      return true;
    });
  }, [presenceTable, search, filterType]);

  const onSelectPresence = (userId: number) => {
    setSelectedUserId(userId);
    setOpenDetail(true);
  };

  const selectedPresences = useMemo(() => {
    if (!selectedUserId || !isSuccessPresence) return [];
    return presenceRes.items.filter(
      (p: Presence) => p.userId === selectedUserId,
    );
  }, [selectedUserId, isSuccessPresence, presenceRes]);

  const selectedUserName = useMemo(() => {
    if (!selectedUserId || !isSuccessUsers) return "";
    const u = usersRes.find((u: Employee) => u.id === selectedUserId);
    return u ? `${u.firstName} ${u.lastName}` : "Employé";
  }, [selectedUserId, isSuccessUsers, usersRes]);

  const resetFilters = () => {
    setSearch("");
    setFilterType("all");
  };

  if (isLoadingPresence || isLoadingUsers) return <LoadingComponent />;
  if (isErrorPresence)
    return <ErrorComponent description={errorPresence.message} />;
  if (isErrorUsers) return <ErrorComponent description={errorUsers.message} />;
  if (!isSuccessPresence || !isSuccessUsers) return null;

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Tableau des présences" variant={"primary"} />

      {/* ===== FILTER BAR ===== */}
      <div className="flex items-center gap-4 ml-auto">
        <input
          type="text"
          placeholder="Rechercher un employé..."
          className="px-3 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="min-w-32">
            <SelectValue placeholder="Filtres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="present">Présents</SelectItem>
            <SelectItem value="absent">Absents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ===== TABLE ===== */}
      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Tableau des présences"}</h3>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Présent</TableHead>
              <TableHead>Exceptionnel</TableHead>
              <TableHead>Validé</TableHead>
              <TableHead>Absent</TableHead>
              <TableHead>Retard</TableHead>
              <TableHead>Terrain</TableHead>
              <TableHead>Excusé</TableHead>
              <TableHead>Congé</TableHead>
              <TableHead>Jours travaillés</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTable.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="p-6">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>
                        <HugeiconsIcon icon={UserGroupIcon} />
                      </EmptyMedia>
                      <EmptyTitle>Aucune donnée de présence</EmptyTitle>
                      <EmptyDescription>
                        {presenceTable.length === 0
                          ? "Aucune présence enregistrée."
                          : "Aucune donnée correspondant à votre recherche."}
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      {presenceTable.length !== 0 && (
                        <Button variant={"outline"} onClick={resetFilters}>
                          Réinitialiser les filtres
                        </Button>
                      )}
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              filteredTable.map((row) => (
                <TableRow
                  key={row.userId}
                  onClick={() => onSelectPresence(row.userId)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>{row.PRESENT}</TableCell>
                  <TableCell>{row.EXCEPTIONAL}</TableCell>
                  <TableCell>{row.VALID}</TableCell>
                  <TableCell>{row.ABSENT}</TableCell>
                  <TableCell>{row.LATE}</TableCell>
                  <TableCell>{row.FIELD}</TableCell>
                  <TableCell>{row.EXCUSED}</TableCell>
                  <TableCell>{row.ON_LEAVE}</TableCell>
                  <TableCell className="font-bold text-primary">
                    {row.joursTravailles}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <PresenceComp
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        userName={selectedUserName}
        presences={selectedPresences}
        monthLabel="Novembre 2025"
      />
    </div>
  );
}
