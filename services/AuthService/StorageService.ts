// services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_ID_KEY = "userId";

export const StorageService = {
  /**
   * Salva o userId no AsyncStorage
   */
  setUserId: async (id: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_ID_KEY, id);
    } catch (error) {
      console.error("Erro ao salvar userId:", error);
      throw error; // propaga o erro, se necessário
    }
  },

  /**
   * Recupera o userId do AsyncStorage
   */
  getUserId: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(USER_ID_KEY);
    } catch (error) {
      console.error("Erro ao carregar userId:", error);
      return null;
    }
  },

  /**
   * Remove o userId do AsyncStorage
   */
  removeUserId: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_ID_KEY);
    } catch (error) {
      console.error("Erro ao remover userId:", error);
      throw error;
    }
  },
};
