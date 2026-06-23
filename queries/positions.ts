import api from "@/context/api";
import { Position } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class PositionQuery {
  route = "/positions";

  create = async (data: Omit<Position, "uuid" | "createdAt" | "updatedAt">): Promise<Position> => {
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
  };

  getAll = async (companyId?: string): Promise<Position[]> => {
    try {
      const response = await api.get(`${this.route}`, {
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
  };

  getById = async (id: string, companyId?: string): Promise<Position> => {
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
  };

  update = async (id: string, data: Partial<Omit<Position, "uuid" | "createdAt" | "updatedAt">>): Promise<Position> => {
    try {
      const response = await api.put(`${this.route}/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  };

  delete = async (id: string): Promise<void> => {
    try {
      await api.delete(`${this.route}/${id}`);
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  };

  assignManager = async (positionId: string, managerId: string): Promise<Position> => {
    try {
      const response = await api.put(`${this.route}/${positionId}/manager/${managerId}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      // On propage une erreur propre
      throw new Error(message);
    }
  };
}

// Hook pour récupérer toutes les positions
export function usePositionsQuery(companyId?: string, enabled: boolean = true) {
  const positionQuery = new PositionQuery();
  return useQuery({
    queryKey: queryKeys.positions.all(companyId),
    queryFn: () => positionQuery.getAll(companyId),
    enabled: enabled,
  });
}

// Hook pour récupérer une position par son id
export function usePositionQuery(id: string, companyId?: string, enabled: boolean = true) {
  const positionQuery = new PositionQuery();
  return useQuery({
    queryKey: queryKeys.positions.detail(id, companyId),
    queryFn: () => positionQuery.getById(id, companyId),
    enabled: enabled && !!id && companyId !== undefined,
  });
}

// Hook pour créer une position
export function useCreatePositionMutation() {
  const positionQuery = new PositionQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: positionQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.all() });
    },
  });
}

// Hook pour modifier une position
export function useUpdatePositionMutation() {
  const positionQuery = new PositionQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Position, "uuid" | "createdAt" | "updatedAt">> }) =>
      positionQuery.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.detail(data.uuid) });
    },
  });
}

// Hook pour supprimer une position
export function useDeletePositionMutation() {
  const positionQuery = new PositionQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: positionQuery.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.positions.all() });
    },
  });
}

