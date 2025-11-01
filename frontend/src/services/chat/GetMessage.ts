import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { MutableRefObject } from "react";


interface BaseChatParams {
  userId: string | undefined;
  recipientId: string | undefined;
}

export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
  };
}

export interface ListenToMessagesParams extends BaseChatParams {
  onMessagesUpdate: (messages: Message[]) => void;
   flatListRef?: MutableRefObject<any | null>;
}

export const GetMessage = ({
  userId,
  recipientId,
  onMessagesUpdate,
  flatListRef,
}: ListenToMessagesParams) => {
  if (!userId || !recipientId) return () => {};

  const chatRoomId =
    userId < recipientId
      ? `${userId}_${recipientId}`
      : `${recipientId}_${userId}`;

  const messagesRef = collection(db, "ChatRooms", chatRoomId, "messages");
  const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const fetchedMessages: Message[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        _id: doc.id,
        text: data.text,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        user: {
          _id: data.user._id,
          name: data.user.name || "Usuário",
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
