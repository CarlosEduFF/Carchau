
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesCaucao';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { routes } from '~/constants/routes';
import CustomModal from '~/components/CustomModal';
import { fetchSolicitacaoById } from '~/services/requestService';
import { fetchCards } from '~/services/cardService';
import { pagarCaucao } from '~/services/paymentService';

export default function PagamentoScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');


    const [caucao, setCaucao] = useState(0);

    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;

    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;

    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;

    const totalValorParam = useLocalSearchParams()?.TotalValor;
    const totalValor = Array.isArray(totalValorParam) ? totalValorParam[0] : totalValorParam;

    const [EstadoPGCaucao, setEstadoPGCaucao] = useState("Caução pago");

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string }[]>([]);

    const [loading, setLoading] = useState(true); // Inicializando como true para mostrar carregamento
    const [loading2, setLoading2] = useState(false);

    const maskCardNumber = (number: string) => {
        if (number.length > 4) {
            return ` ${number.slice(-4)}`; // Máscara para exibir apenas os últimos 4 dígitos
        }
        return number;
    };

    const fetchSolicitacaoData = async () => {
        try {
            if (soliciId && locatarioId) {
                const solicitacao = await fetchSolicitacaoById(locatarioId, soliciId);
                if (solicitacao) {
                    setCaucao(solicitacao.caucao);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados da solicitação: ", error);
            setSitu("Erro ao buscar dados da solicitação");
            setModalVisible2(true);
        } finally {
            setLoading(false);
        }
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
        fetchSolicitacaoData();
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
            await pagarCaucao(locatarioId, soliciId, EstadoPGCaucao, selectedCardId);
            setModalVisible(true);
        } catch (error) {
            setSitu('Erro ao atualizar o pagamento.');
            console.error("Erro ao atualizar o estado de visto: ", error);
            setModalVisible2(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo}></View>
            <View style={{ padding: 38 }}>
                <View style={styles.section}>
                    <Text style={styles.label2}>Valor da caução :</Text>
                    <Text style={styles.value2}>R$ {caucao}</Text>
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
                    <Text style={styles.buttonText}>Pagar Caução</Text>
                </TouchableOpacity>
            </View>
            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message={`O pagamento do caução foi realizado com sucesso! Realize o pagamento do aluguel para finalizar a locação!`}
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


