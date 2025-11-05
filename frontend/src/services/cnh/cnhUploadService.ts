// src/services/cnh/cnhUploadService.ts
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig'; // ajuste conforme seu projeto (ex: '../../config/firebaseConfig')

export type CnhValidaType = 'valido' | 'invalido' | null;

const normalizeCnhValida = (value: any): CnhValidaType => {
  if (value === true || String(value).toLowerCase() === 'valido' || String(value).toLowerCase() === 'aprovado') {
    return 'valido';
  }
  if (value === false || String(value).toLowerCase() === 'invalido' || String(value).toLowerCase() === 'reprovado') {
    return 'invalido';
  }
  if (typeof value === 'string') {
    const lower = value.trim().toLowerCase();
    if (lower === 'valido' || lower === 'invalido') return lower as CnhValidaType;
  }
  return null;
};

interface SetCnhValidationResult {
  success: boolean;
  message?: string;
}

/**
 * Atualiza somente o campo `cnhvalida` do documento:
 * Locatarios/{locatarioId}/documentos/cnh
 *
 * - Se o documento não existir, ele será criado apenas com o campo cnhvalida.
 * - O valor é normalizado para 'valido' | 'invalido' | null.
 *
 * @param locatarioId id do locatário (obrigatório)
 * @param value boolean | string | null - valor a aplicar (opcional)
 */
export const setCnhValidationWeb = async (
  locatarioId: string,
  value: boolean | string | null
): Promise<SetCnhValidationResult> => {
  try {
    if (!locatarioId) {
      return { success: false, message: 'locatarioId não informado' };
    }

    const normalized = normalizeCnhValida(value);

    const docRef = doc(db, 'Locatarios', locatarioId, 'Documentos', 'CNH');

    // usa setDoc com merge para não sobrescrever outros campos
    await setDoc(docRef, { cnhvalida: normalized }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar cnhvalida:', error);
    return { success: false, message: 'Erro ao atualizar cnhvalida' };
  }
};
