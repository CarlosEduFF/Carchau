import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View, Text, Image, TouchableOpacity, Animated, Modal, Pressable, ScrollView } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../utils/firebase';
import styles from './StylesLocationList';

export default function locacao() {
    const defaultCarroImage = require('../../../../../assets/icons/Car-Icon.png');

    const [loading, setLoading] = useState(true);
    const [carros, setCarros] = useState<{ id: string; modelo: string; placa: string; primeiraFoto: string | null }[]>([]);
    const [primeiraFoto, setPrimeiraFoto] = useState<string | null>(null);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchCarroData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    const unsubscribe = firebase.firestore()
                        .collection('Locatarios')
                        .doc(uid)
                        .collection('carros')
                        .onSnapshot(carroSnapshot => {
                            if (!carroSnapshot.empty) {
                                const carrosArray = carroSnapshot.docs.map(doc => {
                                    const carroData = doc.data();
                                    const primeiraFoto = carroData?.fotosCarro && Array.isArray(carroData.fotosCarro) && carroData.fotosCarro.length > 0
                                        ? carroData.fotosCarro[0]
                                        : null;

                                    return {
                                        id: doc.id,
                                        modelo: carroData.modelo,
                                        placa: carroData.placa,
                                        primeiraFoto: primeiraFoto
                                    };
                                });
                                setCarros(carrosArray);
                            } else {
                                setCarros([]); // Define como array vazio se não houver carros
                            }
                            setLoading(false);
                        });

                    // Retorna a função de cleanup para parar a escuta quando o componente for desmontado
                    return () => unsubscribe();
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário: ", error);
                setLoading(false);
            }
        };

        fetchCarroData();
    }, []);



    const handleDelete = async (carroId: string) => {
        try {
            const uid = await AsyncStorage.getItem('userId');
            if (uid && carroId) {
                await firebase.firestore()
                    .collection('Locatarios')
                    .doc(uid)
                    .collection('carros')
                    .doc(carroId)
                    .delete();


            }
            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao deletar o carro: ", error);
            alert('Erro ao deletar o carro.');
        }
    };

    function Adicionar() {
        router.replace('/screens/AccountScreen/location/AddLocation/add-location')
    }

    function Cards(carro: { id: any; }) {
        router.push({
            pathname: '/screens/AccountScreen/location/EditLocation/edit-location',
            params: { carroId: carro.id }
        });
    }

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
                    <Image style={styles.carlogo} source={require('../../../../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.Addbutton}>
                <TouchableOpacity style={{ flexDirection: 'row', paddingTop: 20 }} onPress={Adicionar}>
                    <FontAwesome6 name="square-plus" size={28} color="white" />
                    <Text style={styles.text}>Adicionar um Carro</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '100%' }}>
                {carros.map(carro => (
                    <View key={carro.id} style={styles.carContainer}>
                        <View style={styles.opcao}>
                            <Image
                                source={carro.primeiraFoto ? { uri: carro.primeiraFoto } : defaultCarroImage} // Usando uri apenas para imagens remotas
                                style={{ width: 80, height: 60, borderRadius: 15, }}
                                resizeMode="cover"
                            />
                            <Text style={styles.textocampo}>{carro.modelo} - {carro.placa}</Text>
                        </View>
                        <View style={styles.iconsContainer}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => Cards(carro)}>
                                <MaterialCommunityIcons name="pencil-outline" size={24} color="#F2A51A" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(carro.id)}>
                                <MaterialCommunityIcons name="trash-can-outline" size={24} color="#F2A51A" />
                            </TouchableOpacity>
                        </View>
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
                        <Text style={styles.foco}>Locação Excluída com sucesso!</Text>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);

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


    );
}

