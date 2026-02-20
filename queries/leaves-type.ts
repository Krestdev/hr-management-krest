import api from "@/context/api";
import { LeavesType } from "@/types/types";

export default class LeavesTypeQuery {
  route = "/leaves-type";

  // ✅ GET ALL LEAVES TYPES
  getAll = async (): Promise<{
    success: boolean;
    items: LeavesType[];
    count: number;
  }> => {
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
  ): Promise<{ success: boolean; item: LeavesType }> => {
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

  // ✅ GET BY CODE (ex: ANNUAL, SICK, etc.)
  getByCode = async (
    code: LeavesType["code"]
  ): Promise<{ success: boolean; item: LeavesType }> => {
    try {
      const response = await api.get(`${this.route}/code/${code}`);
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
