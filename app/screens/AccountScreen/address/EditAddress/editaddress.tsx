import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, TextInput, TouchableOpacity, Animated, Image, Modal, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../utils/firebase';
import { MaskedTextInput } from 'react-native-mask-text';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import styles from './StylesAddress';

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

    const buscarEnderecoPorCep = async (cepDigitado: string) => {
        const cepLimpo = cepDigitado.replace(/\D/g, '');
        if (cepLimpo.length !== 8) return; // Só continua se o CEP tiver 8 dígitos

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setEndereco(data.logradouro || '');
                setBairro(data.bairro || '');
                setCidade(data.localidade || '');
                setEstado(data.uf || ''); // UF ex: "SP"
            } else {
                alert('CEP não encontrado!');
            }
        } catch (error) {
            alert('Erro ao buscar o CEP');
            console.error(error);
        }
    };

    const estadosMap = [
        { sigla: 'AC', nome: 'Acre' },
        { sigla: 'AL', nome: 'Alagoas' },
        { sigla: 'AP', nome: 'Amapá' },
        { sigla: 'AM', nome: 'Amazonas' },
        { sigla: 'BA', nome: 'Bahia' },
        { sigla: 'CE', nome: 'Ceará' },
        { sigla: 'ES', nome: 'Espírito Santo' },
        { sigla: 'GO', nome: 'Goiás' },
        { sigla: 'MA', nome: 'Maranhão' },
        { sigla: 'MT', nome: 'Mato Grosso' },
        { sigla: 'MS', nome: 'Mato Grosso do Sul' },
        { sigla: 'MG', nome: 'Minas Gerais' },
        { sigla: 'PA', nome: 'Pará' },
        { sigla: 'PB', nome: 'Paraíba' },
        { sigla: 'PR', nome: 'Paraná' },
        { sigla: 'PE', nome: 'Pernambuco' },
        { sigla: 'PI', nome: 'Piauí' },
        { sigla: 'RJ', nome: 'Rio de Janeiro' },
        { sigla: 'RN', nome: 'Rio Grande do Norte' },
        { sigla: 'RS', nome: 'Rio Grande do Sul' },
        { sigla: 'RO', nome: 'Rondônia' },
        { sigla: 'RR', nome: 'Roraima' },
        { sigla: 'SC', nome: 'Santa Catarina' },
        { sigla: 'SP', nome: 'São Paulo' },
        { sigla: 'SE', nome: 'Sergipe' },
        { sigla: 'TO', nome: 'Tocantins' },
        { sigla: 'DF', nome: 'Distrito Federal' }
    ];


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
        <>
            <View style={styles.container}>
                <View style={{ width: '100%', marginTop: 25 }}>

                    <ScrollView>
                        <Text style={styles.textocampo}>
                            Cep:
                        </Text>

                        <MaskedTextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={text => setCep(text)}
                            onBlur={() => buscarEnderecoPorCep(cep)}
                            value={cep}
                            mask="99999-999"
                            placeholder='Ex:12345-678'
                            placeholderTextColor="gray"
                            keyboardType="numeric"
                        />

                        <Text style={styles.textocampo}>
                            Endereço:
                        </Text>

                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Ex:Rua Araúcaria'
                            placeholderTextColor="#888888"
                            onChangeText={text => setEndereco(text)}
                            value={endereco}
                        />

                        <Text style={styles.textocampo}>
                            Número:
                        </Text>

                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Ex:837'
                            placeholderTextColor="#888888"
                            keyboardType='numeric'
                            onChangeText={text => setNumero(text)}
                            value={numero}
                        />

                        <Text style={styles.textocampo}>
                            Complemento:
                        </Text>

                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Ex: Próximo ao condominio flores'
                            placeholderTextColor="#888888"
                            onChangeText={text => setComplemento(text)}
                            value={complemento}
                        />

                        <Text style={styles.textocampo}>
                            Bairro:
                        </Text>

                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Ex: Morumbi'
                            placeholderTextColor="#888888"
                            onChangeText={text => setBairro(text)}
                            value={bairro}
                        />

                        <Text style={styles.textocampo}>
                            Cidade:
                        </Text>

                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Ex: São Paulo'
                            placeholderTextColor="#888888"
                            onChangeText={text => setCidade(text)}
                            value={cidade}
                        />

                        <Text style={styles.textocampo}>
                            Estado:
                        </Text>

                        <View style={styles.pickerContainer}>
                            <Picker
                                selectionColor={'#ffffff'}
                                itemStyle={{ color: '#fff', alignItems: 'center' }}
                                selectedValue={estado}
                                onValueChange={(itemValue) => setEstado(itemValue)}
                                dropdownIconColor='#fff'
                                style={pickerStyle}
                            >
                                <Picker.Item style={styles.picker} label="Selecione..." value="Selecione..." />
                                {estadosMap.map((estadoItem) => (
                                    <Picker.Item
                                        key={estadoItem.sigla}
                                        style={styles.picker}
                                        label={estadoItem.sigla}
                                        value={estadoItem.nome}
                                    />
                                ))}
                            </Picker>
                        </View>

                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            animationType="slide"
                            onRequestClose={() => setModalVisible(false)}>
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.foco}>Endereço atualizado com Sucesso!</Text>
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
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => {

                                handleSave();
                            }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 18, color: 'white' }}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </>
    );
}

