import api from "@/context/api";
import { Department, Employee } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";

export default class DepartmentQuery {
    route = "/departments";

    create = async (data: Omit<Department, "uuid" | "createdAt" | "updatedAt">): Promise<Department> => {
        try {
            const response = await api.post(`${this.route}`, data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            // On propage une erreur propre
            throw new Error(message);
        }
    };

    getAll = async (): Promise<{ departments: Department[] }> => {
        try {
            const response = await api.get(`${this.route}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            // On propage une erreur propre
            throw new Error(message);
        }
    };

    getById = async (id: string): Promise<Department> => {
        try {
            const response = await api.get(`${this.route}/${id}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            // On propage une erreur propre
            throw new Error(message);
        }
    };

    update = async (id: string, data: Partial<Omit<Department, "uuid" | "createdAt" | "updatedAt">>): Promise<Department> => {
        try {
            const response = await api.put(`${this.route}/${id}`, data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            // On propage une erreur propre
            throw new Error(message);
        }
    };

    delete = async (id: string): Promise<void> => {
        try {
            await api.delete(`${this.route}/${id}`);
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            // On propage une erreur propre
            throw new Error(message);
        }
    };

    assignManager = async (departmentId: string, managerId: string): Promise<Department> => {
        try {
            const response = await api.put(`${this.route}/${departmentId}/manager/${managerId}`);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            // On propage une erreur propre
            throw new Error(message);
        }
    };
}

export function useDepartmentsQuery() {
    const departmentQuery = new DepartmentQuery();
    return useQuery({
        queryKey: queryKeys.departments.all(),
        queryFn: departmentQuery.getAll,
    });
}

export function useDepartmentQuery(id: string, enabled: boolean = true) {
    const departmentQuery = new DepartmentQuery();
    return useQuery({
        queryKey: queryKeys.departments.detail(id),
        queryFn: () => departmentQuery.getById(id),
        enabled: enabled && !!id,
    });
}

export function useCreateDepartmentMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: departmentQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
        },
    });
}

export function useUpdateDepartmentMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Department, "uuid" | "createdAt" | "updatedAt">> }) =>
            departmentQuery.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(data.uuid) });
        },
    });
}

export function useDeleteDepartmentMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: departmentQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
        },
    });
}

export function useAssignDepartmentManagerMutation() {
    const departmentQuery = new DepartmentQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ departmentId, managerId }: { departmentId: string; managerId: string }) =>
            departmentQuery.assignManager(departmentId, managerId),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.departments.detail(data.uuid) });
        },
    });
}

