// types/Chat/ChatParams.ts
import { Message } from "~/types/Chat/Message";

// Interface base com campos comuns
interface BaseChatParams {
  userId: string | undefined;
  recipientId: string | undefined;
}

// Para envio de mensagens
export interface SendMessageParams extends BaseChatParams {
  text: string;
  nome?: string | null;
}

// Para escutar mensagens
export interface ListenToMessagesParams extends BaseChatParams {
  onMessagesUpdate: (messages: Message[]) => void;
  flatListRef?: React.RefObject<any>;
}

// Para carregar dados do chat
export interface LoadChatUserDataParams extends BaseChatParams {
  locadorId: string;
  locatarioId: string;
  ContatoId: string | null;

  setUserId: (id: string) => void;
  setRecipientId: (id: string) => void;
  setNome: (nome: string) => void;
  setPerfilImage: (url: string | null) => void;
  setUserImage: (url: string | null) => void;
  setLoading: (loading: boolean) => void;

  previousContactId: React.MutableRefObject<string | null>;
}
