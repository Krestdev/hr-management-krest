import api from "@/context/api";
import { Employee } from "@/types/types";

export default class UserQuery {
  route = "/employees";

  login = async (data: {
    email: string;
    password: string;
  }): Promise<{ user: Employee; token: string }> => {
    try {
      const response = await api.post(`/auth/login`, data);
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
  getAll = async (): Promise<Array<Employee>> => {
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
  getUser = async (id:number):Promise<{success:boolean; user:Employee}> => {
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
  }
}
