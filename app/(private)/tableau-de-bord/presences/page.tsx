"use client";

import { useRouter } from "next/navigation";

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
import { CalendarIcon, Download, MoreHorizontal, Eye, Edit2, UploadCloudIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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

type AggregatedPresenceRow = {
  userId: string;
  name: string;
  role: string;
  photo?: string;
  stats: Record<PresenceFlag, number>;
  joursTravailles: number;
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

export default function AttendancePage() {
  const router = useRouter();
  const selectedCompanyId = useKizunaStore((state) => state.selectedCompanyId);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [pickerYear, setPickerYear] = useState<number>(new Date().getFullYear());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const handleOpenDatePicker = (open: boolean) => {
    setIsDatePickerOpen(open);
    if (open && selectedDate) {
      setPickerYear(selectedDate.getFullYear());
    } else if (open && !selectedDate) {
      setPickerYear(new Date().getFullYear());
    }
  };
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
      const latestDateStr = presenceRes[0].checkIn;
      if (latestDateStr) {
        const d = new Date(latestDateStr);
        setSelectedDate(d);
        setPickerYear(d.getFullYear());
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
  const aggregatedPresences = useMemo(() => {
    if (!isSuccessPresence || !isSuccessUsers) return [];

    const monthStr = selectedDate ? format(selectedDate, "yyyy-MM") : "";

    const userMap = new Map<string, AggregatedPresenceRow>();

    presenceRes
      .filter((p: Presence) => monthStr ? p.checkIn?.startsWith(monthStr) : true)
      .forEach((p: Presence) => {
        const user = usersRes.data.find((u: Employee) => u.uuid === p.employeeId);
        if (!user) return;

        if (!userMap.has(user.uuid)) {
          const roleDisplay = user.position?.[0] || user.category || "Employé";
          userMap.set(user.uuid, {
            userId: user.uuid,
            name: `${user.firstName} ${user.lastName}`,
            role: roleDisplay,
            stats: {
              PRESENT: 0, EXCEPTIONAL: 0, VALID: 0, ABSENT: 0, LATE: 0, FIELD: 0, EXCUSED: 0, ON_LEAVE: 0
            },
            joursTravailles: 0,
          });
        }

        const row = userMap.get(user.uuid)!;

        let workedDay = false;
        p.status.forEach((flag) => {
          if (row.stats[flag] !== undefined) {
            row.stats[flag]++;
          }
          if (["PRESENT", "EXCEPTIONAL", "VALID", "LATE", "FIELD"].includes(flag)) {
            workedDay = true;
          }
        });

        if (workedDay) {
          row.joursTravailles++;
        }
      });

    let rows = Array.from(userMap.values());

    if (search.trim()) {
      const searchLower = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(searchLower));
    }

    return rows.sort((a, b) => a.name.localeCompare(b.name));
  }, [isSuccessPresence, isSuccessUsers, presenceRes, usersRes, selectedDate, search]);

  console.log("presenceRes", presenceRes);




  const onSelectPresence = (userId: string) => {
    const month = selectedDate ? selectedDate.getMonth() + 1 : new Date().getMonth() + 1;
    const year = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();
    router.push(`/tableau-de-bord/presences/${userId}?month=${month}&year=${year}`);
  };

  const selectedPresences = useMemo(() => {
    if (!selectedUserId || !isSuccessPresence) return [];
    return presenceRes.filter((p: Presence) => p.employeeId === selectedUserId);
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
              p.employeeId === employee.uuid && p.checkIn?.startsWith(dateStr)
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
        employeeId: item.employeeId as string,
        checkIn: item.dateStr ? new Date(item.dateStr).toISOString() : new Date().toISOString(),
        status: item.flags,
        checkOut: item.checkOut ? new Date(`${item.dateStr}T${item.checkOut}:00`).toISOString() : undefined
      }));

    if (validItems.length === 0) {
      toast.info("Aucune nouvelle présence à importer.");
      setIsSubmitting(false);
      setParsedPresences([]);
      setImportDialogOpen(false);
      return;
    }

    try {
      await createManyPresences.mutateAsync({
        data: validItems
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
          <Popover open={isDatePickerOpen} onOpenChange={handleOpenDatePicker}>
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
              <div className="p-3 w-[280px]">
                <div className="flex items-center justify-between pt-1 relative pb-4">
                  <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100" onClick={() => setPickerYear(y => y - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium">{pickerYear}</div>
                  <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100" onClick={() => setPickerYear(y => y + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => {
                    const monthDate = new Date(pickerYear, i, 1);
                    const isSelected = selectedDate?.getMonth() === i && selectedDate?.getFullYear() === pickerYear;
                    return (
                      <Button
                        key={i}
                        variant={isSelected ? "default" : "ghost"}
                        className={cn("h-9 w-full", isSelected ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground" : "")}
                        onClick={() => {
                          setSelectedDate(monthDate);
                          setIsDatePickerOpen(false);
                        }}
                      >
                        {format(monthDate, "MMM", { locale: fr }).charAt(0).toUpperCase() + format(monthDate, "MMM", { locale: fr }).slice(1)}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Dialog open={importDialogOpen} onOpenChange={(val) => {
            if (!val) setParsedPresences([]);
            setImportDialogOpen(val);
          }}>
            <DialogTrigger asChild>
              <Button variant="primary">
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
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0">Employé</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Présent</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Exceptionnel</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Valide</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Absent</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Terrain</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Excuse</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Congé</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Jours travaillés</TableHead>
              <TableHead className="font-medium bg-cyan-700 text-white sticky top-0 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {aggregatedPresences.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="p-6">
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
              aggregatedPresences.map((row) => (
                <TableRow
                  key={row.userId}
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
                  <TableCell className="text-center">{row.stats.PRESENT}</TableCell>
                  <TableCell className="text-center">{row.stats.EXCEPTIONAL}</TableCell>
                  <TableCell className="text-center">{row.stats.VALID}</TableCell>
                  <TableCell className="text-center">{row.stats.ABSENT}</TableCell>
                  <TableCell className="text-center">{row.stats.FIELD}</TableCell>
                  <TableCell className="text-center">{row.stats.EXCUSED}</TableCell>
                  <TableCell className="text-center">{row.stats.ON_LEAVE}</TableCell>
                  <TableCell className="text-center font-semibold">{row.joursTravailles}</TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" onClick={() => onSelectPresence(row.userId)}>
                      <Eye className="w-4 h-4" />
                    </Button>
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
