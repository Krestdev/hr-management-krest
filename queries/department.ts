import api from "@/context/api";
import { Department } from "@/types/types";

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

    getAll = async (companyId?: string): Promise<Department[]> => {
        try {
            const response = await api.get(`${this.route}`, {
                params: { companyId }
            });
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

    getById = async (id: string, companyId?: string): Promise<Department> => {
        try {
            const response = await api.get(`${this.route}/${id}`, {
                params: { companyId }
            });
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
