"use client";
import { DateRangePicker } from "@/components/dateRagePicker";
import Header from "@/components/header";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import React, { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar02Icon,
} from "@hugeicons/core-free-icons";
import { demoPayslips } from "@/data/temp";
import PaySlipCard from "@/components/pay-slip";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading-comp";
import ErrorComponent from "@/components/error-comp";


function Page() {
  const {data, isLoading, isSuccess, isError} = useQuery({
    queryKey: ["payslips"],
    queryFn: async () =>demoPayslips
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  function resetFilters() {
    setDateRange(undefined);
  }

  const filteredPayslips = useMemo(() => {
    if(!data || !isSuccess) return [];
    if (!dateRange?.from && !dateRange?.to) return data;

    const from = dateRange.from;
    const to = dateRange.to;

    return data.filter((p) => {
      const d = p.createdAt;
      if (from && !to) return d >= from;
      if (!from && to) return d <= to;
      if (from && to) return d >= from && d <= to;
      return true;
    });
  }, [dateRange, data, isSuccess]);

  if(isLoading){
    return (
      <LoadingComponent/>
    )
  }
  if(isError){
    return <ErrorComponent/>
  }
  return (
    <div className="grid gap-4 sm:gap-6">
      <Header variant={"primary"} title="Mes Bulletins de Paie" />

      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Liste"}</h3>
          <div className="filters">
            <div className="filter-group">
              <Label htmlFor="date">{"Période"}</Label>
              <DateRangePicker
                date={dateRange}
                onChange={setDateRange}
                className="min-w-40"
              />
            </div>
            <Button variant="outline" onClick={resetFilters}>
              {"Réinitialiser"}
            </Button>
          </div>
        </div>

        {/* Contenu */}
        {filteredPayslips.length === 0 ? (
          <div className="py-10">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HugeiconsIcon icon={Calendar02Icon} />
                </EmptyMedia>
                <EmptyTitle>{"Aucun bulletin disponible"}</EmptyTitle>
                <EmptyDescription>
                  {"Aucun bulletin ne correspond à la période sélectionnée."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPayslips.map((payslip) => (
              <PaySlipCard key={payslip.id} {...payslip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
