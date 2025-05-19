
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Pressable, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../utils/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesCaucao';

export default function PagamentoScreen() {





    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Inicializando como true para mostrar carregamento




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

    const totalValorParam = useLocalSearchParams()?.TotalValor;
    const totalValor = Array.isArray(totalValorParam) ? totalValorParam[0] : totalValorParam;




    const [visto, setVisto] = useState('false');
    const [LocadorID, setLocadorID] = useState("Não disponível");
    const [carroID, setCarroID] = useState("Não disponível");

    const [EstadoPGCaucao, setEstadoPGCaucao] = useState("Caução pago");
    const [EstadoPGAluguel, setEstadoPGAluguel] = useState("Aluguel não pago");

    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string }[]>([]);

    const [loading, setLoading] = useState(true); // Inicializando como true para mostrar carregamento
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
                setIsLoading(false); // Finaliza o carregamento
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
                    console.log(cards);
                }
                setLoading(false)
            } catch (error) {
                console.error("Erro ao buscar os cartões: ", error);
                setLoading(false);
            }
        };

        fetchCards(); // Chama a função para buscar os cartões
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
            const carroRef = firebase.firestore()
                .collection('Locatarios')
                .doc(locatarioId)
                .collection('solicitacoes')
                .doc(soliciId);

            await carroRef.update({
                estadoPGCaucao: EstadoPGCaucao,
                cartãoNumCaucao: selectedCardId ? selectedCardId : null, // Atualiza para usar o cartão selecionado
            });

            setLoading2(false);
            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao atualizar o estado de visto: ", error);
            alert('Erro ao atualizar o estado de visto.');
            setLoading(false);
        } finally {
            setIsUploading(false);
            setLoading(false);
        }
    };

    const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda

    useEffect(() => {
        const animation = Animated.loop(
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
        );

        if (loading || loading2) {
            animation.start();
        }

        // Para parar a animação quando os carregamentos não estiverem ativos
        return () => animation.stop();
    }, [loading, loading2, translateX]);

    if (loading || loading2) {
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

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.foco}>Caução pago com sucesso</Text>
                        <Text style={styles.modalText}>
                            O pagamento do caução foi realizado com sucesso! Realize o pagamento do aluguel para finalizar a locação!
                        </Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                router.replace('/(tabs)/activity');
                            }}
                        >
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


