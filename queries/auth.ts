import api from "@/context/api";
import { Employee } from "@/types/types";

export default class AuthQuery {
    route = "/auth";

    login = async (data: {
        email: string;
        password: string;
    }): Promise<{ user: Employee; access_token: string }> => {
        try {
            const response = await api.post(`${this.route}/login`, data);
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
