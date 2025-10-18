import { createOrUpdateContact } from "./CreateOrUpdateContactService";

export async function createOrSearchChat(
    locadorId: string,
    locatarioId: string,
    locadornome: string,
    locadorperfilImage: string | null,
    locatarionome: string,
    locatarioperfilImage: string | null
  ) {
    try {
      const [id1, id2] = [locadorId, locatarioId].sort(); // ordena os dois
      const chatId = `${id1}_${id2}`;

      await createOrUpdateContact({
        locadorId,
        locatarioId,
        locadornome,
        locadorperfilImage,
        locatarionome,
        locatarioperfilImage,
      });

      return chatId;
    } catch (error) {
      console.error('Erro ao criar ou buscar chat:', error);
      throw error;
    }
  }