// services/chat.ts
import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

interface BaseChatParams {
  userId: string | undefined;
  recipientId: string | undefined;
}

// Para envio de mensagens
export interface SendMessageParams extends BaseChatParams {
  text: string;
  nome?: string | null;
}
/**
 * Envia mensagem para a sala de chat entre userId e recipientId.
 * Retorna o id do documento criado no Firestore (ou null se não enviar).
 */
export const sendMessageToChat = async ({
  userId,
  recipientId,
  text,
  nome = "Usuário",
}: SendMessageParams): Promise<string | null> => {
  if (!userId || !recipientId) return null;

  const chatRoomId =
    userId < recipientId ? `${userId}_${recipientId}` : `${recipientId}_${userId}`;

  try {
    // Referência para a subcoleção messages dentro de ChatRooms/{chatRoomId}
    const messagesRef = collection(db, "ChatRooms", chatRoomId, "messages");

    // Dados da nova mensagem (note que createdAt será preenchido pelo servidor)
    const newMessage = {
      // você pode omitir _id aqui e usar o id retornado por addDoc
      text,
      createdAt: serverTimestamp(),
      user: {
        _id: userId,
        name: nome,
      },
    };

    const docRef = await addDoc(messagesRef, newMessage);

    // Se você quer que o documento tenha também um campo _id igual ao id do doc:
    // await setDoc(doc(db, 'ChatRooms', chatRoomId, 'messages', docRef.id), { _id: docRef.id }, { merge: true });

    return docRef.id;
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return null;
  }
};
