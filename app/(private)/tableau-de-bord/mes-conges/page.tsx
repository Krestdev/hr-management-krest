'use client'
import { DateRangePicker } from '@/components/dateRagePicker'
import { Badge, badgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import useKizunaStore from '@/context/store'
import { formatDate } from '@/lib/utils'
import HolidaysQuery from '@/queries/holidays'
import { HolidayRequest } from '@/types/types'
import { MoreHorizontalIcon, PlusSignSquareIcon, SearchVisualIcon, ViewIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useQuery } from '@tanstack/react-query'
import { VariantProps } from 'class-variance-authority'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { DateRange } from "react-day-picker"
import ViewLeaveRequest from './view'

export function formatStatusLabel(status: HolidayRequest["status"]) {
  switch (status) {
    case "ACCEPTED":
      return "Accepté";
    case "REJECTED":
      return "Rejeté";
    case "PENDING_MANAGER":
    case "PENDING_HR":
      return "En attente";
    default:
      return status;
  }
}

export function badgeStatusVariant(status: HolidayRequest["status"]): VariantProps<typeof badgeVariants>["variant"]{
    switch (status) {
        case "ACCEPTED":
            return "success";
        case "REJECTED" :
            return "destructive";
        case 'PENDING_MANAGER':
            return "orange";
        case 'PENDING_HR':
            return "orange";
        default:
            return "default";
    }
}


function Page() {
    const { user } = useKizunaStore();
    const holidaysQuery = new HolidaysQuery();
    const { data, isSuccess } = useQuery({
        queryKey: ["leave-requests", user?.id],
        queryFn: async()=>holidaysQuery.getRequestsByUser(user?.id ?? 0),
        enabled: !!user,
    });

    const [view, setView] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [cancel, setCancel] = useState<boolean>(false);
    const [activeReq, setActiveReq] = useState<HolidayRequest>();
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  function resetFilters(){
    setStatusFilter("all");
    setDateRange(undefined);
  }

  function handleView(req: HolidayRequest){
    setActiveReq(req);
    setView(true);
  }

    const filteredRequests = useMemo(() => {
  if (!isSuccess || !data) return [];

  return data
    .filter((request) => {
      // ----- filtre statut -----
      const matchStatus =
        statusFilter === "all" ? true : request.status.startsWith(statusFilter);

      // ----- filtre dates -----
      const from = dateRange?.from;
      const to = dateRange?.to;

      // attention si ton API renvoie des string, pense à caster :
      const start = new Date(request.createdAt);

      let matchDate = true;

      if (from && !to) {
        matchDate = start >= from;
      } else if (!from && to) {
        matchDate = start <= to;
      } else if (from && to) {
        matchDate = start >= from && start <= to;
      }

      return matchStatus && matchDate;
    })
    // optionnel : tri par date de début décroissante
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
}, [isSuccess, data, statusFilter, dateRange]);

    if(isSuccess)
  return (
    <div>
        <div className="card-1">
            <div className="card-1-header2">
                <h3>{"Historique des congés"}</h3>
                {/**Filtres */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Label htmlFor='status'>{"Statut"}</Label>
                        <Select name="status" value={statusFilter} onValueChange={(value)=>setStatusFilter(value)} >
                            <SelectTrigger className="min-w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{"Tous"}</SelectItem>
                                <SelectItem value="ACCEPTED">{"Accepté"}</SelectItem>
                                <SelectItem value="PENDING">{"En attente"}</SelectItem>
                                <SelectItem value="REJECTED">{"Rejeté"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="date">{"Période"}</Label>
                        <DateRangePicker
                        date={dateRange}
                        onChange={setDateRange}
                        className="min-w-40"/>
                    </div>
                    <Link href={"/tableau-de-bord/mes-conges/creer"}>
                        <Button variant={"accent"}>{"Demande d'absence"}<HugeiconsIcon icon={PlusSignSquareIcon} strokeWidth={2} /></Button>
                    </Link>
                </div>
            </div>
            {/**Header END */}
            <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{"Type"}</TableHead>
              <TableHead>{"Période"}</TableHead>
              <TableHead>{"Émis le"}</TableHead>
              <TableHead>{"Statut"}</TableHead>
              <TableHead>{"Justificatif"}</TableHead>
              <TableHead>{"Observation"}</TableHead>
              <TableHead>{"Actions"}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>
                  <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                            <HugeiconsIcon icon={SearchVisualIcon} />
                        </EmptyMedia>
                        <EmptyTitle>{"Aucun résultat correspondant"}</EmptyTitle>
                        <EmptyDescription>{"Nous ne trouvons pas d'élement correspondant à ces critères"}</EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button variant={"outline"} onClick={resetFilters}>{"Réinitialiser les filtres"}</Button>
                    </EmptyContent>
                  </Empty>
                </TableCell>
              </TableRow>
            )}

            {filteredRequests.map((request) => (
              <TableRow className="h-13" key={request.id}>
                <TableCell>
                  {/* typeLabel vient de l'API si tu l'as ajouté, sinon adapte */}
                  {"typeLabel" in request
                    ? (request as any).typeLabel
                    : "Congé"}
                </TableCell>
                <TableCell>
                  {format(request.startDate, "eee d LLL y", {locale: fr})}{" "}
                  {" - "}
                  {format(request.endDate, "d LLL y", {locale: fr})}
                </TableCell>
                <TableCell>
                  {formatDate(request.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={badgeStatusVariant(request.status)}>
                    {formatStatusLabel(request.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.justificationFile ? (
                    <a
                      href={request.justificationFile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline text-sm"
                    >
                      {"Voir le fichier"}
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {"Aucun"}
                    </span>
                  )}
                </TableCell>
                <TableCell className="max-w-xs">
                  <span className="block truncate text-sm text-muted-foreground">
                    {request.reason || "—"}
                  </span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                        <HugeiconsIcon icon={MoreHorizontalIcon} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={()=>handleView(request)}><HugeiconsIcon icon={ViewIcon}/>{"Voir"}</DropdownMenuItem>
                        <DropdownMenuItem>{"Modifier"}</DropdownMenuItem>
                        <DropdownMenuItem>{"Annuler"}</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
        { activeReq && <ViewLeaveRequest isOpen={view} openChange={setView} request={activeReq}/>}
    </div>
  )
}

export default Page