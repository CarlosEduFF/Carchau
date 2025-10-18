import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "~/config/firebase";
import { LoadChatUserDataParams } from "~/types";

export const loadChatUserData = async ({
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
}: LoadChatUserDataParams) => {
    let isMounted = true;

    try {
        const uid = await AsyncStorage.getItem('userId');
        if (!uid) return;

        setUserId(uid);

        // Determina o ID do destinatário
        let newRecipientId = recipientId;
        if (!recipientId) {
            newRecipientId = uid === locadorId ? locatarioId : locadorId;
            setRecipientId(newRecipientId);
        }

        let recipientProfileImage: string | null = null;
        let userProfileImage: string | null = null;
        let recipientName = 'Usuário';

        // Busca dados do destinatário
        if (newRecipientId) {
            const recipientDoc = await firebase.firestore().collection('Locatarios').doc(newRecipientId).get();

            if (recipientDoc.exists) {
                const recipientData = recipientDoc.data();
                recipientName = recipientData?.nome || 'Usuário';
                recipientProfileImage = recipientData?.fotoPerfil || null;
            }

            if (isMounted) {
                setNome(recipientName);
                setPerfilImage(recipientProfileImage);
            }
        }

        // Busca dados do usuário logado
        const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();

        if (userDoc.exists) {
            const userData = userDoc.data();
            userProfileImage = userData?.fotoPerfil || null;
        }

        if (isMounted) {
            setUserImage(userProfileImage);
        }

        // Atualiza Firestore se necessário
        if (ContatoId && previousContactId.current !== ContatoId) {
            const contatoRef = firebase.firestore().collection('Contatos').doc(ContatoId);
            const contatoDoc = await contatoRef.get();

            if (contatoDoc.exists) {
                const contatoData = contatoDoc.data();
                const locadorPerfilAtual = contatoData?.locadorperfilImage || null;
                const locatarioPerfilAtual = contatoData?.locatarioperfilImage || null;

                const deveAtualizar =
                    locadorPerfilAtual !== userProfileImage ||
                    locatarioPerfilAtual !== recipientProfileImage;

                if (deveAtualizar) {
                    console.log('Atualizando Firestore para ContatoId:', ContatoId);
                    await contatoRef.update({
                        locadorperfilImage: uid === locadorId ? userProfileImage : recipientProfileImage,
                        locatarioperfilImage: uid === locatarioId ? userProfileImage : recipientProfileImage,
                    });
                } else {
                    console.log('As imagens são as mesmas, não será feita atualização.');
                }
            } else {
                console.log('Contato não encontrado no Firestore.');
            }

            previousContactId.current = ContatoId;
        }

        if (isMounted) setLoading(false);
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        if (isMounted) setLoading(false);
    }

    return () => {
        isMounted = false;
    };
};