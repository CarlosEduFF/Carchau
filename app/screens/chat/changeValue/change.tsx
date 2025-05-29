import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import styles from './StylesChange';

// Defina a interface para a solicitação
interface Solicitacoes {
    locadorId: string;
    id: string;
    modelo: string;
    marca: string;
    ano: string;
    valorTotal: string;
    dataInicio: string;
    dataTermino: string;
    totalDias: string;
    pontoencontro: string;
    modalidadesAluguel: string;
}

export default function AluguelVeiculo() {
    const [valorTotal, setValorTotal] = useState<number | null>(null);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacoes | null>(null);
    const route = useRoute();

    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
    const [userId, setUserId] = useState<string | null>(null); // Definição do estado para userId
    const [modalVisible, setModalVisible] = useState(false);
    const [solicitacoes, setSolicitacoes] = useState<Solicitacoes[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean | null>(null);



    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            setUserId(id); // Armazena o userId no estado
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        const fetchSolicitacoes = async () => {
            setLoading(true);
            try {
                // Recupera o userId do AsyncStorage para verificar o locador
                const id = await AsyncStorage.getItem('userId');
                setUserId(id); // Armazena o userId no estado

                if (!id || id !== locadorId) {
                    console.warn('Usuário não autorizado a visualizar estas solicitações.');
                    setSolicitacoes([]); // Define a lista de solicitações como vazia
                    return;
                }

                const solicitacoesSnapshot = await firebase.firestore()
                    .collection('Locatarios')
                    .doc(locatarioId)
                    .collection('solicitacoes')
                    .where('estadoPGAluguel', '==', 'Aluguel não pago')
                    .where('estado', '==', 'Aceito')
                    .get();

                const solicitacoesData = solicitacoesSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Solicitacoes[];

                // Filtra as solicitações para incluir apenas aquelas do locador atual
                const filteredSolicitacoes = solicitacoesData.filter(solicitacao =>
                    solicitacao.locadorId === id // Verifica se o locadorId da solicitação corresponde ao userId
                );

                setSolicitacoes(filteredSolicitacoes);
            } catch (error) {
                console.error("Erro ao buscar Solicitações: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitacoes();
    }, [locatarioId, locadorId]); // Adicione locadorId como dependência


    const handleUpdate = async () => {
        if (!selectedSolicitacao) return;

        try {
            if (locatarioId) {
                const carroRef = firebase.firestore()
                    .collection('Locatarios')
                    .doc(locatarioId)
                    .collection('solicitacoes')
                    .doc(selectedSolicitacao.id); // Corrigido para 'doc'

                await carroRef.update({
                    valorTotal, // Atualiza o valor total
                });

                console.log('Atualização realizada com sucesso!');
                setModalVisible(true);
                setLoading2(false);
            }
        } catch (error) {
            console.error("Erro ao salvar as edições do carro: ", error);
            alert('Erro ao salvar as edições do carro.');
            setLoading2(false);
        }
    };

    const translateX = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(translateX, {
                    toValue: 100,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(translateX, {
                    toValue: -100,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        );

        if (loading || loading2) {
            animation.start();
        }

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
            <Text style={styles.textocampo}>
                Selecione a solicitação a ser alterada
            </Text>
            <View style={styles.pickerContainer}>
                {solicitacoes.length > 0 ? (
                    <Picker
                        selectedValue={selectedSolicitacao?.id}
                        dropdownIconColor={'#fff'}
                        onValueChange={(itemValue) => {
                            const solicitacao = solicitacoes.find(s => s.id === itemValue);
                            if (solicitacao) {
                                setSelectedSolicitacao(solicitacao);
                                setValorTotal(solicitacao.valorTotal ? Number(solicitacao.valorTotal) : 0);
                            }
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione a solicitação" value="" />
                        {solicitacoes.map((solicitacao) => (
                            <Picker.Item key={solicitacao.id} label={`${solicitacao.id.slice(0, 6)} - ${solicitacao.marca} - ${solicitacao.modelo} - ${solicitacao.ano}`} value={solicitacao.id} />
                        ))}
                    </Picker>
                ) : (
                    <Text style={styles.textocampo}>Nenhuma solicitação disponível para edição.</Text>
                )}
            </View>

            {selectedSolicitacao && (
                <View>
                    <Text style={styles.textocampo}>
                        Modelo: {selectedSolicitacao.modelo}
                    </Text>
                    <Text style={styles.textocampo}>
                        Marca: {selectedSolicitacao.marca}
                    </Text>
                    <Text style={styles.textocampo}>
                        Ano: {selectedSolicitacao.ano}
                    </Text>
                    <Text style={styles.textocampo}>
                        Valor Total:
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                        <Text style={{ fontSize: 20, color: '#fff', marginRight: 5 }}>R$</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Altere aqui...'
                            placeholderTextColor="#888888"
                            onChangeText={(text) => {
                                const numericValue = text.replace(/\D/g, '');
                                const valueAsNumber = Number(numericValue) / 100;
                                setValorTotal(valueAsNumber);
                            }}
                            value={typeof valorTotal === 'number' && !isNaN(valorTotal) ? valorTotal.toFixed(2).replace('.', ',') : ''}
                            keyboardType="numeric"
                        />
                    </View>

                    <Text style={styles.textocampo}>
                        Data de Início: {selectedSolicitacao.dataInicio}
                    </Text>
                    <Text style={styles.textocampo}>
                        Data de Término: {selectedSolicitacao.dataTermino}
                    </Text>
                    <Text style={styles.textocampo}>
                        ( {selectedSolicitacao.totalDias} dias.)
                    </Text>
                </View>
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.foco}>Solicitação editada com sucesso!</Text>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                router.push('/(tabs)/contact');
                            }}>
                            <Text style={styles.textStyle}>Entendi!</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <View style={{ alignItems: 'center', marginBottom: 30 }}>
                {selectedSolicitacao && (
                    <TouchableOpacity style={styles.button} onPress={() => { handleUpdate(), setLoading2(true) }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18, }}>Alterar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
