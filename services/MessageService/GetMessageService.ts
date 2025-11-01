import firebase from "~/config/firebase";
import { ListenToMessagesParams, Message } from "~/types";
interface BaseChatParams {
  userId: string | undefined;
  recipientId: string | undefined;
}

// Para envio de mensagens
export interface SendMessageParams extends BaseChatParams {
  text: string;
  nome?: string | null;
}
export const GetMessage = ({
    userId,
    recipientId,
    onMessagesUpdate,
    flatListRef,
}: ListenToMessagesParams) => {
    if (!userId || !recipientId) return () => { };

    const chatRoomId =
        userId < recipientId
            ? `${userId}_${recipientId}`
            : `${recipientId}_${userId}`;

    const unsubscribe = firebase
        .firestore()
        .collection('ChatRooms')
        .doc(chatRoomId)
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            const fetchedMessages: Message[] = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    _id: doc.id,
                    text: data.text,
                    createdAt: data.createdAt?.toDate?.() || new Date(),
                    user: {
                        _id: data.user._id,
                        name: data.user.name || 'Usuário',
                    },
                };
            });

            onMessagesUpdate(fetchedMessages.reverse());

            setTimeout(() => {
                flatListRef?.current?.scrollToEnd?.({ animated: true });
            }, 300);
        });

    return unsubscribe;
};
