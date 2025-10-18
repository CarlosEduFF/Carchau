import { SolicitacaoContato } from "~/types";
import { createOrUpdateContact } from "./CreateOrUpdateContactService";



export async function verifyOrCreateContact(solicitacao: SolicitacaoContato) {
    try {
        await createOrUpdateContact({
            locadorId: solicitacao.locadorId,
            locatarioId: solicitacao.locatarioId,
            locadornome: solicitacao.locadornome,
            locadorperfilImage: solicitacao.locadorperfilImage || null,
            locatarionome: solicitacao.locatarionome,
            locatarioperfilImage: solicitacao.locatarioperfilImage || null,
        });
    } catch (error) {
        console.error('Erro ao verificar ou criar contato:', error);
        throw error;
    }
}