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

    const newMessage = {
        _id: `${userId}_${Date.now()}`,
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
        .add({
            ...newMessage,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
};