import firebase from '../config/firebase'; // Ajuste para o caminho correto do seu firebase config
import { SolicitacaoContato } from '../types/Contato';

const contatoService = {
  /**
   * Verifica se um contato existe, caso não, cria o contato.
   * @param solicitacao Dados da solicitação de contato.
   */
  async verificarOuCriarContato(solicitacao: SolicitacaoContato) {
    try {
      const contatoId = [solicitacao.locadorId, solicitacao.locatarioId].sort().join('_');
      const contatoRef = firebase.firestore().collection('Contatos').doc(contatoId);

      await firebase.firestore().runTransaction(async (transaction) => {
        const contatoDoc = await transaction.get(contatoRef);

        if (!contatoDoc.exists) {
          console.log(`Criando novo contato: ${contatoId}`);
          transaction.set(contatoRef, {
            id: contatoId,
            locadorId: solicitacao.locadorId,
            locatarioId: solicitacao.locatarioId,
            locadornome: solicitacao.locadornome,
            locadorperfilImage: solicitacao.locadorperfilImage,
            locatarionome: solicitacao.locatarionome,
            locatarioperfilImage: solicitacao.locatarioperfilImage,
            estado: solicitacao.estado,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } else {
          console.log(`Contato ${contatoId} já existe. Atualizando estado.`);
          transaction.set(
            contatoRef,
            {
              estado: solicitacao.estado,
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }
      });

      console.log('Operação de verificar ou criar contato concluída com sucesso.');

    } catch (error) {
      console.error('Erro ao criar ou verificar contato:', error);
      throw new Error('Erro ao criar ou verificar contato.');
    }
  },
};

export default contatoService;
