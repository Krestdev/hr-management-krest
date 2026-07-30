import api from "@/context/api";
import { Files } from "@/types/types";

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

