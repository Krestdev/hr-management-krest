import api from "@/context/api";
import { Files } from "@/types/types"; // adapte le chemin si besoin
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class DocumentQuery {
  route = "/documents";

  // ✅ GET ALL DOCUMENTS
  getAll = async (): Promise<{ success: boolean; items: Files[]; count: number }> => {
    try {
      const response = await api.get(this.route);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      throw new Error(message);
    }
  };

  // ✅ GET MY DOCUMENTS
  getMine = async (
    userId: string
  ): Promise<{ success: boolean; items: Files[]; count: number }> => {
    try {
      const response = await api.get(`${this.route}/mine`, {
        params: { userId },
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      throw new Error(message);
    }
  };

  // ✅ GET DOCUMENT BY ID
  getById = async (
    id: number
  ): Promise<{ success: boolean; item: Files }> => {
    try {
      const response = await api.get(`${this.route}/${id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite";

      throw new Error(message);
    }
  };
}

export function useDocumentsQuery() {
    const documentQuery = new DocumentQuery();
    return useQuery({
        queryKey: queryKeys.documents.all(),
        queryFn: documentQuery.getAll,
    });
}

export function useMyDocumentsQuery(userId: string, enabled: boolean = true) {
    const documentQuery = new DocumentQuery();
    return useQuery({
        queryKey: queryKeys.documents.mine(userId),
        queryFn: () => documentQuery.getMine(userId),
        enabled: enabled && !!userId,
    });
}

export function useDocumentByIdQuery(id: number, enabled: boolean = true) {
    const documentQuery = new DocumentQuery();
    return useQuery({
        queryKey: queryKeys.documents.detail(id),
        queryFn: () => documentQuery.getById(id),
        enabled: enabled && !!id,
    });
}

