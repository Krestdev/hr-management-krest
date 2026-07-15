"use client";

import Header from "@/components/header";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";
import StatisticCard from "@/components/statistic-card";
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
import { useMemo, useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { usePresencesQuery, useCreatePresenceMutation, useCreateManyPresencesMutation } from "@/queries/presences";
import { useEmployeesQuery } from "@/queries/employee";
import useKizunaStore from "@/context/store";
import { Employee, Presence, PresenceFlag } from "@/types/types";
import PresenceComp from "./PresenceComp";
import { format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Download, MoreHorizontal, Eye, Edit2, UploadCloudIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ================= TYPES ================= */

type DailyPresenceRow = {
  userId: string;
  name: string;
  role: string;
  photo?: string;
  statuts: PresenceFlag[];
  checkInOut: string;
  retards30j: number;
  modifieLe: string;
};

type ParsedPresence = {
  name: string;
  dateStr: string;
  statusStr: string;
  flags: PresenceFlag[];
  checkIn: string;
  checkOut: string;
  employeeId?: string;
  employeeName?: string;
  exists: boolean;
  error?: string;
};

/* ================= PAGE ================= */

export default function Page() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [parsedPresences, setParsedPresences] = useState<ParsedPresence[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user, isHydrated } = useKizunaStore();

  const currentMonth = selectedDate ? selectedDate.getMonth() + 1 : undefined;
  const currentYear = selectedDate ? selectedDate.getFullYear() : undefined;

  const {
    data: presenceRes,
    isLoading: isLoadingPresence,
    isError: isErrorPresence,
    error: errorPresence,
    isSuccess: isSuccessPresence,
  } = usePresencesQuery(currentMonth, currentYear);

  // Synchroniser la date sélectionnée avec le mois du dernier ajout par défaut
  useEffect(() => {
    if (!selectedDate && isSuccessPresence && presenceRes && presenceRes.length > 0) {
      const latestDateStr = presenceRes[0].date;
      if (latestDateStr) {
        setSelectedDate(new Date(latestDateStr));
      }
    }
  }, [selectedDate, isSuccessPresence, presenceRes]);

  const {
    data: usersRes,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    error: errorUsers,
    isSuccess: isSuccessUsers,
  } = useEmployeesQuery(1, 200, user?.companyId || "", "", "", "ACTIVE", "", false, false, isHydrated && !!user);

  const createPresence = useCreatePresenceMutation();
  const createManyPresences = useCreateManyPresencesMutation();

  /* ===== BUILD TABLE ===== */
  const dailyPresences = useMemo(() => {
    if (!isSuccessPresence || !isSuccessUsers) return [];

    // On filtre par le mois de la date sélectionnée (s'il y en a une)
    const monthStr = selectedDate ? format(selectedDate, "yyyy-MM") : "";

    const rows = presenceRes
      .filter((p: Presence) => monthStr ? p.date.startsWith(monthStr) : true)
      .map((p: Presence) => {
        const user = usersRes.data.find((u: Employee) => u.uuid === p.userId);
        if (!user) return null;

        const roleDisplay = user.position?.[0] || user.category || "Employé";

        return {
          id: p.id,
          userId: user.uuid,
          name: `${user.firstName} ${user.lastName}`,
          role: roleDisplay,
          date: p.date,
          statuts: p.statut,
          checkInOut: p.checkIn && p.checkOut ? `${p.checkIn} - ${p.checkOut}` : p.checkIn ? p.checkIn : "--/--",
          modifieLe: format(new Date(p.createdAt), "dd MMM yyyy, HH:mm", { locale: fr }),
          presenceOriginal: p
        };
      })
      .filter(Boolean) as any[];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      return rows.filter((r) => r.name.toLowerCase().includes(searchLower));
    }

    // Sort by date (descending) and then name
    return rows.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return a.name.localeCompare(b.name);
    });
  }, [isSuccessPresence, isSuccessUsers, presenceRes, usersRes, selectedDate, search]);

  const stats = useMemo(() => {
    let absences = 0;
    let presences = 0;
    let retards = 0;

    dailyPresences.forEach(row => {
      if (row.statuts.includes("ABSENT") || row.statuts.includes("ON_LEAVE")) {
        absences++;
      } else {
        presences++;
      }
      if (row.statuts.includes("LATE")) {
        retards++;
      }
    });

    return { absences, presences, retards };
  }, [dailyPresences]);

  const onSelectPresence = (userId: string) => {
    setSelectedUserId(userId);
    setOpenDetail(true);
  };

  const selectedPresences = useMemo(() => {
    if (!selectedUserId || !isSuccessPresence) return [];
    return presenceRes.filter((p: Presence) => p.userId === selectedUserId);
  }, [selectedUserId, isSuccessPresence, presenceRes]);

  const selectedUserName = useMemo(() => {
    if (!selectedUserId || !isSuccessUsers) return "";
    const u = usersRes.data.find((u: Employee) => u.uuid === selectedUserId);
    return u ? `${u.firstName} ${u.lastName}` : "Employé";
  }, [selectedUserId, isSuccessUsers, usersRes]);

  const handleImport = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      toast.loading("Importation en cours...");

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");

      // Since exported XLS (HTML) might have malformed tags (missing <tr>),
      // DOMParser might hoist <td> elements outside the <table>.
      // So we collect all <td> elements from the entire document.
      const tds = Array.from(doc.querySelectorAll("td"));

      if (tds.length === 0) {
        toast.dismiss();
        toast.error("Le fichier ne contient aucune donnée reconnaissable.");
        return;
      }

      let i = 0;
      const items: ParsedPresence[] = [];

      while (i < tds.length) {
        const cell0 = (tds[i].textContent || "").trim();

        // Identify a data row by checking if the first cell is an ID (digits)
        if (/^\d+$/.test(cell0) && tds[i + 3]) {
          const name = (tds[i + 1]?.textContent || "").trim();
          const dateStr = (tds[i + 3]?.textContent || "").trim();
          const statusStr = (tds[i + 5]?.textContent || "").trim();
          const checkIn = (tds[i + 6]?.textContent || "").trim();
          const checkOut = (tds[i + 7]?.textContent || "").trim();

          // Match with employee
          const employee = usersRes?.data.find((u: Employee) => {
            const firstName = (u.firstName || "").trim().toLowerCase();
            const lastName = (u.lastName || "").trim().toLowerCase();
            const fullName = `${firstName} ${lastName}`;
            const reverseName = `${lastName} ${firstName}`;
            const searchName = name.replace(/[\s\uFEFF\xA0]+/g, ' ').trim().toLowerCase();

            return fullName === searchName ||
              reverseName === searchName ||
              (lastName.length > 2 && searchName.includes(lastName)) ||
              (firstName.length > 2 && searchName.includes(firstName));
          });

          let flags: PresenceFlag[] = ["PRESENT"];
          if (statusStr.toLowerCase().includes("late")) flags.push("LATE");
          if (statusStr.toLowerCase().includes("absent")) flags = ["ABSENT"];

          let exists = false;
          let error = "";

          if (!employee) {
            error = "Employé non trouvé";
          } else {
            exists = !!presenceRes?.find((p: Presence) =>
              p.userId === employee.uuid && p.date.startsWith(dateStr)
            );
            if (exists) error = "Déjà importé";
          }

          items.push({
            name,
            dateStr,
            statusStr,
            flags,
            checkIn: checkIn === "-" ? "" : checkIn,
            checkOut: checkOut === "-" ? "" : checkOut,
            employeeId: employee?.uuid,
            employeeName: employee ? `${employee.firstName} ${employee.lastName}` : undefined,
            exists,
            error
          });

          i += 8;
        } else if (cell0.startsWith("Check-In Time:")) {
          i += 3;
        } else {
          i++;
        }
      }

      toast.dismiss();
      if (items.length > 0) {
        setParsedPresences(items);
        toast.success(`${items.length} lignes analysées.`);
      } else {
        toast.error("Aucune ligne de présence trouvée dans ce fichier.");
      }
    };
    reader.readAsText(file);
  };

  const submitImport = async () => {
    setIsSubmitting(true);

    // Extraire uniquement les éléments valides
    const validItems = parsedPresences
      .filter((item) => item.employeeId && !item.exists)
      .map((item) => ({
        userId: item.employeeId as string,
        date: new Date(item.dateStr).toISOString(),
        statut: item.flags,
        checkIn: item.checkIn || undefined,
        checkOut: item.checkOut || undefined
      }));

    if (validItems.length === 0) {
      toast.info("Aucune nouvelle présence à importer.");
      setIsSubmitting(false);
      setParsedPresences([]);
      setImportDialogOpen(false);
      return;
    }

    try {
      const firstDate = new Date(validItems[0].date);
      const month = firstDate.getMonth() + 1; // 1-12
      const year = firstDate.getFullYear();

      await createManyPresences.mutateAsync({
        data: validItems,
        month,
        year
      });
      toast.success(`Importation terminée ! ${validItems.length} présences ajoutées.`);
      setParsedPresences([]);
      setImportDialogOpen(false);
    } catch (err: any) {
      console.error("Failed to import bulk presences:", err);
      toast.error(`Erreur lors de l'importation: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (statuts: PresenceFlag[]) => {
    if (statuts.includes("LATE")) return <Badge className="bg-orange-400 hover:bg-orange-500">Retard</Badge>;
    if (statuts.includes("ABSENT")) return <Badge variant="destructive">Absent</Badge>;
    if (statuts.includes("ON_LEAVE")) return <Badge className="bg-purple-500 hover:bg-purple-600">En congé</Badge>;
    if (statuts.includes("PRESENT")) return <Badge className="bg-green-500 hover:bg-green-600">À l'heure</Badge>;
    return <Badge variant="secondary">Inconnu</Badge>;
  };

  if (isLoadingPresence || isLoadingUsers) return <LoadingComponent />;
  if (isErrorPresence) return <ErrorComponent description={errorPresence.message} />;
  if (isErrorUsers) return <ErrorComponent description={errorUsers.message} />;
  if (!isSuccessPresence || !isSuccessUsers) return null;

  return (
    <div className="flex flex-col gap-6 w-full max-w-full overflow-hidden p-6">
      <div className="flex items-center justify-between">
        <Header title="Présences" variant="primary" />
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

      {/* ===== FILTER BAR ===== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <Input
            type="text"
            placeholder="Rechercher"
            className="pl-9 bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal bg-white",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "MMMM yyyy", { locale: fr }) : <span>Choisir un mois</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => d && setSelectedDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Dialog open={importDialogOpen} onOpenChange={(val) => {
            if (!val) setParsedPresences([]);
            setImportDialogOpen(val);
          }}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white">
                <UploadCloudIcon className="w-4 h-4 mr-2" />
                Importer CSV/XLS
              </Button>
            </DialogTrigger>
            <DialogContent className={`${parsedPresences.length === 0 ? "max-w-xl!" : "max-w-6xl!"} mx-auto`}>
              <DialogHeader>
                <DialogTitle>Importer les présences</DialogTitle>
              </DialogHeader>

              {parsedPresences.length === 0 ? (
                <div className="flex flex-col gap-4 py-4">
                  <Label htmlFor="file-upload">Sélectionner un fichier de rapport (.xls, .csv)</Label>
                  <Input id="file-upload" type="file" ref={fileInputRef} accept=".csv,.xls,.xlsx" />
                  <Button onClick={handleImport} className="w-full mt-2">
                    Analyser le fichier
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4 py-2">
                  <div className="bg-muted/50 p-3 text-sm rounded-md border text-gray-700">
                    <strong>{parsedPresences.length}</strong> lignes trouvées. Les lignes en rouge (déjà importées ou introuvables) seront ignorées lors de l'importation.
                  </div>
                  <div className="max-h-[400px] overflow-auto border rounded-md">
                    <Table>
                      <TableHeader className="bg-gray-50">
                        <TableRow>
                          <TableHead className="font-semibold text-gray-900">Employé (Fichier)</TableHead>
                          <TableHead className="font-semibold text-gray-900">Date</TableHead>
                          <TableHead className="font-semibold text-gray-900">Heures</TableHead>
                          <TableHead className="font-semibold text-gray-900">Statut</TableHead>
                          <TableHead className="font-semibold text-gray-900 text-right">Remarque</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedPresences.map((p, idx) => (
                          <TableRow key={idx} className={p.error ? "bg-red-50 hover:bg-red-50" : ""}>
                            <TableCell className="font-medium">{p.name}</TableCell>
                            <TableCell>{p.dateStr}</TableCell>
                            <TableCell>{p.checkIn && p.checkOut ? `${p.checkIn} - ${p.checkOut}` : p.checkIn ? p.checkIn : "--/--"}</TableCell>
                            <TableCell>{getStatusBadge(p.flags)}</TableCell>
                            <TableCell className="text-right">
                              {p.error ? (
                                <span className="text-red-500 font-medium text-xs bg-red-100 px-2 py-1 rounded">{p.error}</span>
                              ) : (
                                <span className="text-green-600 font-medium text-xs bg-green-100 px-2 py-1 rounded">Prêt à importer</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <Button variant="outline" onClick={() => setParsedPresences([])} disabled={isSubmitting}>
                      Annuler
                    </Button>
                    <Button onClick={submitImport} disabled={isSubmitting || parsedPresences.every(p => !!p.error)}>
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Confirmer l'importation
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="bg-white">
            Filtres (0)
          </Button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-medium text-muted-foreground">Employé</TableHead>
              <TableHead className="font-medium text-muted-foreground">Date</TableHead>
              <TableHead className="font-medium text-muted-foreground">Statut</TableHead>
              <TableHead className="font-medium text-muted-foreground">Check in - out</TableHead>
              <TableHead className="font-medium text-muted-foreground">Modifié le</TableHead>
              <TableHead className="font-medium text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dailyPresences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="p-6">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant={"icon"}>
                        <HugeiconsIcon icon={UserGroupIcon} />
                      </EmptyMedia>
                      <EmptyTitle>Aucune donnée</EmptyTitle>
                      <EmptyDescription>
                        Aucune présence enregistrée pour ce mois.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              dailyPresences.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-muted/30 border-b border-muted/50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={row.photo || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {row.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-gray-900">{row.name}</span>
                        <span className="text-xs text-muted-foreground">{row.role}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-gray-700">
                    {format(new Date(row.date), "dd MMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(row.statuts)}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.checkInOut}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.retards30j.toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {row.modifieLe}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectPresence(row.userId)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Historique
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
        monthLabel={selectedDate ? format(selectedDate, "MMMM yyyy", { locale: fr }) : ""}
      />
    </div>
  );
}
