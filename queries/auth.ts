import api from "@/context/api";
import { Employee } from "@/types/types";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

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

export function useLoginMutation(options?: UseMutationOptions<{ user: Employee; access_token: string }, Error, { email: string; password: string }>) {
    const authQuery = new AuthQuery();
    return useMutation({
        mutationFn: authQuery.login,
        ...options,
    });
}

