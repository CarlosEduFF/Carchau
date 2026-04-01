import api from "./api";

export interface LoginResponse {
  uid: string;
  email: string;
  locatario: any; // Ajuste para o tipo Locatario se existir
}

const authService = {
  /**
   * Busca as informações do usuário no backend após o login no Firebase.
   */
  getUserInfo: async (email: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", { email });
    return response.data;
  },

  /**
   * Envia link de redefinição de senha via backend.
   */
  resetPassword: async (email: string): Promise<void> => {
    await api.put("/auth/reset-password", { email });
  },

  /**
   * Busca o perfil do usuário logado (usando o token do interceptor).
   */
  getMyProfile: async (): Promise<any> => {
    const response = await api.get("/api/locatarios/me");
    return response.data;
  },
};

export default authService;
