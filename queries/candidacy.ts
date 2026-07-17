import api from "@/context/api";
import { Candidacy } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class CandidacyQuery {
  route = "/recruitment/candidacy";

  // ✅ GET ALL (with optional recruitment filter)
  getAll = async (recruitmentUuid?: string): Promise<any> => {
    try {
      const endpoint = recruitmentUuid 
        ? `${this.route}/recruitment/${recruitmentUuid}` 
        : this.route;
      const response = await api.get(endpoint);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la récupération des candidatures";
      throw new Error(message);
    }
  };

  // ✅ GET BY ID (GET ONE)
  getById = async (id: string): Promise<any> => {
    try {
      const response = await api.get(`${this.route}/${id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la récupération de la candidature";
      throw new Error(message);
    }
  };

  // ✅ CREATE
  create = async (
    data: Omit<Candidacy, "uuid" | "createdAt" | "updatedAt"> | FormData
  ): Promise<any> => {
    try {
      const response = await api.post(this.route, data, {
        headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la création de la candidature";
      throw new Error(message);
    }
  };

  // ✅ UPDATE STATUS
  updateStatus = async ({
    id,
    status,
  }: {
    id: string;
    status: string;
  }): Promise<any> => {
    try {
      const response = await api.patch(`${this.route}/${id}/status`, { status });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la mise à jour de la candidature";
      throw new Error(message);
    }
  };

  // ✅ DELETE
  delete = async (id: string): Promise<any> => {
    try {
      const response = await api.delete(`${this.route}/${id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la suppression de la candidature";
      throw new Error(message);
    }
  };
}

export function candidaciesQueryOptions(recruitmentUuid?: string) {
  const candidacyQuery = new CandidacyQuery();
  return {
    queryKey: queryKeys.candidacies.all(recruitmentUuid),
    queryFn: () => candidacyQuery.getAll(recruitmentUuid),
  };
}

// Hook pour récupérer toutes les candidatures (avec filtre optionnel sur le recrutement)
export function useCandidaciesQuery(recruitmentUuid?: string) {
  return useQuery(candidaciesQueryOptions(recruitmentUuid));
}

// Hook pour récupérer une candidature par son id
export function useCandidacyQuery(id: string, enabled: boolean = true) {
  const candidacyQuery = new CandidacyQuery();
  return useQuery({
    queryKey: queryKeys.candidacies.detail(id),
    queryFn: () => candidacyQuery.getById(id),
    enabled: enabled && !!id,
  });
}

// Hook pour créer une candidature
export function useCreateCandidacyMutation() {
  const candidacyQuery = new CandidacyQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidacyQuery.create,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all() });
      
      const recruitmentUuid = variables instanceof FormData 
        ? variables.get('recruitmentUuid') as string 
        : variables.recruitmentUuid;

      if (recruitmentUuid) {
        queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all(recruitmentUuid) });
      }
    },
  });
}

// Hook pour mettre à jour le statut d'une candidature
export function useUpdateCandidacyStatusMutation() {
  const candidacyQuery = new CandidacyQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidacyQuery.updateStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.detail(variables.id) });
    },
  });
}

// Hook pour supprimer une candidature
export function useDeleteCandidacyMutation() {
  const candidacyQuery = new CandidacyQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: candidacyQuery.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.candidacies.all() });
    },
  });
}