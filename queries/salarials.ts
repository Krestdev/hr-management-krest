import api from "@/context/api";
import { Salarial } from "@/types/types";

export default class SalarialQuery {
  route = "/salarial";

  // ✅ GET ALL
  getAll = async (): Promise<{ success: boolean; items: Salarial[]; count: number }> => {
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

  // ✅ GET BY ID
  getById = async (
    id: number
  ): Promise<{ success: boolean; item: Salarial }> => {
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
