import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesVerfLessee';
import VerificationCodeInput from '~/components/VerificationCodeInput';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal';
import { handleVerificationCode, verifyCodeServiceDevolucao, verifyCodeServiceEntr } from '~/services/verfifyCodeService';

export default function VerificacaoLocatario() {
    const [verificationCode, setVerificationCode] = useState(''); // Para armazenar o código que o usuário insere
    const [generatedCode, setGeneratedCode] = useState(''); // Código gerado automaticamente
    const [timer, setTimer] = useState(120); // Timer de 2 minutos
    const [situ, setSitu] = useState('');
    const [loading, setLoading] = useState(false); // Inicializando como true para mostrar carregamento
    const [loading2, setLoading2] = useState(false);
    const [RepLoca, setRepLoca] = useState('');
    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [confiPosse, setConfiPosse] = useState('Veículo recebido');
    const [codVerf, setCodVerf] = useState(0);


    // 1. Gera o código ao carregar a tela
    useEffect(() => {
        generateCode(); // gera e atualiza o estado
    }, []);

    // 2. Executa o fluxo de código (salvar e buscar codVerf)
    useEffect(() => {
        if (generatedCode) {
            handleVerificationCode({
                soliciId,
                locadorId,
                locatarioId,
                userType: 'locatario',
                generatedCode,
                onCodVerfFetched: setCodVerf,
            });
        }
    }, [generatedCode]);

    // 3. Temporizador de 120 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev > 0) {
                    return prev - 1;
                } else {
                    generateCode(); // gera novo código e reinicia fluxo
                    return 120;
                }
            });
        }, 1000);

        return () => clearInterval(interval); // limpa intervalo ao desmontar
    }, []);

    // 4. Função local para gerar código
    const generateCode = () => {
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(newCode);
    };


    const verifyCodeEn = async () => {
        await verifyCodeServiceEntr({
            soliciId,
            locatarioId,
            verificationCode,
            userType: 'locatario',
            onSuccess: () => setModalVisible(true),
            onFailure: () => setModalVisible2(true),
            setLoading,
            setLoading2,
        });
    };

    const verifyCodeDe = async () => {
        await verifyCodeServiceDevolucao({
            soliciId,
            locatarioId,
            verificationCode,
            userType: 'locatario',
            onSuccess: () => setModalVisible(true),
            onFailure: () => setModalVisible2(true),
            setLoading,
            setLoading2,
        });
    };

    const handleNumberPress = (num: string) => {
        if (verificationCode.length < 4) {
            setVerificationCode(verificationCode + num);
        }
    };

    const handleDelete = () => {
        setVerificationCode(verificationCode.slice(0, -1));
    };

    return (
        <ScrollView style={styles.containerScroll}>
            <View style={styles.container}>
                {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
                <VerificationCodeInput
                    generatedCode={generatedCode}
                    verificationCode={verificationCode}
                    timer={timer}
                    handleNumberPress={handleNumberPress}
                    handleDelete={handleDelete}
                />

                <TouchableOpacity style={styles.button} onPress={() => {
                    if (codVerf == 0) {
                        verifyCodeEn();
                        setLoading2(true);
                    } else if (codVerf == 1) {
                        verifyCodeDe();
                        setLoading2(true);
                    }
                    setLoading2(true);
                }}>
                    <Text style={{ color: 'white' }}>Verificar Código</Text>
                </TouchableOpacity>


                <CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message="A confirmação de posse não foi realizada, tente novamente, após a geração
                                do novo código."
                    confirmText="Entendi"
                    onConfirm={() => {
                        setModalVisible2(false);
                    }}
                />

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="A confirmação de posse foi realizada, o veiculo pode ser transferido de posse
                                para o locatário com segurança."
                    confirmText="Entendi"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
                        router.replace('/(tabs)/activity');
                    }}
                />

            </View>
        </ScrollView>
    );
}