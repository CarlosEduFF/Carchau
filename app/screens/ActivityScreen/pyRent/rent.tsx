
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesRent';
import { fetchCards } from '~/services/cardService';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { pagarRent } from '~/services/paymentService';
import { routes } from '~/constants/routes';
import CustomModal from '~/components/CustomModal/CustomModal';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { fetchSolicitacaoById } from '~/services/requestService';

export default function PagamentoScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [situ, setSitu] = useState('');

    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
    const carroIdParam = useLocalSearchParams()?.carroId;
    const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
    const TotalValorParam = useLocalSearchParams()?.TotalValor;
    const TotalValor = Array.isArray(TotalValorParam) ? TotalValorParam[0] : TotalValorParam;

    const [totalValor, setotalValor] = useState(parseFloat(TotalValor));
    const [estadoPGAluguel, setEstadoPGAluguel] = useState("Aluguel pago");

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string }[]>([]);

    // Ajuste para dev: IP local (já conversamos). Em produção use uma URL segura.
    const LOCAL_HOST_IP = '192.168.15.23';
    const BACKEND_BASE = (__DEV__ ? `http://${LOCAL_HOST_IP}:4242` : 'https://seu-backend-production.com');


    // 1) chama backend para criar PaymentIntent e inicializar PaymentSheet
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

            if (!totalValor || Number(TotalValor) <= 0) {
                setSitu('Valor inválido');
                setModalVisible2(true);
                return;
            }

            // Inicializa o PaymentSheet
            await initializePaymentSheet(Number(TotalValor));

            // Apresenta o PaymentSheet ao usuário
            const { error } = await presentPaymentSheet();

            if (error) {
                setSitu('Ocorreu um erro no pagamento, tente novamente mais tarde.');
                setModalVisible2(true);
                return;
            }

            await pagarRent(locatarioId, soliciId, estadoPGAluguel);
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
            {loading && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo} />
            <View style={{ padding: 38 }}>
                <View style={styles.section}>
                    <Text style={styles.label2}>Valor da Aluguel:</Text>
                    <Text style={styles.value2}>{`R$ ${Number(totalValor).toFixed(2)}`}</Text>
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
                message={`O pagamento do aluguel foi realizado com sucesso! Quando estiver pronto para pegar o veículo, entre na opção confirmação de posse.`}
                confirmText="Entendi"
                onConfirm={() => {
                    setModalVisible(!modalVisible);
                    router.replace(routes.activity);
                }}
            />
            <CustomModal
                visible={modalVisible2}
                onClose={() => setModalVisible2(false)}
                message={situ}
                confirmText="Entendi"
                onConfirm={() => {
                    setModalVisible2(!modalVisible2);
                }}
            />
        </View>
    );
}


