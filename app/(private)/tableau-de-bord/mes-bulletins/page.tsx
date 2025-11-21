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
  Download04Icon,
  EyeIcon,
} from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// ---- Types & données mock ----
type Payslip = {
  id: number;
  month: number; // 1-12
  year: number;
  downloads: number;
  fileUrl: string;
  createdAt: Date; // pour le filtrage
};

const demoPayslips: Payslip[] = [
  {
    id: 1,
    month: 12,
    year: 2024,
    downloads: 3,
    fileUrl: "/uploads/bulletins/2024-12.pdf",
    createdAt: new Date("2024-12-05"),
  },
  {
    id: 2,
    month: 11,
    year: 2024,
    downloads: 2,
    fileUrl: "/uploads/bulletins/2024-11.pdf",
    createdAt: new Date("2024-11-05"),
  },
  {
    id: 3,
    month: 10,
    year: 2024,
    downloads: 1,
    fileUrl: "/uploads/bulletins/2024-10.pdf",
    createdAt: new Date("2024-10-05"),
  },
  {
    id: 4,
    month: 9,
    year: 2024,
    downloads: 4,
    fileUrl: "/uploads/bulletins/2024-09.pdf",
    createdAt: new Date("2024-09-05"),
  },
  {
    id: 5,
    month: 8,
    year: 2024,
    downloads: 3,
    fileUrl: "/uploads/bulletins/2024-08.pdf",
    createdAt: new Date("2024-08-05"),
  },
  {
    id: 6,
    month: 7,
    year: 2024,
    downloads: 2,
    fileUrl: "/uploads/bulletins/2024-07.pdf",
    createdAt: new Date("2024-07-05"),
  },
  {
    id: 7,
    month: 6,
    year: 2024,
    downloads: 1,
    fileUrl: "/uploads/bulletins/2024-06.pdf",
    createdAt: new Date("2024-06-05"),
  },
  {
    id: 8,
    month: 5,
    year: 2024,
    downloads: 0,
    fileUrl: "/uploads/bulletins/2024-05.pdf",
    createdAt: new Date("2024-05-05"),
  },
];


function Page() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  function resetFilters() {
    setDateRange(undefined);
  }

  const filteredPayslips = useMemo(() => {
    if (!dateRange?.from && !dateRange?.to) return demoPayslips;

    const from = dateRange.from;
    const to = dateRange.to;

    return demoPayslips.filter((p) => {
      const d = p.createdAt;
      if (from && !to) return d >= from;
      if (!from && to) return d <= to;
      if (from && to) return d >= from && d <= to;
      return true;
    });
  }, [dateRange]);

  return (
    <div className="grid gap-4 sm:gap-6">
      <Header variant={"primary"} title="Mes Bulletins de Paie" />

      <div className="card-1">
        <div className="card-1-header2">
          <h3>{"Liste"}</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
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
              <div
                key={payslip.id}
                className="flex flex-col justify-between rounded-2xl border bg-white px-4 py-3 shadow-sm border-sky-100"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground first-letter:uppercase">
                      {format(payslip.createdAt, "MMMM yyyy", {locale: fr})}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      type="button"
                      onClick={() => {
                        // TODO: prévisualisation
                        console.log("preview", payslip.fileUrl);
                      }}
                    >
                      <HugeiconsIcon icon={EyeIcon} className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      type="button"
                      onClick={() => {
                        // TODO: téléchargement
                        console.log("download", payslip.fileUrl);
                      }}
                    >
                      <HugeiconsIcon
                        icon={Download04Icon}
                        className="h-3.5 w-3.5"
                      />
                    </Button>
                  </div>
                </div>

                {/* Nombre + label */}
                <div className="mt-4">
                  <div className="text-3xl font-semibold leading-none">
                    {String(payslip.downloads).padStart(2, "0")}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {"Téléchargements"}
                  </p>
                </div>

                {/* Ligne colorée bas de carte */}
                <div className="mt-4 h-0.5 w-full rounded-full bg-sky-300" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
