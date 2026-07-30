import api from "@/context/api";
import { Payslip } from "@/types/types";

export default class PayslipQuery {
  route = "/payslips";

  getAll = async (companyId: string): Promise<Payslip[]> => {
    const res = await api.get<Payslip[]>(`${this.route}/company/${companyId}`);
    return res.data;
  };

  getOne = async (uuid: string): Promise<Payslip> => {
    const res = await api.get<Payslip>(`${this.route}/${uuid}`);
    return res.data;
  };


  getByEmployeeUuid = async (employeeUuid: string): Promise<Payslip[]> => {
    const res = await api.get<Payslip[]>(`${this.route}/employee/${employeeUuid}`);
    return res.data;
  };

  download = async (uuid: string): Promise<Blob> => {
    const res = await api.get<Blob>(`${this.route}/${uuid}/download`, {
      responseType: "blob"
    });
    return res.data;
  };

  generate = async (payrollId: string): Promise<Payslip> => {
    const res = await api.post<Payslip>(`${this.route}/generate/${payrollId}`);
    return res.data;
  };
}

