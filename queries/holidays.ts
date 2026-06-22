// @/queries/holidays.ts
import api from "@/context/api";
import { demoHolidayTypes } from "@/data/temp";
import {
  HolidayRequest,
  EmployeeLeaveBalance,
  HolidayType,
} from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class HolidaysQuery {
  route = "/holidays";

  /**
   * Récupération de toutes les demandes (vue RH / Admin)
   */
  getAllRequests = async (): Promise<Array<HolidayRequest>> => {
    try {
      const response = await api.get(`${this.route}/requests`);
      return response.data.items; // 👈 On renvoie juste la liste
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération des demandes";
      throw new Error(message);
    }
  };

  /**
   * Récupération des demandes d'un employé (self-service)
   */
  getRequestsByUser = async (
    userId: string,
  ): Promise<Array<HolidayRequest>> => {
    try {
      const response = await api.get(`${this.route}/requests?userId=${userId}`);
      return response.data.items;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération des demandes employé";
      throw new Error(message);
    }
  };

  /**
   * Récupération des statistiques RH
   */
  getStats = async (): Promise<{
    totalRequests: number;
    pendingRequests: number;
    acceptedRequests: number;
    rejectedRequests: number;
  }> => {
    try {
      const response = await api.get(`${this.route}/stats`);
      return response.data; // { total, pending, accepted, rejected, byType: [...] }
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération stats congés";
      throw new Error(message);
    }
  };

  /**
   * Récupération du solde de congés d’un employé
   */
  getBalance = async (
    userId: string,
    year?: number,
  ): Promise<EmployeeLeaveBalance> => {
    try {
      const response = await api.get(
        `${this.route}/balance?userId=${userId}${!!year ? `&year=${year}` : ""}`,
      );
      return response.data.balance;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération solde congés";
      throw new Error(message);
    }
  };
  sendRequest = async (
    data: Omit<HolidayRequest, "id" | "requestedDays" | "status">,
  ): Promise<HolidayRequest> => {
    try {
      const response = await api.post(`${this.route}/requests`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur est survenue pendant l'enregistrement de votre requête";
      throw new Error(message);
    }
  };
  editRequest = async (data: {
    request: Omit<HolidayRequest, "id" | "status" | "requestedDays">;
    id: number;
  }): Promise<HolidayRequest> => {
    try {
      const response = await api.put(`${this.route}/requests`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur est survenue pendant l'enregistrement de votre requête";
      throw new Error(message);
    }
  };
  cancelRequest = async (id: number): Promise<{ success: boolean }> => {
    try {
      const response = await api.post(`${this.route}/requests/cancel`, id);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur est survenue pendant l'enregistrement de votre requête";
      throw new Error(message);
    }
  };
  getTypes = async (): Promise<Array<HolidayType>> => {
    try {
      return demoHolidayTypes;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur est survenue pendant l'enregistrement de votre requête";
      throw new Error(message);
    }
  };
}

export function useHolidaysRequestsQuery() {
  const holidaysQuery = new HolidaysQuery();
  return useQuery({
    queryKey: queryKeys.holidays.all(),
    queryFn: holidaysQuery.getAllRequests,
  });
}

export function useHolidaysRequestsByUserQuery(userId: string, enabled: boolean = true) {
  const holidaysQuery = new HolidaysQuery();
  return useQuery({
    queryKey: queryKeys.holidays.byUser(userId),
    queryFn: () => holidaysQuery.getRequestsByUser(userId),
    enabled: enabled && !!userId,
  });
}

export function useHolidaysStatsQuery(enabled: boolean = true) {
  const holidaysQuery = new HolidaysQuery();
  return useQuery({
    queryKey: queryKeys.holidays.stats(),
    queryFn: holidaysQuery.getStats,
    enabled,
  });
}

export function useHolidaysBalanceQuery(userId: string, year?: number, enabled: boolean = true) {
  const holidaysQuery = new HolidaysQuery();
  return useQuery({
    queryKey: queryKeys.holidays.balance(userId, year),
    queryFn: () => holidaysQuery.getBalance(userId, year),
    enabled: enabled && !!userId,
  });
}

export function useSendHolidayRequestMutation() {
  const holidaysQuery = new HolidaysQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: holidaysQuery.sendRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.byUser(variables.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.stats() });
    },
  });
}

export function useEditHolidayRequestMutation() {
  const holidaysQuery = new HolidaysQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: holidaysQuery.editRequest,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.byUser(variables.request.userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.stats() });
    },
  });
}

export function useCancelHolidayRequestMutation() {
  const holidaysQuery = new HolidaysQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: holidaysQuery.cancelRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.holidays.stats() });
    },
  });
}

export function useHolidayTypesQuery() {
  const holidaysQuery = new HolidaysQuery();
  return useQuery({
    queryKey: queryKeys.holidays.types(),
    queryFn: holidaysQuery.getTypes,
  });
}

