import firebase from "~/config/firebase";
import { SendMessageParams } from "~/types";

export const sendMessageToChat = async ({
    userId,
    recipientId,
    text,
    nome = 'Usuário',
}: SendMessageParams): Promise<void> => {
    if (!userId || !recipientId) return;

    const chatRoomId = userId < recipientId
        ? `${userId}_${recipientId}`
        : `${recipientId}_${userId}`;

    // Gerar o ID que você quer que seja o ID do documento
    const messageDocId = `${userId}_${Date.now()}`;

    const newMessage = {
        // Não precisa mais do _id aqui se ele será o ID do documento
        text,
        createdAt: new Date(),
        user: {
            _id: userId,
            name: nome,
        },
    };

    await firebase.firestore()
        .collection('ChatRooms')
        .doc(chatRoomId)
        .collection('messages')
        .doc(messageDocId) // <--- USE .doc() COM O SEU ID AQUI
        .set({             // <--- E .set() AQUI
            ...newMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
};