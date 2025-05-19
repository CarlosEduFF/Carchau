import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable } from 'react-native';
import firebase from '../../../../utils/firebase';
import { CheckBox } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { router } from 'expo-router';
import styles from './StylesReportProblem';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';


export default function InformacoesPessoais() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [perfilImage, setPerfilImage] = useState<string | null>(null); // Estado inicial como null
    const defaultProfileImage = require('../../../../assets/icons/Profile-Icon.png'); // Caminho local da imagem padrão
    const upload = require('../../../../assets/icons/Upload-Icon.png');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [situ, setSitu] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean | null>(null);


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData) {
                            setEmail(userData.email || '');
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário: ", error);
            }
        };
        fetchUserData();
        setLoading(false);
    }, []);

    const onSubmit = async () => {
        if (!mensagem.trim()) {
            setSitu('Por favor, preencha o campo antes de enviar.');
            setModalVisible2(true);
            return;
        }

        try {
            await send(
                'service_86gb92g',
                'template_79fg633',
                {
                    message: `De: ${email}, Mensagem: ${mensagem}`
                },
                {
                    publicKey: 'SiC6YxyJOy4p5Hlqs',
                },
            );

            setSitu('SUCCESS!');
            setModalVisible(true);
        } catch (err) {
            if (err instanceof EmailJSResponseStatus) {
                console.log('EmailJS Request Failed...', err);
            }

            setSitu("Erro");
            setModalVisible2(true);
        }
        setLoading2(false);
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
            <ScrollView style={styles.scroll}>
                <View style={{ marginTop: 20 }}></View>
                <Text style={styles.textocampo}>Algum problema com o Uso da Aplicação ou com o Aplicativo?</Text>

                <Text style={styles.textocampo}>Relate o seu problema:</Text>
                <TextInput
                    style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                    multiline
                    value={mensagem}
                    onChangeText={text => setMensagem(text)}
                    placeholder="Digite seu problema aqui ..."
                    placeholderTextColor="#888888"
                />

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.buttonSave} onPress={() => { onSubmit(), setLoading2(true) }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
                    </TouchableOpacity>
                </View>

                {/* Modal Sucesso */}
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Relato enviado com sucesso!</Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(false);
                                    router.replace('/(tabs)/account');
                                }}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                {/* Modal Erro */}
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
                                    setModalVisible(!modalVisible2);
                                    router.replace('/(tabs)/account');
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