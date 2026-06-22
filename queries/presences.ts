import api from "@/context/api";
import { Presence } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class PresenceQuery {
  route = "/presences";

  // ✅ GET ALL PRESENCES
  getAll = async (): Promise<{
    success: boolean;
    items: Presence[];
    count: number;
  }> => {
    try {
      const response = await api.get(this.route);
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
    userId: string
  ): Promise<{
    success: boolean;
    items: Presence[];
    count: number;
  }> => {
    try {
      console.log(userId);
      const response = await api.get(`${this.route}/user/${userId}`);
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
}

export function usePresencesQuery() {
  const presenceQuery = new PresenceQuery();
  return useQuery({
    queryKey: queryKeys.presences.all(),
    queryFn: presenceQuery.getAll,
  });
}

export function usePresencesByUserIdQuery(userId: string, enabled: boolean = true) {
  const presenceQuery = new PresenceQuery();
  return useQuery({
    queryKey: queryKeys.presences.byUserId(userId),
    queryFn: () => presenceQuery.getByUserId(userId),
    enabled: enabled && !!userId,
  });
}

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

