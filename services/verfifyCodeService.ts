import firebase from '~/config/firebase';

type VerifyCodeServiceParams = {
    soliciId: string;
    locatarioId: string;
    verificationCode: string;
    userType: 'locatario' | 'locador';
    onSuccess: () => void;
    onFailure: () => void;
    setLoading: (val: boolean) => void;
    setLoading2: (val: boolean) => void;
    maxDelay?: number;
};

export const verifyCodeServiceEntr = async ({
    soliciId,
    locatarioId,
    verificationCode,
    userType,
    onSuccess,
    onFailure,
    setLoading,
    setLoading2,
    maxDelay = 10000,
}: VerifyCodeServiceParams) => {
    setLoading(true);
    setLoading2(true);

    const intervalCheck = 1000;
    let elapsedTime = 0;

    const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);
    const carrosRef = firebase
        .firestore()
        .collection('Locatarios')
        .doc(locatarioId)
        .collection('solicitacoes')
        .doc(soliciId);

    const updateStatusField = async (field: string, value: string) => {
        await carrosRef.update({
            [`status.${field}`]: value,
        });
    };

    const checkAndUpdate = async () => {
        const docSnapshot = await docRef.get();
        const data = docSnapshot.data();

        if (!data) return false;

        const codeToCompare = userType === 'locatario' ? data.locadorCode : data.locatarioCode;
        const fieldToUpdate = userType === 'locatario' ? 'confirRecepLocata' : 'confirEntregaLocador';
        const successValue = userType === 'locatario' ? 'Veículo recebido' : 'Veículo entregue';
        const oppositeField = userType === 'locatario' ? 'confirEntregaLocador' : 'confirRecepLocata';
        const oppositeValue = userType === 'locatario' ? 'Veículo entregue' : 'Veículo recebido';

        if (verificationCode === codeToCompare) {
            // Atualiza status no subdocumento do locatário
            await updateStatusField(fieldToUpdate, successValue);

            // Salva codVerf = 1 em /Solicitacoes/{soliciId}
            if (userType === 'locatario') {
                await docRef.update({ codVerf: 1 });
            }

            // Verifica se o outro lado também confirmou
            const carrosSnapshot = await carrosRef.get();
            const carrosData = carrosSnapshot.data();

            if (carrosData?.status?.[oppositeField] === oppositeValue) {
                setLoading(false);
                setLoading2(false);
                onSuccess();
                return true;
            }
        }

        // Locador também deve atualizar codVerf na raiz (independentemente da verificação)
        if (userType === 'locador') {
            await docRef.update({ codVerf: 1 });
        }

        return false;
    };

    const verifyWithTimeout = async () => {
        while (elapsedTime < maxDelay) {
            const isUpdated = await checkAndUpdate();

            if (isUpdated) return;

            await new Promise((resolve) => setTimeout(resolve, intervalCheck));
            elapsedTime += intervalCheck;
        }

        const failValue = userType === 'locatario' ? 'Veículo não recebido' : 'Veículo não entregue';
        const fieldToUpdate = userType === 'locatario' ? 'confirRecepLocata' : 'confirEntregaLocador';

        await updateStatusField(fieldToUpdate, failValue);

        throw new Error(`Tempo esgotado. Campo 'status.${fieldToUpdate}' não foi atualizado para '${failValue}'.`);
    };

    try {
        await verifyWithTimeout();
    } catch (error) {
        console.error("Erro na verificação:", error);
        setLoading(false);
        setLoading2(false);
        onFailure();
    }
};



type VerifyCodeDevolucaoParams = {
    soliciId: string;
    locatarioId: string;
    verificationCode: string;
    userType: 'locatario' | 'locador';
    onSuccess: () => void;
    onFailure: () => void;
    setLoading: (val: boolean) => void;
    setLoading2: (val: boolean) => void;
    maxDelay?: number;
};

