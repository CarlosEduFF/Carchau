import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesCaucao';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal/CustomModal';
import { fetchSolicitacaoById } from '~/services/requestService';
import { useStripe } from '@stripe/stripe-react-native';
import { pagarCaucao } from '~/services/paymentService';
// import { pagarCaucao } from '~/services/paymentService'; // descomente quando tiver

export default function PagamentoScreen() {
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [caucao, setCaucao] = useState<number>(0);

    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    // Ajuste para dev: IP local (já conversamos). Em produção use uma URL segura.
    const LOCAL_HOST_IP = '192.168.15.23';
    const BACKEND_BASE = (__DEV__ ? `http://${LOCAL_HOST_IP}:4242` : 'https://seu-backend-production.com');
    const [EstadoPGCaucao, setEstadoPGCaucao] = useState("Caução pago");
    // Carrega dados ao montar
    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                if (soliciId && locatarioId) {
                    const solicitacao = await fetchSolicitacaoById(locatarioId, soliciId);
                    if (!mounted) return;
                    if (solicitacao && typeof solicitacao.caucao !== 'undefined') {
                        setCaucao(Number(solicitacao.caucao) || 0);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar dados da solicitação:', error);
                setSitu('Erro ao buscar dados da solicitação');
                setModalVisible2(true);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        load();
        return () => {
            mounted = false;
        };
    }, [soliciId, locatarioId]);

    // assume BACKEND_BASE, locatarioId, soliciId, initPaymentSheet já disponíveis no escopo
    const initializePaymentSheet = async (amountBRL: number) => {
        try {
            const resp = await fetch(`${BACKEND_BASE}/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amountBRL,
                    metadata: { locatarioId, soliciId, tipo: 'caucao' },
                }),
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || 'Erro criando PaymentIntent');
            }

            const { clientSecret } = await resp.json();
            if (!clientSecret) throw new Error('clientSecret ausente');

            // inicializa PaymentSheet incluindo Google Pay (e Apple Pay se quiser)
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Carchau',

                // --- GOOGLE PAY (Android) ---
                googlePay: {
                    merchantCountryCode: 'BR',   // seu país (BR para Brasil)
                    testEnv: __DEV__,           // true em desenvolvimento para ambiente de teste do Google Pay
                },

            });

            if (initError) {
                console.error('initPaymentSheet error:', initError);
                throw initError;
            }

            return true;
        } catch (error: any) {
            console.error('initializePaymentSheet error:', error);
            throw error;
        }
    };


    const handlePagarComCartao = async () => {
        try {
            setLoading2(true);

            if (!caucao || Number(caucao) <= 0) {
                Alert.alert('Valor inválido', 'Valor da caução inválido.');
                return;
            }

            // Inicializa o PaymentSheet
            await initializePaymentSheet(Number(caucao));

            // Apresenta o PaymentSheet ao usuário
            const { error } = await presentPaymentSheet();

            if (error) {
                setSitu('Ocorreu um erro no pagamento, tente novamente mais tarde.');
                setModalVisible2(true);
                return;
            }

            await pagarCaucao(locatarioId, soliciId, EstadoPGCaucao);
            setModalVisible(true);

        } catch (error) {
            console.error("Erro ao atualizar o pagamento:", error);
            setSitu('Erro ao atualizar o pagamento.');
            setModalVisible2(true);
        } finally {
            setLoading2(false);
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}

            <View style={styles.Topo} />
            <View style={{ padding: 38 }}>
                <View style={styles.section}>
                    <Text style={styles.label2}>Valor da caução :</Text>
                    <Text style={styles.value2}>{`R$ ${Number(caucao).toFixed(2)}`}</Text>
                </View>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={styles.subheader}>Pagar com cartão</Text>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.acceptButton, loading2 || loading ? { opacity: 0.6 } : undefined]}
                    onPress={handlePagarComCartao}
                    disabled={loading || loading2}
                >
                    <Text style={styles.buttonText}>Pagar Caução com Cartão</Text>
                </TouchableOpacity>
            </View>

            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message="Pagamento realizado com sucesso!"
                confirmText="Ok"
                onConfirm={() => {
                    setModalVisible(false);
                    router.replace('/activity');
                }}
            />

            <CustomModal
                visible={modalVisible2}
                onClose={() => setModalVisible2(false)}
                message={situ}
                confirmText="Ok"
                onConfirm={() => setModalVisible2(false)}
            />
        </View>
    );
}
