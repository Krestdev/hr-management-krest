import api from "@/context/api";
import { Files } from "@/types/types"; // adapte le chemin si besoin

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
    userId: number
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
