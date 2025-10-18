import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router'; // Para pegar os parâmetros passados na navegação
import styles from './StylesVerflessor';
import VerificationCodeInput from '~/components/VerificationCodeInput';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal/CustomModal';
import { handleVerificationCode, verifyCodeServiceDevolucao, verifyCodeServiceEntr } from '~/services/verfifyCodeService';

export default function VerificacaoLocador() {
    // Estados para armazenar código de verificação do usuário e o código gerado
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [RepLoca, setRepLoca] = useState('');
    const [timer, setTimer] = useState(120); // Timer de 2 minutos para expiração do código
    const [loading, setLoading] = useState(false); // Inicializando como true para mostrar carregamento
    const [loading2, setLoading2] = useState(false);
    // Parâmetros passados via navegação
    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [confiPosse, setConfiPosse] = useState('Veículo entregue');
    const [codVerf, setCodVerf] = useState(0);

    const generateCode = () => {
        const newCode = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(newCode);
    };

    useEffect(() => {
        generateCode(); // Gera o código ao iniciar
    }, []);

    useEffect(() => {
        const execute = async () => {
            handleVerificationCode({
                soliciId,
                locadorId,
                locatarioId,
                userType: 'locador',
                generatedCode,
                onCodVerfFetched: setCodVerf,
            });
        };

        if (generatedCode) {
            execute();
        }
    }, [generatedCode]);

    // Timer de renovação do código a cada 120s
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev > 0) return prev - 1;
                const newCode = Math.floor(1000 + Math.random() * 9000).toString();
                setGeneratedCode(newCode);
                return 120;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Verifica o código do locatário
    const verifyCodeEn = async () => {
        await verifyCodeServiceEntr({
            soliciId,
            locatarioId,
            verificationCode,
            userType: 'locador',
            onSuccess: () => setModalVisible(true),
            onFailure: () => setModalVisible2(true),
            setLoading,
            setLoading2,
            maxDelay: 5000, // tempo diferente, se quiser
        });

    };

    const verifyCodeDe = async () => {
        await verifyCodeServiceDevolucao({
            soliciId,
            locatarioId,
            verificationCode,
            userType: 'locador',
            onSuccess: () => setModalVisible(true),
            onFailure: () => setModalVisible2(true),
            setLoading,
            setLoading2,
            maxDelay: 5000, // Opcional: tempo mais curto para locador
        });
    };

    // Adiciona número ao código inserido pelo usuário
    const handleNumberPress = (num: string) => {
        if (verificationCode.length < 4) {
            setVerificationCode(verificationCode + num); // Limita o código a 4 dígitos
        }
    };

    // Apaga o último número inserido
    const handleDelete = () => {
        setVerificationCode(verificationCode.slice(0, -1));
    };
    return (
        <ScrollView style={styles.containerScroll}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.container}>
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
                        console.log('0');
                        setLoading2(true);
                    } else if (codVerf == 1) {
                        verifyCodeDe();
                        setLoading2(true);
                        console.log('1');
                    }
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