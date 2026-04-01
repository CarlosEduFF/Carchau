import React, { useState } from 'react';
import { View, Text, ImageBackground, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../config/firebase';
import { router } from 'expo-router';
import styles from './StylesAddCard';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal/CustomModal';
import { routes } from '~/constants/routes';
import { formatCardNumber, formatExpiryDate, isValidCardName, isValidCardNumber, isValidCVV, isValidExpiryDate } from '~/utils/validators';
import { getUserId } from '~/services/carUpdateService';
import saveCardData from '~/services/cardSaveService'
import { Components } from '~/components';

export default function CarRegistrationScreen() {
    // Estados para armazenar os dados do cartão
    const [cardNumber, setCardNumber] = useState('');
    const [cardName, setCardName] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');



    const handleSave = async () => {
        // Validação local antes de iniciar o processo
        if (!isValidCardNumber(cardNumber)) {
            setSitu('Número do cartão inválido!');
            setModalVisible2(true);
            return;
        }
        if (!isValidCardName(cardName)) {
            setSitu('Digite o nome do titular do cartão!');
            setModalVisible2(true);
            return;
        }
        if (!isValidExpiryDate(expiryDate)) {
            setSitu('Data de validade inválida!');
            setModalVisible2(true);
            return;
        }
        if (!isValidCVV(cvv)) {
            setSitu('CVV inválido!');
            setModalVisible2(true);
            return;
        }

        setLoading2(true);

        try {
            const uid = await getUserId();
            await saveCardData(uid, cardNumber, cardName, expiryDate, cvv);
            setModalVisible(true);
        } catch (error: any) {
            console.error('Erro ao salvar os dados do cartão: ', error);
            setSitu(error.message || 'Erro ao salvar os dados do cartão.');
            setModalVisible2(true);
        } finally {
            setLoading2(false);
        }
    };


    return (
        <View style={styles.container}>
            <Components.BackButton />
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <ScrollView>
                <View style={styles.ViewCard}>
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
                            <Text style={styles.cardNumber}>
                                {cardNumber ? formatCardNumber(cardNumber) : 'XXXX XXXX XXXX XXXX'}
                            </Text>


                            <View style={styles.row}>
                                <Text style={styles.label}>Validade</Text>
                                <Text style={styles.expiry}>
                                    {expiryDate ? formatExpiryDate(expiryDate) : 'MM/YY'}
                                </Text>

                                <View style={styles.separacao}></View>

                                <Text style={styles.label}>CVV</Text>
                                <Text style={styles.cvv}>{cvv || 'XXX'}</Text>
                            </View>
                        </View>

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
                            onChangeText={(text) => {
                                setExpiryDate(text); // <-- Usa 'text' e não 'rawText'
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
                    <TouchableOpacity style={styles.button} onPress={handleSave}>
                        <Text style={styles.TextButton}>Adicionar cartão</Text>
                    </TouchableOpacity>
                </View>

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="Cartão cadastrado com Sucesso!"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
                        router.replace(routes.viewCard);
                    }}
                />

                <CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message={situ}
                    onConfirm={() => {
                        setModalVisible2(!modalVisible2)
                    }}
                />
            </ScrollView>
        </View>
    );
}

