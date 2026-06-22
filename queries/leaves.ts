import api from "@/context/api";
import { Leaves } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class LeavesQuery {
  route = "/leaves";

  // ✅ GET ALL LEAVES
  getAll = async (): Promise<{
    success: boolean;
    items: Leaves[];
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
}

export function useLeavesQuery() {
  const leavesQuery = new LeavesQuery();
  return useQuery({
    queryKey: queryKeys.leaves.all(),
    queryFn: leavesQuery.getAll,
  });
}

export function useMyLeavesQuery(userId: number, enabled: boolean = true) {
  const leavesQuery = new LeavesQuery();
  return useQuery({
    queryKey: queryKeys.leaves.mine(userId),
    queryFn: () => leavesQuery.getMine(userId),
    enabled: enabled && !!userId,
  });
}

export function useLeavesByUserIdQuery(userId: string, enabled: boolean = true) {
  const leavesQuery = new LeavesQuery();
  return useQuery({
    queryKey: queryKeys.leaves.byUserId(userId),
    queryFn: () => leavesQuery.getByUserId(userId),
    enabled: enabled && !!userId,
  });
}

export function useLeaveByIdQuery(id: number, enabled: boolean = true) {
  const leavesQuery = new LeavesQuery();
  return useQuery({
    queryKey: queryKeys.leaves.detail(id),
    queryFn: () => leavesQuery.getById(id),
    enabled: enabled && !!id,
  });
}

