// src/types/Message.ts

/** Representa uma mensagem no chat */
export interface Message {
  _id: string;
  text: string;
  createdAt: Date;
  user: {
    _id: string;
    name: string;
    avatar?: string; // opcional
  };
  userImage?: string; // opcional, caso queira armazenar fora do user
}


/** Dados do usuário armazenados no Firestore */
export type UserData = {
  nome: string;
  nacionalidade: string;
  telefone: string;
  email: string;
  sexo: 'Masculino' | 'Feminino';
  cpf: string;
  profissao: string;
  fotoPerfil: string;
};

/** Representa um contato entre dois usuários */
export interface SolicitacaoContato {
  id: string;
  locadorId: string;
  locatarioId: string;
  locatarionome: string;
  locatarioperfilImage: string;
  locadornome: string;
  locadorperfilImage: string;
  estado: string;
}

/** Parâmetros usados ao enviar uma mensagem */
export interface SendMessageParams {
  userId: string;
  recipientId: string;
  text: string;
  nome?: string;
}

/** Parâmetros usados para carregar dados do chat */
export interface LoadChatUserDataParams {
  locadorId: string;
  locatarioId: string;
  ContatoId?: string | null;
  recipientId?: string | undefined;
  userId?: string | undefined;
  setUserId: (id: string) => void;
  setRecipientId: (id: string) => void;
  setNome: (nome: string | null) => void;
  setPerfilImage: (image: string | null) => void;
  setUserImage: (image: string | null) => void;
  setLoading: (loading: boolean) => void;
  previousContactId: React.MutableRefObject<string | null>;
}

export interface BaseChatParams {
  userId: string | undefined;
  recipientId: string | undefined;
}

export interface ListenToMessagesParams extends BaseChatParams {
  onMessagesUpdate: (messages: Message[]) => void;
  flatListRef?: React.RefObject<any>;
  // Adicionado para compatibilizar com implementações que querem rolar a lista
  scrollToBottom?: () => void;
}

export interface ChatRoom {
  chatId: string;
  otherId?: string; // opcional
  displayName?: string;
  avatar?: string | null;
}
