// @/queries/holidays.ts
import api from "@/context/api";
import {
  HolidayRequest,
  EmployeeLeaveBalance,
} from "@/types/types";

export default class HolidaysQuery {
  route = "/holidays";

  /**
   * Récupération de toutes les demandes (vue RH / Admin)
   */
  getAllRequests = async (): Promise<Array<HolidayRequest>> => {
    try {
      const response = await api.get(`${this.route}/requests`);
      return response.data.items; // 👈 On renvoie juste la liste
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération des demandes";
      throw new Error(message);
    }
  };

  /**
   * Récupération des demandes d'un employé (self-service)
   */
  getRequestsByUser = async (
    userId: number
  ): Promise<Array<HolidayRequest>> => {
    try {
      const response = await api.get(
        `${this.route}/requests?userId=${userId}`
      );
      return response.data.items;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération des demandes employé";
      throw new Error(message);
    }
  };

  /**
   * Récupération des statistiques RH
   */
  getStats = async ():Promise<{totalRequests:number;pendingRequests:number;acceptedRequests:number;rejectedRequests:number}> => {
    try {
      const response = await api.get(`${this.route}/stats`);
      return response.data; // { total, pending, accepted, rejected, byType: [...] }
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération stats congés";
      throw new Error(message);
    }
  };

  /**
   * Récupération du solde de congés d’un employé
   */
  getBalance = async (
    userId: number,
    year?: number
  ): Promise<EmployeeLeaveBalance> => {
    try {
      const response = await api.get(
        `${this.route}/balance?userId=${userId}${!!year ? `&year=${year}` : ""}`
      );
      return response.data.balance;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Erreur récupération solde congés";
      throw new Error(message);
    }
  };
  sendRequest = async (
    data: Omit<HolidayRequest, "id" | "requestedDays" | "status">
  ):Promise<HolidayRequest> => {
    try {
      const response = await api.post(
        `${this.route}/requests`, data
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur est survenue pendant l'enregistrement de votre requête";
      throw new Error(message);
    }
  }
}