export const verifyCodeServiceDevolucao = async ({
    soliciId,
    locatarioId,
    verificationCode,
    userType,
    onSuccess,
    onFailure,
    setLoading,
    setLoading2,
    maxDelay = 10000,
}: VerifyCodeDevolucaoParams) => {
    setLoading(true);
    setLoading2(true);

    const intervalCheck = 1000;
    let elapsedTime = 0;

    const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);
    const carrosRef = firebase
        .firestore()
        .collection('Locatarios')
        .doc(locatarioId)
        .collection('solicitacoes')
        .doc(soliciId);

    const updateStatusField = async (field: string, value: string) => {
        await carrosRef.update({
            [`status.${field}`]: value,
        });
    };

    const checkAndUpdate = async () => {
        const docSnapshot = await docRef.get();
        const data = docSnapshot.data();

        if (!data) return false;

        const codeToCompare = userType === 'locatario' ? data.locadorCode : data.locatarioCode;

        const fieldToUpdate = userType === 'locatario' ? 'confirDevoLocata' : 'confirRecepLocador';
        const successValue = userType === 'locatario' ? 'Veículo devolvido' : 'Veículo recebido';
        const oppositeField = userType === 'locatario' ? 'confirRecepLocador' : 'confirDevoLocata';
        const oppositeValue = userType === 'locatario' ? 'Veículo recebido' : 'Veículo devolvido';

        if (verificationCode === codeToCompare) {
            await updateStatusField(fieldToUpdate, successValue);

            const carrosSnapshot = await carrosRef.get();
            const carrosData = carrosSnapshot.data();

            if (carrosData?.status?.[oppositeField] === oppositeValue) {
                setLoading(false);
                setLoading2(false);
                onSuccess();
                return true;
            }
        }

        return false;
    };

    const verifyWithTimeout = async () => {
        while (elapsedTime < maxDelay) {
            const isUpdated = await checkAndUpdate();

            if (isUpdated) return;

            await new Promise((resolve) => setTimeout(resolve, intervalCheck));
            elapsedTime += intervalCheck;
        }

        const failValue = userType === 'locatario' ? 'Veículo não entregue' : 'Veículo não recebido';
        const fieldToUpdate = userType === 'locatario' ? 'confirDevoLocata' : 'confirRecepLocador';

        await updateStatusField(fieldToUpdate, failValue);

        throw new Error(`Tempo esgotado. Campo 'status.${fieldToUpdate}' não foi atualizado para '${failValue}'.`);
    };

    try {
        await verifyWithTimeout();
    } catch (error) {
        console.error("Erro na verificação:", error);
        setLoading(false);
        setLoading2(false);
        onFailure();
    }
};



type HandleVerificationCodeParams = {
  soliciId: string;
  locadorId: string;
  locatarioId: string;
  userType: 'locador' | 'locatario';
  generatedCode: string;
  onCodVerfFetched?: (codVerf: number) => void;
};

export const handleVerificationCode = async ({
  soliciId,
  locadorId,
  locatarioId,
  userType,
  generatedCode,
  onCodVerfFetched,
}: HandleVerificationCodeParams): Promise<void> => {
  try {
    const codeField = userType === 'locador' ? 'locadorCode' : 'locatarioCode';
    const docRef = firebase.firestore().collection('Solicitacoes').doc(soliciId);

    // Obtém dados atuais do documento
    const docSnapshot = await docRef.get();
    const existingData = (docSnapshot.data() || {}) as {
      locadorCode?: string;
      locatarioCode?: string;
      codVerf?: number;
    };

    // Garante que os IDs não sejam sobrescritos
    const updatedData = {
      ...existingData,
      locadorId,
      locatarioId,
      [codeField]: generatedCode,
      codVerf: existingData.codVerf ?? 0, // Define codVerf como 0 se ainda não existir
    };

    // Salva o código no Firestore
    await docRef.set(updatedData, { merge: true });

    // Busca novamente para retornar codVerf atualizado
    const finalSnapshot = await docRef.get();
    const finalData = finalSnapshot.data();
    const codVerf = finalData?.codVerf || 0;

    onCodVerfFetched?.(codVerf);
  } catch (error) {
    console.error('Erro ao lidar com código de verificação:', error);
    throw error;
  }
};
