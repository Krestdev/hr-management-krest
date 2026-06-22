import api from "@/context/api";
import { LeavesType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

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

export function useLeavesTypesQuery() {
  const leavesTypeQuery = new LeavesTypeQuery();
  return useQuery({
    queryKey: queryKeys.leavesType.all(),
    queryFn: leavesTypeQuery.getAll,
  });
}

export function useLeavesTypeQuery(id: number, enabled: boolean = true) {
  const leavesTypeQuery = new LeavesTypeQuery();
  return useQuery({
    queryKey: queryKeys.leavesType.detail(id),
    queryFn: () => leavesTypeQuery.getById(id),
    enabled: enabled && !!id,
  });
}

export function useLeavesTypeByCodeQuery(code: LeavesType["code"], enabled: boolean = true) {
  const leavesTypeQuery = new LeavesTypeQuery();
  return useQuery({
    queryKey: queryKeys.leavesType.byCode(code),
    queryFn: () => leavesTypeQuery.getByCode(code),
    enabled: enabled && !!code,
  });
}

