import api from "@/context/api";
import { Department, Employee } from "@/types/types";

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
