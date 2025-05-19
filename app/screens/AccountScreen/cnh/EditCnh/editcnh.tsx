import { router } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, Animated, Modal, Pressable } from 'react-native';
import firebase from '../../../../../utils/firebase';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome } from '@expo/vector-icons';
import styles from './StylesEditcnh';

export default function CNH() {
    const [frontCNH, setFrontCNH] = useState<string | null>(null);
    const [backCNH, setBackCNH] = useState<string | null>(null);
    const [existingImages, setExistingImages] = useState<{ front: string, back: string } | null>(null);
    const defaultProfileImage = require('../../../../../assets/icons/Profile-Icon.png');
    const upload = require('../../../../../assets/icons/Upload-Icon.png');
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean | null>(null);
    const [situ, setSitu] = useState('');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    const doc = await firebase.firestore().collection('Locatarios').doc(uid).collection('documentos').doc('cnh').get();
                    if (doc.exists) {
                        const data = doc.data();
                        if (data) {
                            setExistingImages({ front: data.fotoFront, back: data.fotoBack });
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar dados da CNH: ", error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const uid = await AsyncStorage.getItem('userId');
            if (!uid) throw new Error("Usuário não encontrado. Faça login novamente.");

            if (!frontCNH) {
                setSitu('Tire foto da parte da frente da sua CNH');
                setModalVisible2(true);
                return;
            } else if (!backCNH) {
                setSitu('Tire foto da parte de trás da sua CNH');
                setModalVisible2(true);
                return;
            } else {
                setLoading2(true);
            }

            const updateData: { fotoFront?: string, fotoBack?: string } = {};

            const uploadImage = async (imageUri: string, imageType: 'front' | 'back') => {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const storageRef = firebase.storage().ref().child(`cnh/${uid}/${imageType}`);
                const snapshot = await storageRef.put(blob);
                return await snapshot.ref.getDownloadURL();
            };

            if (frontCNH) {
                const frontUrl = await uploadImage(frontCNH, 'front');
                updateData.fotoFront = frontUrl;
            }

            if (backCNH) {
                const backUrl = await uploadImage(backCNH, 'back');
                updateData.fotoBack = backUrl;
            }

            const documentRef = firebase.firestore().collection('Locatarios').doc(uid).collection('documentos').doc('cnh');

            // Verifica se o documento existe
            const docSnapshot = await documentRef.get();
            if (docSnapshot.exists) {
                // Se existir, atualiza
                await documentRef.update(updateData);
            } else {
                // Se não existir, cria o documento
                await documentRef.set(updateData);
            }

            setModalVisible(true);
            setLoading2(false);
        } catch (error) {
            console.error("Erro ao salvar CNH: ", error);
            setSitu("Erro ao salvar CNH, tente novamente!")
            setModalVisible2(true);
            setLoading2(false);
        }
    };


    const handleImagePicker = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [6, 4],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
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
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.text}>Cadastre ou Edite sua CNH</Text>
                <Text style={styles.textocampo}>Para maior segurança, e conforme ordena  Art. 141 do CTB,
                    cadastre as imagens da sua CNH.</Text>

                {/* Imagem da frente da CNH */}
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textocampo}>Frente da CNH:</Text>
                    {frontCNH || existingImages?.front ? (
                        <Image
                            style={styles.profileImage}
                            source={{ uri: frontCNH || existingImages?.front }}
                            onError={(error) => console.log("Erro ao carregar imagem:", error)}
                        />
                    ) : (
                        <FontAwesome style={styles.icondelet} name="id-card-o" size={220} color="#f2a51a" />
                    )}
                    <TouchableOpacity style={styles.input} onPress={() => handleImagePicker(setFrontCNH)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione a foto da Frente</Text>
                            <Image
                                style={styles.iconUpl}
                                source={upload}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Imagem do verso da CNH */}
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.textocampo}>Verso da CNH:</Text>
                    {backCNH || existingImages?.back ? (
                        <Image
                            style={styles.profileImage}
                            source={{ uri: backCNH || existingImages?.back }}
                            onError={(error) => console.log("Erro ao carregar imagem:", error)}
                        />
                    ) : (
                        <FontAwesome style={styles.icondelet} name="id-card-o" size={220} color="#f2a51a" />
                    )}
                    <TouchableOpacity style={[styles.input]} onPress={() => handleImagePicker(setBackCNH)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione a foto do Verso</Text>
                            <Image
                                style={styles.iconUpl}
                                source={upload}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>CNH atualizada com Sucesso!</Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    router.replace('../ViewCnh/cnh')
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

                {/* Botão de salvar */}
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={() => {

                        handleSave();
                    }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white' }}>Concluir</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
