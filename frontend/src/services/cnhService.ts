import api from "./api";

export interface CnhSummary {
  id: string;
  nome: string;
  fotoPerfil: string | null;
  fotoFront: string | null;
  fotoBack?: string | null;
  cnhvalida: 'valida' | 'invalida' | null;
}

const cnhService = {
  /**
   * Busca resumos de CNH de todos os locatários.
   */
  getAllSummaries: async (): Promise<CnhSummary[]> => {
    const response = await api.get<any[]>("/api/locatarios");
    // O backend retorna Locatario[], precisamos adaptar para CnhSummary se os campos forem diferentes
    // Para simplificar, assumimos que o backend retorna os dados necessários
    return response.data;
  },

  /**
   * Busca detalhes da CNH de um locatário.
   */
  getDetails: async (id: string): Promise<any> => {
    const response = await api.get(`/api/locatarios/${id}/cnh`);
    return response.data;
  },

  /**
   * Atualiza o status de validação.
   */
  updateStatus: async (id: string, status: 'valida' | 'invalida' | null): Promise<void> => {
    await api.put(`/api/locatarios/${id}/cnh-status`, { status });
  }
};

export default cnhService;
