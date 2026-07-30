import api from "@/context/api";
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
  create = async (data: FormData): Promise<any> => {
    try {
      const response = await api.post(this.route, data, {
        headers: { "Content-Type": "multipart/form-data" },
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