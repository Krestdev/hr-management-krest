import api from "@/context/api";
import { Employee, Leaves } from "@/types/types";

export default class UserQuery {
  route = "/employees";

  // create employee
  create = async (data: FormData): Promise<{ user: Employee; token: string }> => {
    try {
      const response = await api.post(`${this.route}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // get all employee with pagination and filters
  getAll = async (page: number, limit: number, companyId?: string, departmentId?: string, positionUuid?: string, status: string = "ACTIVE", search?: string, includeInactive?: boolean, includeSensitive: boolean = false): Promise<{ data: Employee[]; meta: { total: number, totalAssigned: number, page: number, limit: number, totalPages: number, includeSensitive: boolean } }> => {
    try {
      const response = await api.get(`${this.route}`, {
        params: {
          page, limit, companyId, departmentId, positionUuid, status, search, includeInactive, includeSensitive
        }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // get employee by id
  getById = async (id: string, companyId?: string): Promise<Employee> => {
    try {
      const response = await api.get(`${this.route}/${id}`, {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // update imployee informations
  update = async (id: string, data: FormData): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.patch(`${this.route}/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  updatePassword = async (id: string, data: { newPassword: string }): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.patch(`${this.route}/${id}/password`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // get employee personnal information (sensitive data)
  getPersonnalInformation = async (id: string, companyId?: string): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.get(`${this.route}/${id}/personnal`, {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // delete employee (soft + free up position)
  delete = async (id: string): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.delete(`${this.route}/${id}/deactivate`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // reactivate employee
  reactivate = async (id: string): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.patch(`${this.route}/${id}/reactivate`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // get all leave requests for an employee
  getLeaveRequests = async (id: string, companyId?: string): Promise<{ data: Leaves[]; token: string }> => {
    try {
      const response = await api.get(`${this.route}/${id}/leave-requests`, {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // get leave balance for an employee
  getLeaveBalance = async (id: string, companyId?: string): Promise<{ data: Leaves[]; token: string }> => {
    try {
      const response = await api.get(`${this.route}/${id}/leave-balance`, {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }

  // update leave balance quota for an employee (admin only)
  updateLeaveBalanceQuota = async (id: string, date: string): Promise<{ data: Leaves[]; token: string }> => {
    try {
      const response = await api.put(`${this.route}/${id}/leave-balance-quota`, date);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  }
}