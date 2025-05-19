import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Image, Modal, Pressable } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../utils/firebase';
import styles from './StylesCardList';

export default function Cards() {
    const [cards, setCards] = useState<{ id: string; cartaoNumero: string; cartaoData: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    // Exibe apenas os últimos 4 dígitos do cartão
    const maskCardNumber = (number: string) => {
        if (number.length > 4) {
            return ` ${number.slice(-4)}`; // Máscara para exibir apenas os últimos 4 dígitos
        }
        return number;
    };

    function CardsVisu(cardId: string) {
        router.push({
            pathname: '../DeleteCard/deletecard',
            params: { cardId } // Passa o cardId como parâmetro
        });
    }

    function CardsAdd() {
        router.replace('../AddCard/addcard');
    }

    const handleDelete = async (cardId: string) => {
        setLoading2(true);
        try {
            const uid = await AsyncStorage.getItem('userId');
            if (uid && cardId) {
                await firebase.firestore()
                    .collection('Locatarios')
                    .doc(uid)
                    .collection('cartoes')
                    .doc(cardId)
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
                setLoading2(false)
            } catch (error) {
                console.error("Erro ao buscar os cartões: ", error);
                setLoading(false);
                setLoading2(false);
            }
        };

        fetchCards(); // Chama a função para buscar os cartões
    }, []);

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
            <TouchableOpacity style={styles.Button} onPress={CardsAdd}>
                <FontAwesome6 name="square-plus" size={28} color="white" />
                <Text style={styles.text}>Adicionar cartão de crédito</Text>
            </TouchableOpacity>

            <View style={{ width: '100%' }}>
                {cards.map(card => (
                    <View key={card.id} style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <TouchableOpacity style={styles.opcao} onPress={() => CardsVisu(card.id)}>
                            <Text style={styles.textocampo}>
                                {maskCardNumber(card.cartaoNumero)} - {card.cartaoData} {/* Exibe a data como está */}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.opcao} onPress={() => handleDelete(card.id)}>
                            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#F2A51A" />
                        </TouchableOpacity>
                    </View>
                ))}
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
        </View>
    );
}
