// src/services/chat/ListChatRooms.ts
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  orderBy,
  QueryConstraint,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { ChatRoom } from "../types/Message";

/**
 * Tipo resumido de sala retornado pelo service.
 */
export type ChatRoomSummary = {
  chatId: string;
  participants?: string[]; // se existir no doc
  otherId?: string; // id da outra ponta (quando possível)
  lastMessage?: string | null;
  lastUpdated?: Date | null;
};

/**
 * Inscreve (real-time) nas ChatRooms que envolvem fixedUserId.
 *
 * Estratégia:
 * 1) Tenta uma query eficiente: where('participants', 'array-contains', fixedUserId)
 * 2) Se retornar vazia (ou não houver esse campo), faz fallback: onSnapshot em toda a collection
 *    e filtra por doc.id contendo fixedUserId (ex.: "otherId_fixed" ou "fixed_otherId").
 *
 * @param fixedUserId id "fixo" que sempre participa das salas (ex: OdxeqUU7SDNbBDzhN4ETeP2h1jI3)
 * @param onUpdate callback que recebe a lista atualizada de ChatRoomSummary
 *
 * @returns unsubscribe function (chame quando quiser parar)
 */
export function subscribeChatRoomsForFixedUser(
  fixedUserId: string,
  onUpdate: (rooms: ChatRoom[]) => void
) {
  if (!fixedUserId) {
    const emptyUnsub = () => {};
    onUpdate([]);
    return emptyUnsub;
  }

  const colRef = collection(db, "ChatRooms");

  // Primeiro: query com 'participants' (ideal se seus docs tiverem esse campo)
  const q = query(colRef, where("participants", "array-contains", fixedUserId), orderBy("lastUpdated", "desc"));

  // Vamos tentar buscar docs imediatamente para decidir se usamos esse caminho ou fallback.
  let triedParticipantsQuery = false;
  let unsubscribeFallback: (() => void) | null = null;
  let unsubscribeParticipants: (() => void) | null = null;

  (async () => {
    try {
      triedParticipantsQuery = true;
      const snapshotParticipants = await getDocs(q);

      if (!snapshotParticipants.empty) {
        // A coleção parece ter 'participants' e retornou resultados: usamos onSnapshot do mesmo query
        unsubscribeParticipants = onSnapshot(q, (snap) => {
          const rooms: ChatRoomSummary[] = snap.docs.map((d) => {
            const data = d.data() as DocumentData;
            return {
              chatId: d.id,
              participants: data.participants as string[] | undefined,
              otherId: (data.participants || []).find((p: string) => p !== fixedUserId),
              lastMessage: data.lastMessage ?? null,
              lastUpdated: data.lastUpdated ? (data.lastUpdated.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)) : null,
            };
          });
          onUpdate(rooms);
          console.log("Doc IDs na coleção ChatRooms:", snap.docs.map(d => d.id));
        });

        return;
      }
    } catch (err) {
      // Se der algum erro aqui, caímos para fallback
      console.warn("Erro na query por participants (vai usar fallback):", err);
    }

    // Fallback: inscreve na coleção inteira e filtra por doc.id que contenha fixedUserId
    unsubscribeFallback = onSnapshot(colRef, (snap) => {
      const rooms: ChatRoomSummary[] = snap.docs
        .filter((d) => d.id.includes(fixedUserId))
        .map((d) => {
          const data = d.data() as DocumentData;
          // tenta inferir otherId a partir do id do doc (assumindo 'a_b' ou 'b_a')
          const parts = d.id.split("_");
          const otherId = parts.length === 2 ? (parts[0] === fixedUserId ? parts[1] : parts[1] === fixedUserId ? parts[0] : undefined) : undefined;

          return {
            chatId: d.id,
            participants: data.participants as string[] | undefined,
            otherId,
            lastMessage: data.lastMessage ?? null,
            lastUpdated: data.lastUpdated ? (data.lastUpdated.toDate ? data.lastUpdated.toDate() : new Date(data.lastUpdated)) : null,
          };
        })
        // opcional: ordenar localmente por lastUpdated desc
        .sort((a, b) => {
          const ta = a.lastUpdated ? a.lastUpdated.getTime() : 0;
          const tb = b.lastUpdated ? b.lastUpdated.getTime() : 0;
          return tb - ta;
        });

      onUpdate(rooms);
    });
  })();

  // Retorna função unsubscribe que limpa tanto participants quanto fallback (o que estiver ativo)
  return () => {
    if (unsubscribeParticipants) unsubscribeParticipants();
    if (unsubscribeFallback) unsubscribeFallback();
  };
}


export const listAllChatRooms = async (): Promise<void> => {
  try {
    const chatRoomsRef = collection(db, "ChatRooms");
    const snapshot = await getDocs(chatRoomsRef);

    if (snapshot.empty) {
      console.log("Nenhum chat encontrado na coleção ChatRooms");
      return;
    }

    console.log("Documentos encontrados em ChatRooms:");
    snapshot.docs.forEach((doc) => {
      console.log("Doc ID:", doc.id, "Data:", doc.data());
    });
  } catch (error) {
    console.error("Erro ao buscar ChatRooms:", error);
  }
};
