import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig'; // ajuste o path se necessário

// agora cnhvalida é 'valida' | 'invalida' | null
export type CnhSummary = {
  id: string;
  nome: string;
  fotoPerfil: string | null;
  fotoFront: string | null;
  fotoBack?: string | null;
  // 'valida' = validado, 'invalida' = recusado/inválido, null = pendente/ausente
  cnhvalida: 'valida' | 'invalida' | null;
};

export type CnhDetails = {
  id: string;
  fotoFront?: string | null;
  fotoBack?: string | null;
  cnhvalida?: 'valida' | 'invalida' | null;
  [key: string]: any;
};

/**
 * Normaliza possíveis formatos de cnhvalida para 'valida' | 'invalida' | null:
 * - boolean true/false -> 'valida'/'invalida'
 * - null/undefined -> null
 * - number 1/0 -> 'valida'/'invalida'
 * - strings como 'valido'/'invalido', 'aceito'/'recusado', 'aprovado'/'reprovado', 'true'/'false', 'sim'/'nao'
 *   -> mapeia para 'valida'/'invalida'
 * - objetos/JSON strings tentam extrair um valor interpretável
 * - outros -> null
 */
function normalizeCnhValida(raw: any): 'valida' | 'invalida' | null {
  if (raw === null || typeof raw === 'undefined') return null;

  if (raw === 'valida') return 'valida';
  if (raw === 'invalida') return 'invalida';
  if (raw === 'valido') return 'valida';
  if (raw === 'invalido') return 'invalida';

  if (typeof raw === 'string') {
    const s = raw.trim().toLowerCase();
    if (s === 'valido' || s === 'valida') return 'valida';
    if (s === 'invalido' || s === 'invalida') return 'invalida';
  }

  return null;
}


/**
 * Busca todos os locatários e seus resumos de CNH (lê o doc 'Locatarios' e a subcollection documentos/cnh).
 * Retorna cnhvalida já normalizado para 'valida'|'invalida'|null.
 */
export async function getAllLocatariosCnhSummaries(): Promise<CnhSummary[]> {
  try {
    const locRef = collection(db, 'Locatarios');
    const locSnap = await getDocs(locRef);

    const summaries: CnhSummary[] = await Promise.all(
      locSnap.docs.map(async (docSnap: QueryDocumentSnapshot<DocumentData>) => {
        const id = docSnap.id;
        const userData = docSnap.data() || {};
        const nome: string = (userData.nome as string) || '';
        const fotoPerfil: string | null = userData.fotoPerfil ?? null;

        // doc da CNH na subcollection documentos/cnh (use nomes minúsculos padronizados)
        const cnhRef = doc(db, 'Locatarios', id, 'Documentos', 'CNH');
        const cnhSnap = await getDoc(cnhRef);
        const cnhData = cnhSnap.exists() ? cnhSnap.data() : null;

        const fotoFront: string | null = cnhData?.fotoFront ?? null;
        const fotoBack: string | null = cnhData?.fotoBack ?? null;

        // Normaliza cnhvalida ('valida' | 'invalida' | null)
        const cnhvalida: 'valida' | 'invalida' | null = normalizeCnhValida(cnhData?.cnhvalida);

        return {
          id,
          nome,
          fotoPerfil,
          fotoFront,
          fotoBack,
          cnhvalida,
        } as CnhSummary;
      })
    );

    // opcional: ordenar por nome
    summaries.sort((a, b) => a.nome.localeCompare(b.nome));

    return summaries;
  } catch (error) {
    console.error('Erro ao buscar resumos de CNH:', error);
    return [];
  }
}

/**
 * Retorna detalhes do documento 'cnh' para um locatário específico.
 * Normaliza o campo cnhvalida para 'valida'|'invalida'|null no objeto retornado.
 */
export async function getCnhDetails(locatarioId: string): Promise<CnhDetails | null> {
  try {
    const cnhRef = doc(db, 'Locatarios', locatarioId, 'Documentos', 'CNH');
    const snap = await getDoc(cnhRef);
    if (!snap.exists()) return null;
    const data = snap.data() ?? {};
    // Normaliza antes de retornar
    const normalized = { ...data, cnhvalida: normalizeCnhValida((data as any).cnhvalida) };
    return { id: locatarioId, ...normalized } as CnhDetails;
  } catch (error) {
    console.error(`Erro ao buscar detalhes da CNH do locatário ${locatarioId}:`, error);
    return null;
  }
}

/**
 * Atualiza (ou cria) o campo cnhvalida no documento documentos/cnh do locatário.
 * value: 'valida' = validado, 'invalida' = recusado, null = remove/pendente (usa merge para preservar outros campos).
 */
export async function updateCnhValidation(
  locatarioId: string,
  value: 'valida' | 'invalida' | null
): Promise<void> {
  try {
    const cnhRef = doc(db, 'Locatarios', locatarioId, 'Documentos', 'CNH');
    if (value === null) {
      // definimos explicitamente null (mantém o documento, seta null); se preferir remover o campo, use deleteField()
      await setDoc(cnhRef, { cnhvalida: null }, { merge: true });
    } else {
      await setDoc(cnhRef, { cnhvalida: value }, { merge: true });
    }
  } catch (error) {
    console.error(`Erro ao atualizar cnhvalida do locatário ${locatarioId}:`, error);
    throw error;
  }
}

/**
 * Subscription (real-time): toda vez que a coleção 'Locatarios' mudar,
 * busca novamente cada documento 'documentos/cnh' para compor os summaries.
 * Retorna a função unsubscribe().
 *
 * Observação: esta implementação faz N reads a cada snapshot (1 por locatário).
 * Para coleções grandes, considere manter um documento agregado ou Cloud Function que atualize um summary.
 */
export function subscribeToCnhSummaries(onUpdate: (items: CnhSummary[]) => void) {
  const locRef = collection(db, 'Locatarios');

  const unsub = onSnapshot(
    locRef,
    async (snapshot) => {
      try {
        const promises = snapshot.docs.map(async (docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const id = docSnap.id;
          const userData = docSnap.data() || {};
          const nome = (userData.nome as string) || '';
          const fotoPerfil: string | null = userData.fotoPerfil ?? null;

          const cnhSnap = await getDoc(doc(db, 'Locatarios', id, 'Documentos', 'CNH'));
          const cnhData = cnhSnap.exists() ? cnhSnap.data() : null;

          const fotoFront: string | null = cnhData?.fotoFront ?? null;
          const fotoBack: string | null = cnhData?.fotoBack ?? null;

          const cnhvalida: 'valida' | 'invalida' | null = normalizeCnhValida(cnhData?.cnhvalida);

          return {
            id,
            nome,
            fotoPerfil,
            fotoFront,
            fotoBack,
            cnhvalida,
          } as CnhSummary;
        });

        const summaries = await Promise.all(promises);
        summaries.sort((a, b) => a.nome.localeCompare(b.nome));
        onUpdate(summaries);
      } catch (err) {
        console.error('Erro no subscription de CnhSummaries:', err);
      }
    },
    (error) => {
      console.error('onSnapshot error (Locatarios):', error);
    }
  );

  return unsub;
}
