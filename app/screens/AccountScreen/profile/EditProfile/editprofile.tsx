import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable } from 'react-native';
import firebase from '../../../../../utils/firebase';
import { CheckBox } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import { router } from 'expo-router';
import styles from './StylesEdit.';


export default function InformacoesPessoais() {
    const [selectedIndex, setIndex] = useState<number | null>(null);
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [nacionalidade, setNacionalidade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [profissao, setProfissao] = useState('');
    const [perfilImage, setPerfilImage] = useState<string | null>(null); // Estado inicial como null
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean | null>(null);
    const defaultProfileImage = require('../../../../../assets/icons/Profile-Icon.png'); // Caminho local da imagem padrão
    const upload = require('../../../../../assets/icons/Upload-Icon.png');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [situ, setSitu] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData) {
                            setNome(userData.nome || '');
                            setNacionalidade(userData.nacionalidade || '');
                            setTelefone(userData.telefone || '');
                            setEmail(userData.email || '');
                            setIndex(userData.sexo === 'Masculino' ? 0 : 1);
                            setCpf(userData.cpf || '');
                            setProfissao(userData.profissao || '');

                            // Carregar a URL da imagem de perfil, se existir
                            if (userData.fotoPerfil) {
                                setPerfilImage(userData.fotoPerfil); // Define a URL da imagem de perfil salva no Firestore
                            }
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário: ", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        try {
            const uid = await AsyncStorage.getItem('userId');

            // Verifica se o uid não é null
            if (!uid) {
                throw new Error("Usuário não encontrado. Faça login novamente.");
            }

            if (!nome) {
                setSitu('Preencha corretamente o seu nome!');
                setModalVisible2(true);
                return;
            } else if (!nacionalidade) {
                setSitu('Preencha corretamente a sua nacionalidade!');
                setModalVisible2(true);
                return;
            } else if (selectedIndex !== 0 && selectedIndex !== 1) {
                setSitu('Preencha corretamente o seu sexo.');
                setModalVisible2(true);
                return;
            } else if (telefone.length !== 15 || !telefone) {
                setSitu('Preencha corretamente o seu telefone!');
                setModalVisible2(true);
                return;
            } else if (!email.includes('@') || !email) {
                setSitu('Preencha corretamente o seu email.');
                setModalVisible2(true);
                return;
            } else if (!profissao) {
                setSitu('Preencha corretamente a sua profissão!');
                setModalVisible2(true);
                return;
            } else {
                setLoading2(true);
            }
            // Verifica se há uma imagem para upload
            if (perfilImage) {
                const response = await fetch(perfilImage);
                const blob = await response.blob();

                // Define o caminho no Firebase Storage
                const storageRef = firebase.storage().ref().child(`imagemPerfil/${uid}`);

                // Faz o upload da imagem
                const snapshot = await storageRef.put(blob);

                // Obtém a URL de download da imagem
                const downloadURL = await snapshot.ref.getDownloadURL();

                // Salva a URL da imagem e outros dados no Firestore
                await firebase.firestore().collection('Locatarios').doc(uid).set({
                    fotoPerfil: downloadURL,
                    nome,
                    nacionalidade,
                    telefone,
                    email,
                    sexo: selectedIndex === 0 ? 'Masculino' : 'Feminino',
                    profissao,
                }, { merge: true });

                setModalVisible(true);
            } else {
                // Caso não tenha imagem, apenas atualiza os outros dados
                await firebase.firestore().collection('Locatarios').doc(uid).set({
                    nome,
                    nacionalidade,
                    telefone,
                    email,
                    sexo: selectedIndex === 0 ? 'Masculino' : 'Feminino',
                    profissao,
                }, { merge: true });

                setModalVisible(true);

            }
            setLoading2(false);
        } catch (error) {
            console.error("Erro ao atualizar dados do usuário: ", error);
            alert('Erro ao atualizar dados. Tente novamente.');
            setLoading2(false);
        }
    };

    const handleImagePicker = async () => {
        const resultPerfilImage = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 4],
            allowsEditing: true,
            base64: true,
            quality: 1,
        });

        if (!resultPerfilImage.canceled) {
            setPerfilImage(resultPerfilImage.assets[0].uri); // Define a URI da imagem selecionada
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
            <ScrollView style={styles.scroll}>
                <View style={{ alignItems: 'center' }}>
                    {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
                    <Image
                        style={styles.profileImage}
                        source={perfilImage ? { uri: perfilImage } : defaultProfileImage}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione sua foto de perfil</Text>
                            <Image
                                style={styles.iconUpl}
                                source={upload}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textocampo}>CPF: {cpf} </Text>

                <Text style={styles.textocampo}>Nome completo:</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={text => setNome(text)}
                />

                <Text style={styles.textocampo}>Nacionalidade:</Text>
                <TextInput
                    style={styles.input}
                    value={nacionalidade}
                    onChangeText={text => setNacionalidade(text)}
                />

                <Text style={styles.textocampo}>Sexo:</Text>
                <View style={{ flexDirection: 'row', paddingTop: 0 }}>
                    <CheckBox
                        checked={selectedIndex === 0}
                        checkedColor='#FFCD1B'
                        onPress={() => setIndex(0)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, paddingRight: 0 }}
                    />
                    <Text style={styles.textobox}>Masculino</Text>

                    <CheckBox
                        checked={selectedIndex === 1}
                        checkedColor='#FFCD1B'
                        onPress={() => setIndex(1)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, paddingRight: 0 }}
                    />
                    <Text style={styles.textobox}>Feminino</Text>
                </View>

                <Text style={styles.textocampo}>Celular:</Text>
                <MaskedTextInput
                    style={styles.input}
                    value={telefone}
                    onChangeText={text => setTelefone(text)}
                    mask="(99) 99999-9999"
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='(XX) XXXXX-XXXX'
                />

                <Text style={styles.textocampo}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType='email-address'
                />

                <Text style={styles.textocampo}>Profissão:</Text>
                <TextInput
                    style={styles.input}
                    value={profissao}
                    onChangeText={text => setProfissao(text)}
                />

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.buttonSave} onPress={() => {
                        handleSave();
                    }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
                    </TouchableOpacity>

                </View>


                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Perfil atualizado com Sucesso!</Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    router.push('../ViewProfile/profile')
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


