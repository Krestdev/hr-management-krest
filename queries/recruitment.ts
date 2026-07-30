import api from "@/context/api";
import { Recruitment } from "@/types/types";

export default class RecruitmentQuery {
  route = "/recruitment";

  // ✅ GET ALL
  getAll = async (companyId?: string): Promise<any> => {
    try {
      const response = await api.get(this.route, {
        params: { companyId }
      });
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la récupération des recrutements";
      throw new Error(message);
    }
  };

  // ✅ GET BY ID (GET ONE)
  getById = async (id: string): Promise<any> => {
    try {
      const response = await api.get(`${this.route}/${id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la récupération du recrutement";
      throw new Error(message);
    }
  };

  // ✅ CREATE
  create = async (
    data: Omit<Recruitment, "uuid" | "createdAt" | "updatedAt">
  ): Promise<any> => {
    try {
      const response = await api.post(this.route, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la création du recrutement";
      throw new Error(message);
    }
  };

  // ✅ UPDATE
  update = async ({
    id,
    data,
  }: {
    id: string;
    data: Partial<Omit<Recruitment, "uuid" | "createdAt" | "updatedAt">>;
  }): Promise<any> => {
    try {
      const response = await api.patch(`${this.route}/${id}`, data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la mise à jour du recrutement";
      throw new Error(message);
    }
  };

  // ✅ DELETE
  delete = async (id: string): Promise<any> => {
    try {
      const response = await api.delete(`${this.route}/${id}`);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ??
        error.message ??
        "Une erreur s'est produite lors de la suppression du recrutement";
      throw new Error(message);
    }
  };
}