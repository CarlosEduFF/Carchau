import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Animated, Image, Modal, Pressable } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import firebase from '../../../../../utils/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesDeleteCard';

export default function VisualCards() {
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(true);
    const { cardId } = useLocalSearchParams();
    const router = useRouter();
    const [loading2, setLoading2] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Garantir que cardId é uma string
    const cardIdString = Array.isArray(cardId) ? cardId[0] : cardId;

    useEffect(() => {
        const fetchCardDetails = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid && cardIdString) {
                    const doc = await firebase.firestore()
                        .collection('Locatarios')
                        .doc(uid)
                        .collection('cartoes')
                        .doc(cardIdString)
                        .get();

                    if (doc.exists) {
                        const data = doc.data();
                        console.log('Dados do cartão:', data); // Adicione este log para depuração
                        setCardNumber(data?.cartaoNumero || '');
                        setCardName(data?.cartaoNome || '');
                        setExpiryDate(data?.cartaoData || '');
                        setCvv(data?.cvv || ''); // Assumindo que o CVV também está disponível
                    } else {
                        console.log('Documento não encontrado');
                    }
                }
                setLoading(false);
                setLoading2(false);
            } catch (error) {
                console.error("Erro ao buscar os detalhes do cartão: ", error);
                setLoading(false);
                setLoading2(false);
            }
        };

        fetchCardDetails();
    }, [cardIdString]);

    const handleDelete = async () => {
        setLoading2(true);
        try {
            const uid = await AsyncStorage.getItem('userId');
            if (uid && cardIdString) {
                await firebase.firestore()
                    .collection('Locatarios')
                    .doc(uid)
                    .collection('cartoes')
                    .doc(cardIdString)
                    .delete();
                setLoading2(false);
                setModalVisible(true);
            }
        } catch (error) {
            console.error("Erro ao deletar o cartão: ", error);
            alert('Erro ao deletar o cartão.');
            setLoading2(false);
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
                    <Image style={styles.carlogo} source={require('../../../../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Cartão */}
                <View style={styles.cartaocontainer}>
                    <Svg height="200" width="100%" style={styles.card}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <Stop offset="0%" stopColor="#1a1a1a" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#111111" stopOpacity="1" />
                            </LinearGradient>
                        </Defs>
                        <Rect x="0" y="0" width="100%" height="100%" rx="20" fill="url(#grad)" />
                    </Svg>

                    {/* Exibindo os detalhes do cartão */}
                    <View style={styles.cardDetails}>
                        <View>
                            <Text style={styles.name}>{cardName || 'XXXXXXXXXXXX'}</Text>
                        </View>
                        <Text style={styles.cardNumber}>{cardNumber || 'XXXX XXXX XXXX XXXX'}</Text>

                        <View style={styles.row}>
                            <Text style={styles.label}>Validade</Text>
                            <Text style={styles.expiry}>{expiryDate || 'XX/XX'}</Text>
                            <View style={styles.separacao}></View>

                            <Text style={styles.label}>CVV</Text>
                            <Text style={styles.cvv}>{cvv || 'XXX'}</Text>
                        </View>
                    </View>

                    {/* Logo do Mastercard - placeholder para uma imagem */}
                    <View style={styles.logo}>
                        <ImageBackground
                            // source={require('./path_to_your_mastercard_logo.png')}
                            style={{ width: 50, height: 30 }}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                <View style={{ width: '100%', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={handleDelete}>
                        <Text style={{ fontWeight: 'bold', color: '#fff' }}>Excluir</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Cartão deletado com Sucesso!</Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    router.replace('../ViewCardList/card-list');
                                }}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    );
}


