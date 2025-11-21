import api from "@/context/api";
import { PresenceRecord } from "@/types/types";

export default class PresenceQuery {
  route = "/presences";

  /**
   * Récupère les présences d’un utilisateur
   * @param userId : identifiant de l'utilisateur
   * @param from : date de début optionnelle
   * @param to : date de fin optionnelle
   */
  getByUser = async (
    userId: number,
    from?: Date,
    to?: Date
  ): Promise<Array<PresenceRecord>> => {
    try {
      const params = new URLSearchParams();
      params.set("userId", String(userId));

      if (from) params.set("from", from.toISOString());
      if (to) params.set("to", to.toISOString());

      const response = await api.get(
        `${this.route}?${params.toString()}`
      );

      return response.data.items;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Impossible de récupérer les présences.";

      throw new Error(message);
    }
  };

  /**
   * Récupération d'une présence par id
   */
  getById = async (id: number): Promise<PresenceRecord> => {
    try {
      const response = await api.get(`${this.route}/${id}`);
      return response.data.item;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la récupération de la présence.";

      throw new Error(message);
    }
  };

  /**
   * Mise à jour des infos de présence (RH/Manager)
   */
  update = async (
    id: number,
    data: Partial<PresenceRecord>
  ): Promise<PresenceRecord> => {
    try {
      const response = await api.put(`${this.route}/${id}`, data);
      return response.data.item;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur lors de la mise à jour de la présence.";

      throw new Error(message);
    }
  };

  /**
   * Création manuelle d'une présence (cas correction RH)
   */
  create = async (
    data: Omit<PresenceRecord, "id" | "createdAt">
  ): Promise<PresenceRecord> => {
    try {
      const response = await api.post(this.route, data);
      return response.data.item;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Impossible d'ajouter la présence.";

      throw new Error(message);
    }
  };
}
