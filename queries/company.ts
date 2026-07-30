import api from "@/context/api";
import { Company } from "@/types/types";

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