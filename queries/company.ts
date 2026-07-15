import api from "@/context/api";
import { Company } from "@/types/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "./queryKeys";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default class CompanyQuery {
    route = "/companies";

    // Get All
    getAll = async (): Promise<Company[]> => {
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

    // Get by Id
    getById = async (id: string): Promise<Company> => {
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

    // Create
    create = async (data: Omit<Company, "uuid" | "createdAt" | "updatedAt" | "departments" | "contracts" | "employees" | "isActive">): Promise<Company> => {
        try {
            const response = await api.post(`${this.route}`, data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            throw new Error(message);
        }
    };

    // Update
    update = async (id: string, data: Partial<Omit<Company, "uuid" | "createdAt" | "updatedAt">>): Promise<Company> => {
        try {
            const response = await api.patch(`${this.route}/${id}`, data);
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            throw new Error(message);
        }
    };

    // Delete
    delete = async (id: string): Promise<void> => {
        try {
            await api.delete(`${this.route}/${id}`);
        } catch (error: any) {
            const message =
                error.response?.data?.message ??
                error.message ??
                "Une erreur s'est produite";

            throw new Error(message);
        }
    };
}

// Hooks

export function useCompaniesQuery(enabled: boolean = true) {
    const companyQuery = new CompanyQuery();
    return useQuery({
        queryKey: queryKeys.companies.all(),
        queryFn: () => companyQuery.getAll(),
        enabled,
    });
}

export function useCompanyQuery(id: string, enabled: boolean = true) {
    const companyQuery = new CompanyQuery();
    return useQuery({
        queryKey: queryKeys.companies.detail(id),
        queryFn: () => companyQuery.getById(id),
        enabled: enabled && !!id,
    });
}

export function useCreateCompanyMutation() {
    const companyQuery = new CompanyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyQuery.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.all() });
            toast.success("Société créée avec succès")
        },
        onError: (error: AxiosError) => {
            const message =
                error.message ??
                "Une erreur s'est produite";
            toast.error(message);
        }
    });
}

export function useUpdateCompanyMutation() {
    const companyQuery = new CompanyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Omit<Company, "uuid" | "createdAt" | "updatedAt">> }) =>
            companyQuery.update(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.all() });
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(data.uuid) });
            toast.success("Société mise à jour avec succès")
        },
        onError: (error: AxiosError) => {
            const message =
                error.message ??
                "Une erreur s'est produite";
            toast.error(message);
        }
    });
}

export function useDeleteCompanyMutation() {
    const companyQuery = new CompanyQuery();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: companyQuery.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.companies.all() });
            toast.success("Société supprimée avec succès")
        },
        onError: (error: AxiosError) => {
            const message =
                error.message ??
                "Une erreur s'est produite";
            toast.error(message);
        }
    });
}
