"use client";

import { Button } from "@/components/ui/button";
import { Presence, PresenceFlag } from "@/types/types";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PresencePDF from "./PresencePDF";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

type Props = {
  userName: string;
  monthLabel: string;
  presences: Presence[];
  onClose: () => void;
};

export default function DetailPresence({
  presences,
  onClose,
  userName,
  monthLabel,
}: Props) {
  // Sort presences by date ascending
  const sortedPresences = [...presences].sort((a, b) => {
    const d1 = new Date(a.checkIn || a.createdAt).getTime();
    const d2 = new Date(b.checkIn || b.createdAt).getTime();
    return d1 - d2;
  });

  return (
    <div className="w-full flex flex-col h-full overflow-hidden bg-white">
      {/* CALENDAR GRID */}
      <div className="overflow-y-auto flex-1 px-6 py-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="inline-block px-3 py-1 w-fit rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {monthLabel}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {sortedPresences.map((p) => {
              const dateStr = p.checkIn || p.createdAt;
              if (!dateStr) return null;

              const d = parseISO(dateStr);
              const dayAbbr = format(d, "E", { locale: fr });
              const dayNum = format(d, "dd");

              const isLate = p.status.includes("LATE");
              const isAbsent = p.status.includes("ABSENT");
              const isPresent = p.status.includes("PRESENT") || p.status.includes("EXCEPTIONAL") || p.status.includes("VALID") || p.status.includes("FIELD");
              const isLeave = p.status.includes("ON_LEAVE");

              let bgColor = "bg-gray-100 text-gray-800";
              if (isLeave) {
                bgColor = "bg-violet-600 text-white";
              } else if (isLate) {
                bgColor = "bg-orange-100 text-orange-900";
              } else if (isPresent) {
                bgColor = "bg-green-100 text-green-900";
              } else if (isAbsent) {
                bgColor = "bg-red-100 text-red-900";
              }

              return (
                <div
                  key={p.uuid}
                  className={cn(
                    "flex flex-col items-center justify-center w-10 px-1 py-1.5 gap-0.5 rounded-xl",
                    bgColor
                  )}
                >
                  <span className="text-xs font-medium capitalize opacity-80">{dayAbbr}</span>
                  <span className="text-xl font-bold">{dayNum}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-100 text-green-900 font-medium">
            À l'heure
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-100 text-orange-900 font-medium">
            En retard
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-100 text-red-900 font-medium">
            Absent
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-violet-600 text-white font-medium">
            Congé
          </div>
        </div>
      </div>

      {/* FOOTER & LEGEND */}
      <div className="flex items-center justify-between p-4 bg-white border-t flex-none">
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <PDFDownloadLink
            document={
              <PresencePDF
                userName={userName}
                monthLabel={monthLabel}
                presences={presences}
              />
            }
            fileName={`presence-${userName}-${monthLabel}.pdf`}
          >
            {({ loading }) => (
              <Button className="bg-orange-600 hover:bg-orange-700">
                {loading ? "Génération..." : "Exporter PDF"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
