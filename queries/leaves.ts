import api from "@/context/api";
import { Leaves, LeaveType } from "@/types/types";

export default class LeavesQuery {
  route = "/leaves";

  // ✅ GET ALL LEAVES
  getAll = async (): Promise<Leaves[]> => {
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

  // ✅ GET MY LEAVES
  getMine = async (
    userId: number,
  ): Promise<{
    success: boolean;
    items: Leaves[];
    count: number;
  }> => {
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

  // ✅ GET BY USERID
  getByUserId = async (
    userId: string,
  ): Promise<{
    success: boolean;
    items: Leaves[];
    count: number;
  }> => {
    try {
      const response = await api.get(`${this.route}/user/${userId}`);

      return {
        success: response.data.success,
        items: response.data.items,
        count: response.data.count,
      };
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Une erreur s'est produite";

      throw new Error(message);
    }
  };

  // ✅ GET LEAVE BY ID
  getById = async (
    id: number,
  ): Promise<{
    success: boolean;
    item: Leaves;
  }> => {
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

  // ✅ CREATE LEAVE REQUEST
  create = async (data: Partial<Leaves>): Promise<{ success: boolean; data: Leaves }> => {
    try {
      const response = await api.post(`${this.route}`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ GET RECENT LEAVES
  getRecent = async (): Promise<Leaves[]> => {
    try {
      const response = await api.get(`${this.route}/recent`);
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ GET LEAVES HISTORY
  getHistory = async (): Promise<Leaves[]> => {
    try {
      const response = await api.get(`${this.route}/history`);
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ APPROVE LEAVE
  approve = async (id: number): Promise<{ success: boolean; data: Leaves }> => {
    try {
      const response = await api.patch(`${this.route}/${id}/approve`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ REJECT LEAVE
  reject = async (id: number): Promise<{ success: boolean; data: Leaves }> => {
    try {
      const response = await api.patch(`${this.route}/${id}/reject`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ CANCEL LEAVE
  cancel = async (id: number): Promise<{ success: boolean; data: Leaves }> => {
    try {
      const response = await api.patch(`${this.route}/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ CANCEL APPROVED LEAVE
  cancelApproved = async (id: number): Promise<{ success: boolean; data: Leaves }> => {
    try {
      const response = await api.patch(`${this.route}/${id}/cancel-approved`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ==========================================
  // LEAVES TYPES
  // ==========================================

  // ✅ CREATE LEAVE TYPE
  createType = async (data: Partial<LeaveType>): Promise<{ success: boolean; data: LeaveType }> => {
    try {
      const response = await api.post(`${this.route}/types`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ GET ALL LEAVE TYPES
  getTypes = async (companyId: string): Promise<LeaveType[]> => {
    try {
      const response = await api.get(`${this.route}/types/${companyId}`);
      // Assurer que les données retournées sont bien un tableau, sinon extraire depuis .data
      return Array.isArray(response.data) ? response.data : response.data.data || [];
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ UPDATE LEAVE TYPE
  updateType = async (uuid: string, data: Partial<LeaveType>): Promise<{ success: boolean; data: LeaveType }> => {
    try {
      const response = await api.patch(`${this.route}/types/${uuid}`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };

  // ✅ DELETE LEAVE TYPE
  deleteType = async (uuid: string): Promise<{ success: boolean }> => {
    try {
      const response = await api.delete(`${this.route}/types/${uuid}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message ?? error.message ?? "Une erreur s'est produite";
      throw new Error(message);
    }
  };
}