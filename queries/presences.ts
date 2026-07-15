import api from "@/context/api";
import { Presence } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class PresenceQuery {
  route = "/attendance";

  // ✅ GET ALL PRESENCES
  getAll = async (month?: number, year?: number): Promise<Presence[]> => {
    try {
      const url = month && year ? `${this.route}?month=${month}&year=${year}` : this.route;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors du chargement des présences";

      throw new Error(message);
    }
  };

  // ✅ GET PRESENCES BY USER ID
  getByUserId = async (
    userId: string,
    month?: number,
    year?: number
  ): Promise<Presence[]> => {
    try {
      const url = month && year 
        ? `${this.route}/employee/${userId}?month=${month}&year=${year}`
        : `${this.route}/employee/${userId}`;
      const response = await api.get(url);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors du chargement des présences utilisateur";

      throw new Error(message);
    }
  };

  // ✅ CREATE PRESENCE
  post = async (
    data: Omit<Presence, "id" | "createdAt" | "updatedAt">
  ): Promise<{
    success: boolean;
    item: Presence;
  }> => {
    try {
      const response = await api.post(this.route, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la création de la présence";

      throw new Error(message);
    }
  };

  // ✅ CREATE MANY PRESENCES
  postMany = async ({
    data,
    month,
    year,
  }: {
    data: Omit<Presence, "id" | "createdAt" | "updatedAt">[];
    month: number;
    year: number;
  }): Promise<any> => {
    try {
      const response = await api.post(`/attendance/batch?month=${month}&year=${year}`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la création en masse des présences";

      throw new Error(message);
    }
  };
}

// Hook pour récupérer toutes les présences
export function usePresencesQuery(month?: number, year?: number) {
  const presenceQuery = new PresenceQuery();
  return useQuery({
    queryKey: [...queryKeys.presences.all(), month, year],
    queryFn: () => presenceQuery.getAll(month, year),
  });
}

// Hook pour récupérer les présences par id utilisateur
export function usePresencesByUserIdQuery(userId: string, month?: number, year?: number, enabled: boolean = true) {
  const presenceQuery = new PresenceQuery();
  return useQuery({
    queryKey: [...queryKeys.presences.byUserId(userId), month, year],
    queryFn: () => presenceQuery.getByUserId(userId, month, year),
    enabled: enabled && !!userId,
  });
}

// Hook pour créer une présence
export function useCreatePresenceMutation() {
  const presenceQuery = new PresenceQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: presenceQuery.post,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.presences.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.presences.byUserId(variables.userId) });
    },
  });
}

// Hook pour créer plusieurs présences en masse
export function useCreateManyPresencesMutation() {
  const presenceQuery = new PresenceQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: presenceQuery.postMany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.presences.all() });
    },
  });
}

