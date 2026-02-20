import api from "@/context/api";
import { Presence } from "@/types/types";

export default class PresenceQuery {
  route = "/presences";

  // ✅ GET ALL PRESENCES
  getAll = async (): Promise<{
    success: boolean;
    items: Presence[];
    count: number;
  }> => {
    try {
      const response = await api.get(this.route);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors du chargement des présences";

      throw new Error(message);
    }
  };

  // ✅ GET PRESENCES BY USER ID
  getByUserId = async (
    userId: number
  ): Promise<{
    success: boolean;
    items: Presence[];
    count: number;
  }> => {
    try {
      console.log(userId);
      const response = await api.get(`${this.route}/user/${userId}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors du chargement des présences utilisateur";

      throw new Error(message);
    }
  };

  // ✅ CREATE PRESENCE
  post = async (
    data: Omit<Presence, "id" | "createdAt" | "updatedAt">
  ): Promise<{
    success: boolean;
    item: Presence;
  }> => {
    try {
      const response = await api.post(this.route, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la création de la présence";

      throw new Error(message);
    }
  };
}
