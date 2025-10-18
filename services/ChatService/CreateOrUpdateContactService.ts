import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "~/config/firebase";
export async function createOrUpdateContact({
    locadorId,
    locatarioId,
    locadornome,
    locadorperfilImage,
    locatarionome,
    locatarioperfilImage,
  }: {
    locadorId: string;
    locatarioId: string;
    locadornome: string;
    locadorperfilImage: string | null;
    locatarionome: string;
    locatarioperfilImage: string | null;
  }): Promise<string> {
    const [id1, id2] = [locadorId, locatarioId].sort(); // ordena os dois
    const chatId = `${id1}_${id2}`;

    const contatoRef = firebase.firestore().collection('Contatos').doc(chatId);

    await firebase.firestore().runTransaction(async (transaction) => {
      const doc = await transaction.get(contatoRef);

      if (!doc.exists) {
        transaction.set(contatoRef, {
          id: chatId,
          locadorId,
          locatarioId,
          locadornome,
          locadorperfilImage: locadorperfilImage || null,
          locatarionome,
          locatarioperfilImage: locatarioperfilImage || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      } else {
        transaction.set(
          contatoRef,
          {
            locadornome,
            locadorperfilImage: locadorperfilImage || null,
            locatarionome,
            locatarioperfilImage: locatarioperfilImage || null,
          },
          { merge: true }
        );
      }
    });

    return chatId;
  }