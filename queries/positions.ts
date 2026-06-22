import api from "@/context/api";
import { Position } from "@/types/types";

export default class PositionQuery {
    route = "/positions";

    create = async (data: Omit<Position, "uuid" | "createdAt" | "updatedAt">): Promise<Position> => {
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

    getAll = async (): Promise<Position[]> => {
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

    getById = async (id: string): Promise<Position> => {
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

    update = async (id: string, data: Partial<Omit<Position, "uuid" | "createdAt" | "updatedAt">>): Promise<Position> => {
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

    assignManager = async (positionId: string, managerId: string): Promise<Position> => {
        try {
            const response = await api.put(`${this.route}/${positionId}/manager/${managerId}`);
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
