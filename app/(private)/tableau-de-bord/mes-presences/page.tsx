'use client'
import { DateRangePicker } from '@/components/dateRagePicker';
import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import useKizunaStore from '@/context/store'
import { cn, PRESENCE_FLAGS } from '@/lib/utils';
import PresenceQuery from '@/queries/presences';
import { PresenceFlag, PresenceRecord } from '@/types/types';
import { Calendar02Icon, SearchVisualIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import React, { useMemo, useState } from 'react'
import { DateRange } from 'react-day-picker';
import Remotely from './remotely';
import Header from '@/components/header';

function Page() {
    const { user } = useKizunaStore();
    const presenceQuery = new PresenceQuery();
    const { data, isSuccess } = useQuery({
        queryKey: ["presences", user?.id],
        queryFn: async()=>presenceQuery.getByUser(user?.id ?? 0),
        enabled: !!user
    });

    const [away, setAway] = useState<boolean>(false);
    const [statusFilter, setStatusFilter] = useState<PresenceFlag | "all">("all");
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
      });

      const filteredData = useMemo(() => {
        if (!isSuccess || !data) return [];
      
        return data
          .filter((presence) => {
            // ----- filtre statut -----
            const matchStatus =
              statusFilter === "all" ? true : presence.flags.includes(statusFilter);
      
            // ----- filtre dates -----
            const from = dateRange?.from;
            const to = dateRange?.to;
      
            // attention si ton API renvoie des string, pense à caster :
            const start = new Date(presence.date);
      
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
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }, [isSuccess, data, statusFilter, dateRange]);

      function hasFlag(p: PresenceRecord, flag: PresenceFlag) {
            return p.flags.includes(flag);
        }

        const handleResetFilters = () => {
            setStatusFilter("all");
            setDateRange({ from: undefined, to: undefined });
        };

      if(isSuccess)
  return (
    <div className="grid gap-4 sm:gap-6">
        <Header variant={"primary"} title="Mes Présences"/>
        <div className="card-1">
            <div className="card-1-header2">
                <h3>{"Présences"}</h3>
                <div className="filters">
                    <div className="filter-group">
                        <Label htmlFor='status'>{"Statut"}</Label>
                        <Select name="status" value={statusFilter === "all" ? "all" : statusFilter} 
                        onValueChange={(value) =>
                            setStatusFilter(
                            value === "all" ? "all" : (value as PresenceFlag)
                            )
                        }>
                            <SelectTrigger className="min-w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{"Tous"}</SelectItem>
                                {
                                  PRESENCE_FLAGS.map((item)=>(
                                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                                  ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="filter-group">
                        <Label htmlFor="date">{"Période"}</Label>
                        <DateRangePicker
                            date={dateRange}
                            onChange={setDateRange}
                            className="min-w-40"/>
                    </div>
                    <Button variant={"primary"} onClick={()=>setAway(prev=>!prev)}>{"Marquer sur le terrain"}</Button>
                </div>
            </div>
            {/**Content */}
            {
                data.length === 0 ?
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                            <HugeiconsIcon icon={Calendar02Icon} />
                        </EmptyMedia>
                        <EmptyTitle>{"Aucune donnée enregistrée"}</EmptyTitle>
                        <EmptyDescription>{"Nous ne disposons pas de donnée relative à votre état de présence"}</EmptyDescription>
                    </EmptyHeader>
                </Empty>
                :
                <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{"Jour"}</TableHead>
                <TableHead className="text-center">{"Présent"}</TableHead>
                <TableHead className="text-center">{"Retard"}</TableHead>
                <TableHead className="text-center">{"Absent"}</TableHead>
                <TableHead className="text-center">{"Exceptionnelle"}</TableHead>
                <TableHead className="text-center">{"Terrain"}</TableHead>
                <TableHead className="text-center">{"Congé"}</TableHead>
                <TableHead className="text-center">
                  {"Heure d'arrivée"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="p-6">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant={"icon"}>
                          <HugeiconsIcon icon={SearchVisualIcon} />
                        </EmptyMedia>
                        <EmptyTitle>
                          {"Aucune donnée correspondante"}
                        </EmptyTitle>
                        <EmptyDescription>
                          {"Aucun résultat ne correspond à vos filtres."}
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button onClick={handleResetFilters}>
                          {"Réinitialiser les filtres"}
                        </Button>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((presence) => {
                  const isLate = hasFlag(presence, "LATE");
                  const checkInDisplay =
                    presence.checkIn ?? "--:--";

                  return (
                    <TableRow key={presence.id}>
                      <TableCell>{format(presence.date, "eee d LLL y", {locale: fr})}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            hasFlag(presence, "PRESENT")
                              ? "text-emerald-600"
                              : "text-pink-500"
                          )}
                        >
                          {hasFlag(presence, "PRESENT") ? "✔" : "✘"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            hasFlag(presence, "LATE")
                              ? "text-emerald-600"
                              : "text-pink-500"
                          )}
                        >
                          {hasFlag(presence, "LATE") ? "✔" : "✘"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            hasFlag(presence, "ABSENT")
                              ? "text-emerald-600"
                              : "text-pink-500"
                          )}
                        >
                          {hasFlag(presence, "ABSENT") ? "✔" : "✘"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            hasFlag(presence, "EXCEPTIONAL")
                              ? "text-emerald-600"
                              : "text-pink-500"
                          )}
                        >
                          {hasFlag(presence, "EXCEPTIONAL") ? "✔" : "✘"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            hasFlag(presence, "FIELD")
                              ? "text-emerald-600"
                              : "text-pink-500"
                          )}
                        >
                          {hasFlag(presence, "FIELD") ? "✔" : "✘"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            hasFlag(presence, "ON_LEAVE")
                              ? "text-emerald-600"
                              : "text-pink-500"
                          )}
                        >
                          {hasFlag(presence, "ON_LEAVE") ? "✔" : "✘"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={cn(
                            "font-semibold",
                            !presence.checkIn
                              ? "text-muted-foreground"
                              : isLate
                              ? "text-red-500"
                              : "text-emerald-600"
                          )}
                        >
                          {checkInDisplay}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
            }
            <Remotely isOpen={away} openChange={setAway} />
        </div>
    </div>
  )
}

export default Page