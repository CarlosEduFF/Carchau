
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesRent';
import { fetchCards } from '~/services/cardService';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { pagarRent } from '~/services/paymentService';
import { routes } from '~/constants/routes';
import CustomModal from '~/components/CustomModal';

export default function PagamentoScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [loading, setLoading] = useState(true);
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

    const maskCardNumber = (number: string) => {
        if (number.length > 4) {
            return ` ${number.slice(-4)}`; // Máscara para exibir apenas os últimos 4 dígitos
        }
        return number;
    };

    const loadCards = async () => {
        setLoading(true);
        const result = await fetchCards();
        if (result) {
            setCards(result);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadCards();
    }, []);

    const handlePagar = async () => {
        try {
            const uid = await AsyncStorage.getItem('userId');
            if (!uid) {
                alert('Erro ao obter ID do usuário.');
                return;
            }
            if (!selectedCardId) {
                setSitu('Escolha um cartão para realizar o pagamento!');
                setModalVisible2(true);
                return;
            }
            await pagarRent(locatarioId, soliciId, estadoPGAluguel, selectedCardId);
            setModalVisible(true);
        } catch (error) {
            setLoading(false);
            setLoading2(false);
            setSitu('Erro ao atualizar o estado de visto.');
        } finally {
            setLoading(false);
            setLoading2(false);
        }
    };


    return (
        <View style={styles.container}>
            {loading && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo}></View>
            <View style={{ padding: 38 }}>

                <View style={styles.section}>
                    <Text style={styles.label2}>Valor total do Aluguel :</Text>
                    <Text style={styles.value2}>R$ {totalValor.toFixed(2)}</Text>
                </View>

            </View>
            <View style={{ borderWidth: 0.5, borderColor: '#888' }}></View>

            <View style={{ padding: 20 }}>
                <Text style={styles.subheader}>Pagar com :</Text>
            </View>
            {cards.length === 0 ? (
                <Text style={styles.cardText}>Nenhum cartão cadastrado.</Text>
            ) : (
                cards.map(card => (
                    <View key={card.id} style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity
                            style={styles.opcao}
                            onPress={() => setSelectedCardId(card.id)} // Atualiza o cartão selecionado ao pressionar
                        >
                            <Text style={[styles.value2, { padding: 14 }]}>
                                {maskCardNumber(card.cartaoNumero)} - {card.cartaoData}
                            </Text>
                            {/* Adicionando um radiobutton */}
                            {selectedCardId === card.id ? (
                                <MaterialCommunityIcons name="radiobox-marked" size={24} color="#f2a51a" />
                            ) : (
                                <MaterialCommunityIcons name="radiobox-blank" size={24} color="#888" />
                            )}
                        </TouchableOpacity>
                    </View>
                ))
            )}


            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.acceptButton} onPress={() => { handlePagar(), setLoading2(true) }}>
                    <Text style={styles.buttonText}>Pagar Aluguel</Text>
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


