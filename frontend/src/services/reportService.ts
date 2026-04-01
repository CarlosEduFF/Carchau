import api from "./api";

export interface ChatRoom {
  chatId: string;
  participants?: string[];
  otherId?: string;
  lastMessage?: string | null;
  lastUpdated?: Date | null;
  displayName?: string;
  avatar?: string | null;
}

export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

const reportService = {
  /**
   * Busca salas de chat de um usuário.
   */
  getRooms: async (userId: string): Promise<ChatRoom[]> => {
    const response = await api.get<ChatRoom[]>(`/api/reports/rooms?userId=${userId}`);
    return response.data;
  },

  /**
   * Busca mensagens de uma sala.
   */
  getMessages: async (chatId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/api/reports/rooms/${chatId}/messages`);
    return response.data;
  },

  /**
   * Envia uma mensagem.
   */
  sendMessage: async (chatId: string, message: Partial<Message>): Promise<void> => {
    await api.post(`/api/reports/rooms/${chatId}/messages`, message);
  }
};

export default reportService;
