import api from "@/context/api";
import { Recruitment } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import useKizunaStore from "@/context/store";

export default class RecruitmentQuery {
  route = "/recruitment";

  // ✅ GET ALL
  getAll = async (companyId?: string): Promise<any> => {
    try {
      const response = await api.get(this.route, {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la récupération des recrutements";
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
        "Une erreur s'est produite lors de la récupération du recrutement";
      throw new Error(message);
    }
  };

  // ✅ CREATE
  create = async (
    data: Omit<Recruitment, "uuid" | "createdAt" | "updatedAt">
  ): Promise<any> => {
    try {
      const response = await api.post(this.route, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la création du recrutement";
      throw new Error(message);
    }
  };

  // ✅ UPDATE
  update = async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Omit<Recruitment, "uuid" | "createdAt" | "updatedAt">>;
  }): Promise<any> => {
    try {
      const response = await api.patch(`${this.route}/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la mise à jour du recrutement";
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
        "Une erreur s'est produite lors de la suppression du recrutement";
      throw new Error(message);
    }
  };
}

// Hook pour récupérer tous les recrutements
export function useRecruitmentsQuery(companyId?: string, enabled: boolean = true) {
  const storeCompanyId = useKizunaStore((state) => state.selectedCompanyId);
  const activeCompanyId = storeCompanyId === "all" ? companyId : storeCompanyId;

  const recruitmentQuery = new RecruitmentQuery();
  return useQuery({
    queryKey: queryKeys.recruitments.all(activeCompanyId),
    queryFn: () => recruitmentQuery.getAll(activeCompanyId === "all" ? undefined : activeCompanyId),
    enabled: enabled,
  });
}

// Hook pour récupérer un recrutement par son id
export function useRecruitmentQuery(id: string, enabled: boolean = true) {
  const recruitmentQuery = new RecruitmentQuery();
  return useQuery({
    queryKey: queryKeys.recruitments.detail(id),
    queryFn: () => recruitmentQuery.getById(id),
    enabled: enabled && !!id,
  });
}

// Hook pour créer un recrutement
export function useCreateRecruitmentMutation() {
  const recruitmentQuery = new RecruitmentQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruitmentQuery.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all() });
    },
  });
}

// Hook pour mettre à jour un recrutement
export function useUpdateRecruitmentMutation() {
  const recruitmentQuery = new RecruitmentQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruitmentQuery.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.detail(variables.id) });
    },
  });
}

// Hook pour supprimer un recrutement
export function useDeleteRecruitmentMutation() {
  const recruitmentQuery = new RecruitmentQuery();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: recruitmentQuery.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.recruitments.all() });
    },
  });
}