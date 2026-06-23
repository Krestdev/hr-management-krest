import api from "@/context/api";
import { Employee, Leaves } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

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

// Hook pour récupérer tous les employés
export function useEmployeesQuery(
  page: number,
  limit: number,
  companyId: string,
  departmentId?: string,
  positionUuid?: string,
  status: string = "ACTIVE",
  search?: string,
  includeInactive?: boolean,
  includeSensitive: boolean = false,
  enabled: boolean = true
) {
  const userQuery = new UserQuery();
  return useQuery({
    queryKey: queryKeys.employees.all({
      page,
      limit,
      companyId,
      departmentId,
      positionUuid,
      status,
      search,
      includeInactive,
      includeSensitive,
    }),
    queryFn: () =>
      userQuery.getAll(
        page,
        limit,
        companyId,
        departmentId,
        positionUuid,
        status,
        search,
        includeInactive,
        includeSensitive
      ),
    enabled: enabled && companyId !== undefined,
  });
}

// Hook pour récupérer un employé par son id
export function useEmployeeQuery(id: string, enabled: boolean = true) {
  const userQuery = new UserQuery();
  return useQuery({
    queryKey: queryKeys.employees.detail(id),
    queryFn: () => userQuery.getById(id),
    enabled: enabled && !!id,
  });
}

// Hook pour créer un employé
export function useCreateEmployeeMutation() {
  const userQuery = new UserQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}

// Hook pour mettre à jour un employé
export function useUpdateEmployeeMutation() {
  const userQuery = new UserQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      userQuery.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(data.data.uuid) });
    },
  });
}

// Hook pour récupérer les informations personnelles d'un employé
export function useEmployeePersonalInfoQuery(id: string, enabled: boolean = true) {
  const userQuery = new UserQuery();
  return useQuery({
    queryKey: queryKeys.employees.personal(id),
    queryFn: () => userQuery.getPersonnalInformation(id),
    enabled: enabled && !!id,
  });
}

// Hook pour supprimer un employé
export function useDeleteEmployeeMutation() {
  const userQuery = new UserQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userQuery.delete(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(data.data.uuid) });
    },
  });
}

// Hook pour réactiver un employé
export function useReactivateEmployeeMutation() {
  const userQuery = new UserQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userQuery.reactivate(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.detail(data.data.uuid) });
    },
  });
}

// Hook pour récupérer les demandes de congés d'un employé
export function useEmployeeLeaveRequestsQuery(id: string, enabled: boolean = true) {
  const userQuery = new UserQuery();
  return useQuery({
    queryKey: queryKeys.employees.leaves(id),
    queryFn: () => userQuery.getLeaveRequests(id),
    enabled: enabled && !!id,
  });
}

// Hook pour récupérer le solde de congés d'un employé
export function useEmployeeLeaveBalanceQuery(id: string, enabled: boolean = true) {
  const userQuery = new UserQuery();
  return useQuery({
    queryKey: queryKeys.employees.leaveBalance(id),
    queryFn: () => userQuery.getLeaveBalance(id),
    enabled: enabled && !!id,
  });
}

// Hook pour mettre à jour le solde de congés d'un employé
export function useUpdateEmployeeLeaveQuotaMutation() {
  const userQuery = new UserQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      userQuery.updateLeaveBalanceQuota(id, date),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.employees.leaveBalance(variables.id) });
    },
  });
}

