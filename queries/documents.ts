import api from "@/context/api";
import { Files } from "@/types/types"; // adapte le chemin si besoin
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class DocumentQuery {
  route = "/documents";

  // ✅ GET ALL DOCUMENTS
  getAll = async (companyId?: string): Promise<{ success: boolean; items: Files[]; count: number }> => {
    try {
      const response = await api.get(this.route, {
        params: { companyId }
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

  // ✅ GET MY DOCUMENTS
  getMine = async (
    userId: string,
    companyId?: string
  ): Promise<{ success: boolean; items: Files[]; count: number }> => {
    try {
      const response = await api.get(`${this.route}/mine`, {
        params: { userId, companyId },
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
    id: number,
    companyId?: string
  ): Promise<{ success: boolean; item: Files }> => {
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

      throw new Error(message);
    }
  };
}

// Hook pour récupérer tous les documents
export function useDocumentsQuery(companyId?: string, enabled: boolean = true) {
  const documentQuery = new DocumentQuery();
  return useQuery({
    queryKey: queryKeys.documents.all(companyId),
    queryFn: () => documentQuery.getAll(companyId),
    enabled: enabled && companyId !== undefined,
  });
}

// Hook pour récupérer les documents d'un utilisateur
export function useMyDocumentsQuery(userId: string, companyId?: string, enabled: boolean = true) {
  const documentQuery = new DocumentQuery();
  return useQuery({
    queryKey: queryKeys.documents.mine(userId, companyId),
    queryFn: () => documentQuery.getMine(userId, companyId),
    enabled: enabled && !!userId && companyId !== undefined,
  });
}

// Hook pour récupérer un document par son id
export function useDocumentByIdQuery(id: number, companyId?: string, enabled: boolean = true) {
  const documentQuery = new DocumentQuery();
  return useQuery({
    queryKey: queryKeys.documents.detail(id, companyId),
    queryFn: () => documentQuery.getById(id, companyId),
    enabled: enabled && !!id && companyId !== undefined,
  });
}

