"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import Header from "@/components/header";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";
import StatisticCard from "@/components/statistic-card";
import { ArrowLeft, MoreHorizontal, Edit2, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditPresenceModal from "./EditPresenceModal";
import PresenceComp from "../PresenceComp";
import { Presence } from "@/types/types";
import { useEmployeeQuery, usePresencesByUserIdQuery } from "@/hooks/queries-hooks";

export default function EmployeePresencePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = params.id as string;
  const monthParam = searchParams.get("month");
  const yearParam = searchParams.get("year");

  const currentMonth = monthParam ? parseInt(monthParam, 10) : new Date().getMonth() + 1;
  const currentYear = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

  const { data: employee, isLoading: isLoadingEmp, isError: isErrorEmp } = useEmployeeQuery(id);

  // Note: if your usePresencesByUserIdQuery requires enabled parameter, it's the 4th parameter.
  const { data: presencesData, isLoading: isLoadingPres, isError: isErrorPres } = usePresencesByUserIdQuery(id, currentMonth, currentYear, true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPresence, setSelectedPresence] = useState<Presence | null>(null);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  const presences = useMemo(() => {
    if (!presencesData) return [];
    // Ensure we are working with an array of Presence objects
    if (Array.isArray(presencesData)) return presencesData;
    if ((presencesData as any).data && Array.isArray((presencesData as any).data)) return (presencesData as any).data;
    if ((presencesData as any).items && Array.isArray((presencesData as any).items)) return (presencesData as any).items;
    return [];
  }, [presencesData]);

  // Calculate stats over the loaded month
  const stats = useMemo(() => {
    let absences = 0;
    let presencesCount = 0;
    let retards = 0;

    presences.forEach((p: Presence) => {
      if (p.status.includes("ABSENT") || p.status.includes("ON_LEAVE")) absences++;
      if (p.status.includes("PRESENT") || p.status.includes("FIELD") || p.status.includes("VALID") || p.status.includes("EXCEPTIONAL")) presencesCount++;
      if (p.status.includes("LATE")) retards++;
    });

    return { absences, presences: presencesCount, retards };
  }, [presences]);

  if (isLoadingEmp || isLoadingPres) return <LoadingComponent />;
  if (isErrorEmp || isErrorPres || !employee) return <ErrorComponent />;

  const fullName = `${employee.firstName} ${employee.lastName}`;
  const monthLabel = format(new Date(currentYear, currentMonth - 1, 1), "MMMM yyyy", { locale: fr });

  return (
    <div className="flex flex-col h-full bg-slate-50 w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <Header title={`Détails des présences - ${fullName}`} variant="primary" />
      </div>

      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <p className="text-sm text-gray-500">{`Mois de ${monthLabel}`}</p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setHistoryModalOpen(true)}>
            <History className="w-4 h-4 mr-2" />
            Historique
          </Button>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <StatisticCard
            title="Absences"
            value={stats.absences.toString().padStart(2, '0')}
            advanced={{ title: "Absences justifiées", value: "0" }}
            isIcon={false}
            iconBg="bg-red-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </StatisticCard>

          <StatisticCard
            title="Présences"
            value={stats.presences.toString().padStart(2, '0')}
            advanced={{ title: "Retards", value: stats.retards.toString().padStart(2, '0') }}
            isIcon={false}
            iconBg="bg-green-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          </StatisticCard>
        </div>

        <div className="bg-white rounded-lg border shadow-sm flex-1 flex flex-col overflow-hidden">
          <div className="overflow-y-auto flex-1">
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <TableRow>
                  <TableHead className="font-medium bg-cyan-700 text-white sticky top-0">Date</TableHead>
                  <TableHead className="font-medium bg-cyan-700 text-white sticky top-0">Statut</TableHead>
                  <TableHead className="font-medium bg-cyan-700 text-white sticky top-0">Check in - out</TableHead>
                  <TableHead className="font-medium bg-cyan-700 text-white sticky top-0">Modifié le</TableHead>
                  <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {presences.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                      Aucune présence trouvée pour ce mois.
                    </TableCell>
                  </TableRow>
                ) : (
                  presences.map((p: Presence) => {
                    const isLate = p.status.includes("LATE");
                    const isAbsent = p.status.includes("ABSENT");
                    const isPresent = p.status.includes("PRESENT") || p.status.includes("EXCEPTIONAL") || p.status.includes("VALID") || p.status.includes("FIELD");

                    let statusLabel = "Inconnu";
                    let badgeVariant: "default" | "destructive" | "secondary" | "outline" | "success" = "secondary";

                    if (isLate) {
                      statusLabel = "En retard";
                      badgeVariant = "destructive";
                    } else if (isPresent) {
                      statusLabel = "À l'heure";
                      badgeVariant = "success";
                    } else if (isAbsent) {
                      statusLabel = "Absent";
                      badgeVariant = "outline";
                    } else if (p.status.includes("ON_LEAVE")) {
                      statusLabel = "En congé";
                      badgeVariant = "secondary";
                    } else if (p.status.includes("EXCUSED")) {
                      statusLabel = "Excusé";
                      badgeVariant = "secondary";
                    }

                    let checkInStr = "--:--";
                    let checkOutStr = "--:--";
                    if (p.checkIn) checkInStr = format(parseISO(p.checkIn), "HH:mm");
                    if (p.checkOut) checkOutStr = format(parseISO(p.checkOut), "HH:mm");

                    const updatedDateStr = p.updatedAt ? format(parseISO(p.updatedAt), "dd MMM yyyy, HH:mm", { locale: fr }) : "-";

                    let dateLabel = "-";
                    const recordDate = p.checkIn || p.createdAt;
                    if (recordDate) {
                      dateLabel = format(parseISO(recordDate), "dd MMM yyyy", { locale: fr });
                    }

                    return (
                      <TableRow key={p.uuid}>
                        <TableCell>
                          <p className="font-medium">{dateLabel}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant as any} className={badgeVariant === "success" ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
                            {statusLabel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {checkInStr} - {checkOutStr}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {updatedDateStr}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPresence(p);
                                  setEditModalOpen(true);
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <EditPresenceModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedPresence(null);
        }}
        presence={selectedPresence}
      />

      <PresenceComp
        open={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        userName={fullName}
        presences={presences}
        monthLabel={monthLabel}
      />
    </div>
  );
}
