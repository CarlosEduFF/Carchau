
import { MutableRefObject, Dispatch, SetStateAction } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

/**
 * Tipos usados pela função — ajuste ou remova se já existir em ~/types
 */

interface BaseChatParams {
  userId: string | undefined;
  recipientId: string | undefined;
}
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



export const loadChatUserData = ({
  locadorId,
  locatarioId,
  ContatoId,
  recipientId,
  setUserId,
  setRecipientId,
  setNome,
  setPerfilImage,
  setUserImage,
  setLoading,
  previousContactId,
}: LoadChatUserDataParams): (() => void) => {
  let isMounted = true;

  // Disparo assíncrono — retorna cleanup imediatamente (compatível com useEffect)
  (async () => {
    try {
      setLoading(true);

      const uid = localStorage.getItem("userId");
      if (!uid) {
        if (isMounted) setLoading(false);
        return;
      }

      // atualiza uid no state
      if (isMounted) setUserId(uid);

      // Determina o ID do destinatário (se não foi passado)
      let newRecipientId = recipientId ?? null;
      if (!newRecipientId) {
        newRecipientId = uid === locadorId ? locatarioId ?? null : locadorId ?? null;
        if (isMounted) setRecipientId(newRecipientId);
      }

      let recipientProfileImage: string | null = null;
      let userProfileImage: string | null = null;
      let recipientName = "Usuário";

      // Busca dados do destinatário (coleção 'Locatarios')
      if (newRecipientId) {
        const recipientRef = doc(db, "Locatarios", newRecipientId);
        const recipientSnap = await getDoc(recipientRef);

        if (recipientSnap.exists()) {
          const recipientData = recipientSnap.data() as any;
          recipientName = recipientData?.nome ?? "Usuário";
          recipientProfileImage = (recipientData?.fotoPerfil as string) ?? null;
        }

        if (isMounted) {
          setNome(recipientName);
          setPerfilImage(recipientProfileImage);
        }
      }

      // Busca dados do usuário logado
      const userRef = doc(db, "Locatarios", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as any;
        userProfileImage = (userData?.fotoPerfil as string) ?? null;
      }
      if (isMounted) setUserImage(userProfileImage);

      // Atualiza Firestore em 'Contatos' se necessário
      if (ContatoId && previousContactId.current !== ContatoId) {
        const contatoRef = doc(db, "Contatos", ContatoId);
        const contatoSnap = await getDoc(contatoRef);

        if (contatoSnap.exists()) {
          const contatoData = contatoSnap.data() as any;
          const locadorPerfilAtual = contatoData?.locadorperfilImage ?? null;
          const locatarioPerfilAtual = contatoData?.locatarioperfilImage ?? null;

          const deveAtualizar =
            locadorPerfilAtual !== userProfileImage || locatarioPerfilAtual !== recipientProfileImage;

          if (deveAtualizar) {
            console.log("Atualizando Firestore para ContatoId:", ContatoId);
            // define qual imagem deve ser gravada em cada campo dependendo de quem é o uid
            const updatedLocadorImage = uid === locadorId ? userProfileImage : recipientProfileImage;
            const updatedLocatarioImage = uid === locatarioId ? userProfileImage : recipientProfileImage;

            await updateDoc(contatoRef, {
              locadorperfilImage: updatedLocadorImage,
              locatarioperfilImage: updatedLocatarioImage,
            });
          } else {
            console.log("As imagens são as mesmas, não será feita atualização.");
          }
        } else {
          console.log("Contato não encontrado no Firestore.");
        }

        previousContactId.current = ContatoId;
      }

      if (isMounted) setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      if (isMounted) setLoading(false);
    }
  })();

  // cleanup para useEffect
  return () => {
    isMounted = false;
  };
};
