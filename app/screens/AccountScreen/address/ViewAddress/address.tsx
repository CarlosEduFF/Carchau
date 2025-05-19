import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Animated, Image, Modal, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../utils/firebase';
import { MaskedTextInput } from 'react-native-mask-text';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import styles from './StylesAddress';
const editarButton = require('../../../../../assets/icons/Edit-Button-Icon.png'); // Caminho local da imagem padrão
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider } from '@rneui/themed';

export default function Endereco() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');  // Usando o mesmo estado para o Picker e exibição
    const [loading2, setLoading2] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const pickerStyle = Platform.select({
        android: {
            // Estilo específico para Android
            color: '#fff',
        },
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');

                if (uid) {
                    // Referência à subcoleção 'Enderecos' do locatário
                    const enderecoSnapshot = await firebase
                        .firestore()
                        .collection('Locatarios')
                        .doc(uid)
                        .collection('endereco')
                        .get();

                    if (!enderecoSnapshot.empty) {
                        // Supõe que haverá apenas um endereço principal (pega o primeiro documento)
                        const enderecoDoc = enderecoSnapshot.docs[0];
                        const enderecoData = enderecoDoc.data();

                        setCep(enderecoData.cep || '');
                        setEndereco(enderecoData.endereco || '');
                        setNumero(enderecoData.numero || '');
                        setComplemento(enderecoData.complemento || '');
                        setBairro(enderecoData.bairro || '');
                        setCidade(enderecoData.cidade || '');
                        setEstado(enderecoData.estado || ''); // Garantir que o estado seja carregado
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

            if (!cep || cep.length !== 9) {
                setSitu('Preencha corretamente o seu CEP!');
                setModalVisible2(true);
                return;
            } else if (!endereco) {
                setSitu('Preencha corretamente o seu endereço!');
                setModalVisible2(true);
                return;
            } else if (!numero) {
                setSitu('Preencha corretamente o número da sua residência');
                setModalVisible2(true);
                return;
            } else if (!bairro) {
                setSitu('Preencha corretamente o seu bairro');
                setModalVisible2(true);
                return;
            } else if (!cidade) {
                setSitu('Preencha corretamente a sua cidade.');
                setModalVisible2(true);
                return;
            } else if (!estado) {
                setSitu('Preencha corretamente o seu estado.');
                setModalVisible2(true);
                return;
            } else {
                setLoading2(true);
            }

            if (uid) {
                const locatariosRef = firebase.firestore().collection('Locatarios').doc(uid);
                const subcollectionRef = locatariosRef.collection('endereco');

                // Verificar se já existe um registro na subcoleção
                const enderecoSnapshot = await subcollectionRef.get();

                if (!enderecoSnapshot.empty) {
                    // Atualizar o primeiro registro encontrado (assumindo que há apenas um registro de endereço por usuário)
                    const enderecoDocId = enderecoSnapshot.docs[0].id;
                    await subcollectionRef.doc(enderecoDocId).update({
                        cep,
                        endereco,
                        numero,
                        complemento: complemento || null,
                        bairro,
                        cidade,
                        estado,
                    });
                } else {
                    // Criar um novo registro se não houver nenhum
                    await subcollectionRef.add({
                        cep,
                        endereco,
                        numero,
                        complemento: complemento || null,
                        bairro,
                        cidade,
                        estado,
                    });
                }

                setModalVisible(true);
            }

            setLoading2(false);
        } catch (error) {
            console.error("Erro ao salvar os dados do usuário: ", error);
            alert('Erro ao salvar os dados. Tente novamente.');
            setLoading(false);
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
            <View>
                <View style={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Alinha no lado esquerdo
                    alignItems: 'flex-end' // Garante alinhamento vertical, caso necessário
                }}>
                    <TouchableOpacity style={{ marginTop: 30, width: 45, height: 45 }} onPress={() => router.push('/screens/AccountScreen/address/EditAddress/editaddress')}>
                        <Image
                            style={[styles.EditImage, { marginTop: 30 }]}
                            source={editarButton}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                    {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
                </View>
                <Text style={styles.textoexi}>Cep</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="map-pin" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{cep}</Text>
                </View>
                <Text style={styles.textoexi}>Endereço</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="home" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{endereco}</Text>
                </View>
                <Text style={styles.textoexi}>Número</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="hashtag" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{numero}</Text>
                </View>
                <Text style={styles.textoexi}>Complemento</Text>
                <View style={[styles.Dataarea]}>
                    <MaterialCommunityIcons name="home-outline" size={28} color="#F2A51A" />
                    <Text style={styles.textoexi}>{complemento}</Text>
                </View>
                <Text style={styles.textoexi}>Bairro</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="building" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{bairro}</Text>
                </View>
                <Text style={styles.textoexi}>Cidade</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="map-marker" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{cidade}</Text>
                </View>
                <Text style={styles.textoexi}>Estado</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="map" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{estado}</Text>
                </View>



            </View>
        </View>
    );
}

