import { Payslip } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { demoPayslips } from "@/data/temp";

export class PayslipQuery {
  // ✅ GET ALL PAYSLIPS (MOCKED)
  getAll = async (): Promise<Payslip[]> => {
    return demoPayslips;
  };
}
// Hook pour récupérer tous les bulletins de paie
export function usePayslipsQuery() {
  const payslipQuery = new PayslipQuery();
  return useQuery({
    queryKey: queryKeys.payslips.all(),
    queryFn: payslipQuery.getAll,
  });
}
