import api from "@/context/api";
import { Salarial } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

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

export function useSalarialsQuery() {
  const salarialQuery = new SalarialQuery();
  return useQuery({
    queryKey: queryKeys.salarials.all(),
    queryFn: salarialQuery.getAll,
  });
}

export function useSalarialQuery(id: number, enabled: boolean = true) {
  const salarialQuery = new SalarialQuery();
  return useQuery({
    queryKey: queryKeys.salarials.detail(id),
    queryFn: () => salarialQuery.getById(id),
    enabled: enabled && !!id,
  });
}

