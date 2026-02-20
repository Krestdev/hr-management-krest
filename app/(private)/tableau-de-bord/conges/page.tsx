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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { EllipsisIcon, HistoryIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkSquare02Icon,
  CancelSquareIcon,
  EyeFreeIcons,
} from "@hugeicons/core-free-icons";

import LeavesQuery from "@/queries/leaves";
import UserQuery from "@/queries/users";
import { Leaves, Employee } from "@/types/types";
import WarningModal from "@/components/WarningModal";
import { toast } from "sonner";
import Link from "next/link";
import ViewConge from "./ViewConge";

const TOTAL_ANNUAL_DAYS = 30; // règle RH annuelle

function Page() {
  const leavesQuery = new LeavesQuery();
  const usersQuery = new UserQuery();

  const {
    data: leavesData,
    isLoading: isLoadingLeaves,
    isError: isErrorLeaves,
    error: errorLeaves,
    isSuccess: isSuccessLeaves,
  } = useQuery({
    queryKey: ["leaves"],
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

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [viewProcess, setViewProcess] = useState(false);
  const [viewReject, setViewReject] = useState(false);
  const [openView, setOpenView] = useState(false);

  /**
   * 🧠 AGRÉGATION PAR UTILISATEUR
   */
  const tableData = useMemo(() => {
    if (!isSuccessLeaves || !isSuccessUsers) return [];

    const grouped: Record<
      number,
      {
        userId: number;
        consumed: number;
        hasPending: boolean;
      }
    > = {};

    // groupement des congés
    leavesData.items.forEach((leave: Leaves) => {
      if (!grouped[leave.userId]) {
        grouped[leave.userId] = {
          userId: leave.userId,
          consumed: 0,
          hasPending: false,
        };
      }

      // ✅ somme des congés validés
      if (leave.status === "APPROVED") {
        grouped[leave.userId].consumed += leave.days;
      }

      // ✅ demande en cours
      if (leave.status === "PENDING") {
        grouped[leave.userId].hasPending = true;
      }
    });

    // mapping final
    return Object.values(grouped).map((item) => {
      const user = usersData.find((u: Employee) => u.id === item.userId);

      const total = TOTAL_ANNUAL_DAYS;
      const consumed = item.consumed;
      const remaining = total - consumed;

      return {
        userId: item.userId,
        employeeName: user ? `${user.firstName} ${user.lastName}` : "Inconnu",
        total,
        consumed,
        remaining,
        hasPending: item.hasPending,
      };
    });
  }, [isSuccessLeaves, isSuccessUsers, leavesData, usersData]);

  if (isLoadingLeaves || isLoadingUsers) return <LoadingComponent />;
  if (isErrorLeaves)
    return <ErrorComponent description={errorLeaves.message} />;
  if (isErrorUsers) return <ErrorComponent description={errorUsers.message} />;
  if (!isSuccessLeaves || !isSuccessUsers) return null;

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header title="Gestion des congés" variant="primary" />

      <div className="grid gap-2">
        <Link
          className="w-fit ml-auto"
          href={"/tableau-de-bord/conges/historique"}
        >
          <Button variant={"accent"}>
            <HistoryIcon className="mr-2 h-4 w-4" />
            {"Historique"}
          </Button>
        </Link>
        <div className="card-1">
          <div className="card-1-header2">
            <h3>{"Tableau des congés"}</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Employé"}</TableHead>
                <TableHead>{"Congé total"}</TableHead>
                <TableHead>{"Congés consommés"}</TableHead>
                <TableHead>{"Congés restants"}</TableHead>
                <TableHead>{"Demande en cours"}</TableHead>
                <TableHead>{"Actions"}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.userId}>
                  <TableCell>{row.employeeName}</TableCell>
                  <TableCell>{row.total} jours</TableCell>
                  <TableCell>{row.consumed} jours</TableCell>
                  <TableCell>{row.remaining} jours</TableCell>

                  <TableCell>
                    {row.hasPending ? (
                      <span className="text-[#00FF4C] font-medium flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-[#00FF4C]" />
                        Oui
                      </span>
                    ) : (
                      <span className="text-[#FF0000] font-medium flex items-center gap-2">
                        <div className="size-2.5 rounded-full bg-[#FF0000]" />
                        Non
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <EllipsisIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {/* 👁 VOIR */}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserId(row.userId);
                            setOpenView(true);
                          }}
                        >
                          <HugeiconsIcon icon={EyeFreeIcons} />
                          {"Voir"}
                        </DropdownMenuItem>

                        {/* ✅ TRAITER */}
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedUserId(row.userId);
                            setViewProcess(true);
                          }}
                          disabled={!row.hasPending}
                          className="text-green-600"
                        >
                          <HugeiconsIcon
                            icon={CheckmarkSquare02Icon}
                            className="text-green-600"
                          />
                          {"Traiter la demande"}
                        </DropdownMenuItem>

                        {/* ❌ REJETER */}
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => {
                            setSelectedUserId(row.userId);
                            setViewReject(true);
                          }}
                          disabled={!row.hasPending}
                        >
                          <HugeiconsIcon icon={CancelSquareIcon} />
                          {"Rejeter la demande"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* MODALS */}

      <WarningModal
        open={viewProcess}
        onOpenChange={setViewProcess}
        title={"Valider la demande de congé ?"}
        action={() => {
          toast.success("Demande de congé validée avec succès !");
        }}
        variant="success"
        actionLabel="Valider"
        cancelLabel="Annuler"
      />

      <WarningModal
        open={viewReject}
        onOpenChange={setViewReject}
        title={"Rejeter la demande de congé ?"}
        action={() => {
          toast.success("Demande de congé rejetée !");
        }}
        variant="error"
        actionLabel="Rejeter"
        cancelLabel="Annuler"
      />

      {selectedUserId && (
        <ViewConge
          isOpen={openView}
          openChange={setOpenView}
          employeeId={selectedUserId}
        />
      )}
    </div>
  );
}

export default Page;
