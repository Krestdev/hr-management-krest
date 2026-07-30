import api from "@/context/api";
import { Presence } from "@/types/types";

export default class PresenceQuery {
  route = "/attendance";

  // ✅ GET ALL PRESENCES
  getAll = async (month?: number, year?: number): Promise<Presence[]> => {
    try {
      const url = month && year ? `${this.route}?month=${month}&year=${year}` : this.route;
      const response = await api.get(url);

      if (response.data && Array.isArray(response.data.data)) {
        const allPresences: Presence[] = [];
        response.data.data.forEach((emp: any) => {
          if (Array.isArray(emp.attendances)) {
            emp.attendances.forEach((att: any) => {
              allPresences.push({
                ...att,
                employee: {
                  uuid: emp.uuid,
                  firstName: emp.firstName,
                  lastName: emp.lastName,
                  position: emp.position,
                  user: emp.user,
                }
              });
            });
          }
        });
        return allPresences;
      }

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
    userId: string,
    month?: number,
    year?: number
  ): Promise<Presence[]> => {
    try {
      const url = month && year
        ? `${this.route}/employee/${userId}?month=${month}&year=${year}`
        : `${this.route}/employee/${userId}`;
      const response = await api.get(url);

      if (response.data && Array.isArray(response.data.data)) {
        const allPresences: Presence[] = [];
        response.data.data.forEach((emp: any) => {
          if (Array.isArray(emp.attendances)) {
            emp.attendances.forEach((att: any) => {
              allPresences.push({
                ...att,
                employee: {
                  uuid: emp.uuid,
                  firstName: emp.firstName,
                  lastName: emp.lastName,
                  position: emp.position,
                  user: emp.user,
                }
              });
            });
          }
        });
        return allPresences;
      }

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
    data: Omit<Presence, "uuid" | "createdAt" | "updatedAt">
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

  // ✅ UPDATE PRESENCE
  update = async (
    id: string,
    data: Partial<Omit<Presence, "uuid" | "createdAt" | "updatedAt">>
  ): Promise<{
    success: boolean;
    item: Presence;
  }> => {
    try {
      const response = await api.patch(`${this.route}/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la modification de la présence";

      throw new Error(message);
    }
  };

  // ✅ CREATE MANY PRESENCES
  postMany = async ({
    data,
  }: {
    data: Omit<Presence, "uuid" | "createdAt" | "updatedAt">[];
  }): Promise<any> => {
    try {
      const response = await api.post(`/attendance/batch`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la création en masse des présences";

      throw new Error(message);
    }
  };
}