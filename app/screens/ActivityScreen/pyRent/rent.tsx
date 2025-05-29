
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesRent';

export default function PagamentoScreen() {



    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [situ, setSitu] = useState('');

    const [caucao, setCaucao] = useState(0);

    const [nome, setNome] = useState<string | null>(null);
    const [perfilImage, setPerfilImage] = useState<string | null>(null);

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

    const [visto, setVisto] = useState('false');
    const [LocadorID, setLocadorID] = useState("Não disponível");
    const [carroID, setCarroID] = useState("Não disponível");

    const [EstadoPGCaucao, setEstadoPGCaucao] = useState("Caução Pago");
    const [EstadoPGAluguel, setEstadoPGAluguel] = useState("Aluguel pago");

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string }[]>([]);
    const [loading2, setLoading2] = useState(false);

    // Exibe apenas os últimos 4 dígitos do cartão
    const maskCardNumber = (number: string) => {
        if (number.length > 4) {
            return ` ${number.slice(-4)}`; // Máscara para exibir apenas os últimos 4 dígitos
        }
        return number;
    };



    useEffect(() => {
        if (!carroId) {
            console.log('carroId não está disponível ainda');
            return;
        }
        console.log(soliciId, locadorId, locatarioId, carroId);
        const fetchCarroData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (locadorId && carroId) {
                    const carroDoc = await firebase.firestore()
                        .collection('Locatarios')
                        .doc(locadorId)
                        .collection('carros')
                        .doc(carroId)
                        .get();

                    if (carroDoc.exists) {
                        const carroData = carroDoc.data();

                        setCaucao(carroData?.caucao || 'Não disponível');
                    }
                    setLocadorID(locadorId);
                    setCarroID(carroId);


                }
                if (locatarioId) {
                    const userDoc = await firebase.firestore().collection('Locatarios').doc(locatarioId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData) {
                            setNome(userData.nome || 'Usuário');
                            setPerfilImage(userData.fotoPerfil || null);
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do carro: ", error);
            } finally {
                setLoading(false); // Finaliza o carregamento
            }
        };
        fetchCarroData();
    }, [carroId]);



    useEffect(() => {
        const fetchCards = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    const snapshot = await firebase.firestore()
                        .collection('Locatarios')
                        .doc(uid)
                        .collection('cartoes')
                        .get();

                    const cardsData = snapshot.docs.map(doc => {
                        const data = doc.data();
                        if (data.cartaoNumero && data.cartaoData) {
                            return {
                                id: doc.id,
                                cartaoNumero: data.cartaoNumero,
                                cartaoData: data.cartaoData,
                            };
                        }
                        return null;
                    }).filter(Boolean); // Remove entradas nulas

                    setCards(cardsData as { id: string; cartaoNumero: string; cartaoData: string }[]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar os cartões: ", error);
                setLoading(false);
            }
        };

        fetchCards(); // Chama a função para buscar os cartões
    }, []);


    const handlePagar = async () => {
        setIsUploading(true);
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
            const carroRef = firebase.firestore()
                .collection('Locatarios')
                .doc(locatarioId)
                .collection('solicitacoes')
                .doc(soliciId);

            await carroRef.update({
                estadoPGAluguel: EstadoPGAluguel,
                cartãoNumAluguel: selectedCardId ? selectedCardId : null, // Atualiza para usar o cartão selecionado
            });

            setModalVisible(true);  // Exibe o modal
            setLoading2(false);
            // Remova o redirecionamento imediato daqui
        } catch (error) {
            console.error("Erro ao atualizar o estado de visto: ", error);
            setLoading(false);
            setLoading2(false);
            alert('Erro ao atualizar o estado de visto.');
        } finally {
            setIsUploading(false);
            setLoading(false);
            setLoading2(false);
        }
    };

    const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 100, // Mova 100 pixels para a direita
                    duration: 1000, // Duração da animação
                    useNativeDriver: true, // Usa a API nativa para melhor performance
                }),
                Animated.timing(translateX, {
                    toValue: -100, // Retorna à posição inicial
                    duration: 0, // Sem duração para retornar
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [translateX]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Animated.View style={{ transform: [{ translateX }] }}>
                    <Image style={styles.carlogo} source={require('../../../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>

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
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.foco}>Aluguel pago com sucesso</Text>
                        <Text style={styles.modalText}>
                            O pagamento do aluguel foi realizado com sucesso! Quando estiver pronto para pegar o veículo, entre na opção confirmação de posse.
                        </Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                router.replace('/(tabs)/activity');
                            }}>
                            <Text style={styles.textStyle}>Entendi!</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={modalVisible2}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible2(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.foco}>{situ}</Text>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible2(!modalVisible2);
                            }}>
                            <Text style={styles.textStyle}>Entendi!</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    );
}


