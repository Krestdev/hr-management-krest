"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Presence, PresenceFlag } from "@/types/types";
import { Check, X } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PresencePDF from "./PresencePDF";
import { cn } from "@/lib/utils";

type Props = {
  userName: string;
  monthLabel: string;
  presences: Presence[];
  onClose: () => void;
};

const FLAGS: PresenceFlag[] = [
  "PRESENT",
  "EXCEPTIONAL",
  "VALID",
  "ABSENT",
  "LATE",
  "FIELD",
  "EXCUSED",
  "ON_LEAVE",
];

const flagLabel: Record<PresenceFlag, string> = {
  PRESENT: "Présent",
  EXCEPTIONAL: "Exceptionnel",
  VALID: "Validé",
  ABSENT: "Absent",
  LATE: "Retard",
  FIELD: "Terrain",
  EXCUSED: "Excusé",
  ON_LEAVE: "Congé",
};

export default function DetailPresence({
  presences,
  onClose,
  userName,
  monthLabel,
}: Props) {
  const stats = FLAGS.reduce(
    (acc, f) => {
      acc[f] = 0;
      return acc;
    },
    {} as Record<PresenceFlag, number>,
  );

  presences.forEach((p) => {
    p.statut.forEach((s) => stats[s]++);
  });

  function hasFlag(p: Presence, flag: PresenceFlag) {
    return p.statut.includes(flag);
  }

  return (
    <div className="w-full]">
      {/* TABLE */}
      <div className="p-4">
        <Table>
          <TableHeader className="bg-cyan-700">
            <TableRow>
              <TableHead className="text-white">Jour</TableHead>
              {FLAGS.map((f) => (
                <TableHead key={f} className="text-white text-center">
                  {flagLabel[f]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {presences.map((p) => {
              const d = new Date(p.date);
              const day = d.toLocaleDateString("fr-FR");

              return (
                <TableRow key={p.id}>
                  <TableCell>{day}</TableCell>

                  {FLAGS.map((flag) => (
                    <TableCell key={flag} className="text-center">
                      <span
                        className={cn(
                          "font-semibold",
                          hasFlag(p, flag)
                            ? "text-emerald-600"
                            : "text-pink-500",
                        )}
                      >
                        {hasFlag(p, flag) ? "✔" : "✘"}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}

            {/* TOTAL */}
            <TableRow className="font-bold bg-gray-50">
              <TableCell>Total</TableCell>
              {FLAGS.map((f) => (
                <TableCell key={f} className="text-center">
                  {stats[f]}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* FOOTER */}
      <div className="flex justify-end gap-3 p-4">
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
  );
}
