import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, TextInput, Animated, Image, Modal, Pressable } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../utils/firebase';
import { router } from 'expo-router';
import styles from './StylesAddCard';


export default function CarRegistrationScreen() {
    // Estados para armazenar os dados do cartão
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState<boolean | null>(null);;
    const [loading2, setLoading2] = useState<boolean | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');

    const handleTextChange = (text: string, setCardName: { (value: React.SetStateAction<string>): void; (arg0: any): void; }) => {
        const uppercaseText = text.toUpperCase();
        setCardName(uppercaseText);
    };
    const handleSave = async () => {

        try {
            const uid = await AsyncStorage.getItem('userId');
            if (!uid) {
                alert('Erro ao obter ID do usuário.');
                return;
            }

            // Validação simples
            if (cardNumber.length !== 19) {
                setSitu('Preencha corretamente os números do cartão!');
                setModalVisible2(true);
                return;
            } else if (!cardName) {
                setSitu('Preencha corretamente o nome no cartão.');
                setModalVisible2(true);
                return;
            } else if (expiryDate.length !== 5) {
                setSitu('Preencha corretamente a data de validade do cartão.');
                setModalVisible2(true);
                return;
            } else if (cvv.length !== 3) {
                setSitu('Preencha corretamente o código de segurança do cartão.');
                setModalVisible2(true);
                return;
            } else {
                setLoading2(true);
            }

            const cardsRef = firebase.firestore()
                .collection('Locatarios')
                .doc(uid)
                .collection('cartoes');

            await cardsRef.add({
                cartaoNumero: cardNumber,
                cartaoNome: cardName.toUpperCase(),
                cartaoData: expiryDate,
                cvv: cvv,
            });
            setSitu('Cartão cadastrado com Sucesso!');
            setModalVisible(true);

            setLoading2(false);

        } catch (error) {
            setLoading2(false);
            console.error("Erro ao salvar os dados do cartão: ", error);
            alert('Erro ao salvar os dados do cartão.');
        } finally {
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
            <ScrollView>
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                <Text style={styles.name}>{cardName.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.cardNumber}>{cardNumber || 'XXXX XXXX XXXX XXXX'}</Text>

                            <View style={styles.row}>
                                <Text style={styles.label}>Validade</Text>
                                <Text style={styles.expiry}>{expiryDate || 'MM/YY'}</Text>
                                <View style={styles.separacao}></View>

                                <Text style={styles.label}>CVV</Text>
                                <Text style={styles.cvv}>{cvv || 'XXX'}</Text>
                            </View>
                        </View>

                        {/* Logo do Mastercard - placeholder para uma imagem */}
                        <View style={styles.logo}>
                            <ImageBackground
                                style={{ width: 50, height: 30 }}
                                resizeMode="contain"
                            />
                        </View>
                    </View>
                </View>
                {/* Formulário para inserir os dados do cartão */}
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.textocampo}>Número do cartão:</Text>
                    <MaskedTextInput
                        mask="9999 9999 9999 9999"
                        value={cardNumber}
                        onChangeText={(text, rawText) => setCardNumber(rawText)} // `rawText` é o valor sem máscara
                        style={styles.input}
                        placeholder="XXXX XXXX XXXX XXXX"
                        placeholderTextColor="#888888"
                        keyboardType="numeric"
                    />

                    <Text style={styles.textocampo}>Nome como no cartão:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="#888888"
                        value={cardName}
                        onChangeText={text => setCardName(text)}
                    />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column', width: '40%' }}>
                        <Text style={styles.textocampo}>Validade:</Text>
                        <MaskedTextInput
                            mask="99/99"
                            value={expiryDate}
                            onChangeText={(text, rawText) => {
                                // Validação de mês
                                const month = parseInt(rawText.substring(0, 2), 10);

                                if (!isNaN(month) && (month < 1 || month > 12)) {
                                    setExpiryDate('');
                                    return;
                                }

                                setExpiryDate(rawText);
                            }}
                            style={styles.input}
                            placeholder="MM/YY"
                            placeholderTextColor="#888888"
                            keyboardType="numeric"
                        />

                    </View>

                    <View style={{ flexDirection: 'column', width: '40%' }}>
                        <Text style={styles.textocampo}>CVV:</Text>
                        <MaskedTextInput
                            mask="999"
                            value={cvv}
                            onChangeText={(text, rawText) => setCvv(rawText)}
                            style={styles.input}
                            placeholder="XXX"
                            placeholderTextColor="#888888"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        handleSave();
                    }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18, }}>Adicionar cartão</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Cartão cadastrado com Sucesso!</Text>
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
            </ScrollView>
        </View>
    );
}

