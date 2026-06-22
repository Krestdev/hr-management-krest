import api from "@/context/api";
import { Employee, Leaves } from "@/types/types";

export default class UserQuery {
  route = "/employees";

  // create employee
  create = async (data: Omit<Employee, "uuid" | "createdAt" | "updatedAt">): Promise<{ user: Employee; token: string }> => {
    try {
      const response = await api.post(`${this.route}`, data);
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
  getAll = async (page: number, limit: number, companyId: string, departmentId?: string, positionUuid?: string, status: string = "ACTIVE", search?: string, includeInactive?: boolean, includeSensitive: boolean = false): Promise<{ data: Employee[]; meta: { total: number, page: number, limit: number, totalPages: number, includeSensitive: boolean } }> => {
    try {
      const response = await api.get(`${this.route}?page=${page}&limit=${limit}&companyId=${companyId}&departmentId=${departmentId}&positionUuid=${positionUuid}&status=${status}&search=${search}&includeInactive=${includeInactive}&includeSensitive=${includeSensitive}`);
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
  getById = async (id: string): Promise<Employee> => {
    try {
      const response = await api.get(`${this.route}/${id}`);
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
  update = async (id: string, data: Partial<Omit<Employee, "uuid" | "createdAt" | "updatedAt">>): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.patch(`${this.route}/${id}`, data);
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
  getPersonnalInformation = async (id: string): Promise<{ data: Employee; token: string }> => {
    try {
      const response = await api.get(`${this.route}/${id}/personnal`);
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
  getLeaveRequests = async (id: string): Promise<{ data: Leaves[]; token: string }> => {
    try {
      const response = await api.get(`${this.route}/${id}/leave-requests`);
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
  getLeaveBalance = async (id: string): Promise<{ data: Leaves[]; token: string }> => {
    try {
      const response = await api.get(`${this.route}/${id}/leave-balance`);
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
