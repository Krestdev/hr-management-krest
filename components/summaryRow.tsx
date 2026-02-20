
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { LucideCheck, LucideX } from "lucide-react";

type MontantForm = {
  montant: number;
  type: "INDEMNITE" | "PRIME" | "AVANTAGE";
  est_taxable: boolean;
  est_cotisable: boolean;
};

export const SummaryRow = ({
  label,
  montant,
}: {
  label: string;
  montant: MontantForm;
}) => (
  <TableRow>
    <TableCell>{label}</TableCell>
    <TableCell className="text-right">
      {montant.montant.toLocaleString()} FCFA
    </TableCell>
    <TableCell className="text-center">
      {montant.est_taxable ? (
        <LucideCheck className="inline text-green-500" size={20} />
      ) : (
        <LucideX className="inline text-red-500" size={20} />
      )}
    </TableCell>
    <TableCell className="text-center">
      {montant.est_cotisable ? (
        <LucideCheck className="inline text-green-500" size={20} />
      ) : (
        <LucideX className="inline text-red-500" size={20} />
      )}
    </TableCell>
  </TableRow>
);
