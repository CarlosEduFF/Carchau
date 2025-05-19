import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Modal, Pressable, Animated } from 'react-native';
import { launchImageLibrary, ImageLibraryOptions, Asset } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../../utils/firebase';
import { router } from 'expo-router';
import { CheckBox } from '@rneui/themed';
import PagerView from 'react-native-pager-view';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { MaskedTextInput } from 'react-native-mask-text';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import styles from './StylesAddLocation';


export default function CarRegistrationScreen() {


    const pickerStyle = Platform.select({
        ios: {
            color: '#ffffff',

        },

        android: {
            // Estilo específico para Android
            color: '#fff',
        },
    });

    const [LaudImage, setLaudImage] = useState<string | null>(null); // Estado inicial como null
    const [pdfUri, setPdfUri] = useState<string | null>(null); // URI do PDF selecionado
    const defaultVehicleImage = require('../../../../../assets/icons/Document-Icon.png');
    const [fotosCarro, setFotosCarro] = useState<string[]>([]); // Array de strings para armazenar várias imagens
    const [pdfName, setPdfName] = useState<string | null>(null); // Estado para armazenar o nome do arquivo PDF
    const upload = require('../../../../../assets/icons/Upload-Icon.png');

    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [ano, setAno] = useState('');
    const [placa, setPlaca] = useState('');
    const [combustivel, setCombustivel] = useState('Gasolisolina');
    const [quantidadeLugares, setQuantidadeLugares] = useState('');
    const [selectedAr, setSelectedAr] = useState('sim');
    const [selectedCambio, setSelectedCambio] = useState('manual');
    const [selectedStep, setSelectedStep] = useState('general');
    const [selectedAirbags, setSelectedAirbags] = useState('general');
    const [isUploading, setIsUploading] = useState(false); // Adiciona o estado para controlar o carregamento


    const [precoDia, setPrecoDia] = useState<number | null>(null);
    const [precoSemana, setPrecoSemana] = useState<number | null>(null);
    const [precoMes, setPrecoMes] = useState<number | null>(null);
    const [caucao, setCaucao] = useState<number | null>(null);
    const [pontoencontro, setPontoEncontro] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

    const [loading2, setLoading2] = useState<boolean | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const togglePeriod = (period: number) => {
        if (selectedPeriods.includes(period)) {
            setSelectedPeriods(selectedPeriods.filter(p => p !== period));
        } else {
            setSelectedPeriods([...selectedPeriods, period]);
        }
    };


    const handleSave = async () => {

        try {
            const uid = await AsyncStorage.getItem('userId');
            if (!uid) {
                alert('Erro ao obter ID do usuário.');
                return;
            }



            if (!modelo) {
                setSitu('Preencha corretamente o modelo do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!marca) {
                setSitu('Preencha corretamente o marca do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!ano) {
                setSitu('Preencha corretamente o ano do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!placa) {
                setSitu('Preencha corretamente a placa do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!combustivel) {
                setSitu('Preencha corretamente o combustivel do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!quantidadeLugares) {
                setSitu('Preencha corretamente a quantidade de lugares do seu carro!');
                setModalVisible2(true);
                return;
            }
            else if (!selectedAr) {
                setSitu('Preencha corretamente o ar-condicionado do seu carro!');
                setModalVisible2(true);
                return;
            }
            else if (!selectedStep) {
                setSitu('Preencha corretamente o step do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!selectedCambio) {
                setSitu('Preencha corretamente o câmbio do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!selectedAirbags) {
                setSitu('Preencha corretamente o airbag do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!selectedPeriods) {
                setSitu('Preencha corretamente a modalidade do aluguel da sua locação!');
                setModalVisible2(true);
                return;
            } else if (!caucao) {
                setSitu('Preencha corretamente a caução da sua locação!');
                setModalVisible2(true);
                return;
            } else if (!pontoencontro) {
                setSitu('Preencha corretamente o ponto de encontro da sua locação!');
                setModalVisible2(true);
                return;
            } else if (!LaudImage) {
                setSitu('Faça o upload corretamente da foto do laudo da sua locação!');
                setModalVisible2(true);
                return;
            } else if (!pdfUri) {
                setSitu('Faça o upload corretamente do PDF da apólice de seguro do seu carro!');
                setModalVisible2(true);
                return;
            } else if (!fotosCarro) {
                setSitu('Faça o upload corretamente das fotos do seu carro!');
                setModalVisible2(true);
                return;
            } else {
                setLoading2(true);
            }

            let downloadURL = null;
            if (LaudImage) {
                const response = await fetch(LaudImage);
                const blob = await response.blob();

                // Define o caminho no Firebase Storage
                const laudRef = firebase.storage().ref().child(`laudoCarro/${uid}`);

                // Faz o upload da imagem do laudo
                const snapshot = await laudRef.put(blob);

                // Obtém a URL de download da imagem do laudo
                downloadURL = await snapshot.ref.getDownloadURL();
            }
            let pdfDownloadUrl = null;
            if (pdfUri) {
                const pdfResponse = await fetch(pdfUri);
                const pdfBlob = await pdfResponse.blob();
                const pdfRef = firebase.storage().ref().child(`documentos/${uid}/${Date.now()}_doc.pdf`);
                const pdfSnapshot = await pdfRef.put(pdfBlob);
                pdfDownloadUrl = await pdfSnapshot.ref.getDownloadURL();
            }

            const downloadURLs = [];
            for (const fotoUri of fotosCarro) {
                const response = await fetch(fotoUri);
                const blob = await response.blob();
                const storageRef = firebase.storage().ref().child(`carros/${uid}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
                const snapshot = await storageRef.put(blob);
                const downloadURL = await snapshot.ref.getDownloadURL();
                downloadURLs.push(downloadURL);
            }

            const carrosRef = firebase.firestore()
                .collection('Locatarios')
                .doc(uid)
                .collection('carros');

            await carrosRef.add({
                modelo: modelo,
                marca: marca,
                ano: ano,
                placa: placa,
                combustivel: combustivel,
                quantidadeLugares: quantidadeLugares,
                arCondicionado: selectedAr,
                step: selectedStep,
                cambio: selectedCambio,
                airbags: selectedAirbags,
                fotosCarro: downloadURLs,
                caucao: caucao,
                pdfDocumento: pdfDownloadUrl, // Salvar URL do documento PDF
                pdfNome: pdfName,
                modalidadesAluguel: selectedPeriods,
                precoDia: selectedPeriods.includes(0) ? precoDia : null, // Converte para número e ajusta
                precoSemana: selectedPeriods.includes(1) ? precoSemana : null, // Converte para número e ajusta
                precoMes: selectedPeriods.includes(2) ? precoMes : null, // Converte para número e ajusta
                pontoencontro: pontoencontro,
                fotoLaud: downloadURL
            });

            setLoading2(false);
            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao salvar os dados do carro: ", error);
            alert('Erro ao salvar os dados do carro.');
        } finally {
            setIsUploading(false);
            setLoading2(false);
        }
    };

    const handleImagePicker = async () => {
        const resultLaudImage = await ImagePicker.launchImageLibraryAsync({
            aspect: [4, 4],
            allowsEditing: true,
            base64: true,
            quality: 1,
        });

        if (!resultLaudImage.canceled) {
            setLaudImage(resultLaudImage.assets[0].uri); // Define a URI da imagem selecionada
        }
    };

    const handleMultipleImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // Se a versão suportar múltiplas seleções
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImages = result.assets.map(asset => asset.uri);
            setFotosCarro(prevState => [...prevState, ...selectedImages]);
            console.log('Imagens selecionadas:', selectedImages); // Adicione este log
        }
    };
    const handleCancelLaudImage = () => {
        setLaudImage(null); // Remove a imagem de laudo
    };

    // Função para cancelar uma imagem específica do array
    const handleCancelCarImage = (index: number) => {
        const newImages = fotosCarro.filter((_, i) => i !== index); // Remove a imagem do array
        setFotosCarro(newImages);
    };

    const handlePdfPicker = async () => {

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/pdf', // Somente arquivos PDF
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedFile = result.assets[0];
                setPdfUri(selectedFile.uri); // Armazena o URI do PDF selecionado
                setPdfName(selectedFile.name); // Armazena o nome do PDF
                console.log('PDF selecionado:', selectedFile.uri);
                console.log('Nome do PDF:', selectedFile.name);
            } else {
                console.log('Seleção de documento cancelada.');
            }
        } catch (err) {
            console.error("Erro ao selecionar PDF: ", err);
        }
    };

    const handleCancelPdf = () => {
        setPdfUri(null);  // Remove o PDF selecionado
    };

    const handleViewPdf = async () => {
        if (pdfUri) {
            // Abre o PDF no navegador
            try {
                const result = await WebBrowser.openBrowserAsync(pdfUri);
                console.log('PDF visualizado:', result);
            } catch (error) {
                console.error('Erro ao abrir o PDF:', error);
            }
        } else {
            alert('Nenhum PDF selecionado para visualizar.');
        }
    };

    const formatCurrency = (value: string) => {
        const formattedValue = value
            .replace(/\D/g, '') // Remove qualquer coisa que não seja número
            .replace(/(\d)(\d{2})$/, '$1,$2') // Adiciona vírgula antes dos dois últimos dígitos
            .replace(/(?=(\d{3})+(\D))\B/g, '.') // Adiciona pontos a cada três dígitos
        return ` ${formattedValue}`; // Adiciona "R$" no início
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
            <View style={styles.Topo}></View>
            <ScrollView>
                <Text style={styles.title}>
                    Preencha os campos abaixo com cuidado, pois essas informações serão usadas para criar
                    o anúncio de aluguel do seu carro. Certifique-se de que todos os detalhes sejam precisos
                    e reflitam o estado real do veículo.
                </Text>


                <Text style={styles.textocampo}>
                    Modelo:
                </Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='Uno'
                    placeholderTextColor="#888888"
                    onChangeText={text => setModelo(text)}
                    value={modelo}
                />

                <Text style={styles.textocampo}>
                    Marca:
                </Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={marca}
                        selectionColor={'#ffffff'}
                        itemStyle={{ color: '#fff' }}
                        style={pickerStyle}
                        onValueChange={(itemValue, _itemIndex) => setMarca(itemValue)}
                        dropdownIconColor='#fff'
                    >
                        <Picker.Item style={styles.picker} label="Selecione..." value="Nenhum" />
                        <Picker.Item style={styles.picker} label="BMW" value="BMW" />
                        <Picker.Item style={styles.picker} label="Chevrolet" value="Chevrolet" />
                        <Picker.Item style={styles.picker} label="Dodge" value="Dodge" />
                        <Picker.Item style={styles.picker} label="Fiat" value="Fiat" />
                        <Picker.Item style={styles.picker} label="Ford" value="Ford" />
                        <Picker.Item style={styles.picker} label="Honda" value="Honda" />
                        <Picker.Item style={styles.picker} label="Hyundai" value="Hyundai" />
                        <Picker.Item style={styles.picker} label="Jaguar" value="Jaguar" />
                        <Picker.Item style={styles.picker} label="Jeep" value="Jeep" />
                        <Picker.Item style={styles.picker} label="Nissan" value="Nissan" />
                        <Picker.Item style={styles.picker} label="Peugeot" value="Peugeot" />
                        <Picker.Item style={styles.picker} label="Renault" value="Renault" />
                        <Picker.Item style={styles.picker} label="Tesla" value="Tesla" />
                        <Picker.Item style={styles.picker} label="Toyota" value="Toyota" />
                        <Picker.Item style={styles.picker} label="Volkswagen" value="Volkswagen" />
                    </Picker>
                </View>
                <Text style={styles.textocampo}>
                    Ano:
                </Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='2005'
                    placeholderTextColor="#888888"
                    onChangeText={text => setAno(text)}
                    value={ano}
                />

                <Text style={styles.textocampo}>
                    Placa:
                </Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='ASFEEF332'
                    placeholderTextColor="#888888"
                    onChangeText={text => setPlaca(text)}
                    value={placa}
                />

                <Text style={styles.textocampo}>
                    Combustível:
                </Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={combustivel}
                        selectionColor={'fff'}
                        itemStyle={{ color: '#fff', alignItems: 'center' }}
                        style={[pickerStyle]}
                        onValueChange={(itemValue, _itemIndex) => setCombustivel(itemValue)}
                        dropdownIconColor='#fff'
                    >
                        <Picker.Item style={styles.picker} label="Selecione..." value="Nenhum" />
                        <Picker.Item style={styles.picker} label="Gasolina" value="Gasolina" />
                        <Picker.Item style={styles.picker} label="Etanol" value="Etanol" />
                        <Picker.Item style={styles.picker} label="Flex" value="Flex" />
                        <Picker.Item style={styles.picker} label="Elétrico" value="Elétrico" />
                    </Picker>
                </View>

                <Text style={styles.textocampo}>
                    Quantidade de Lugares:
                </Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='2'
                    placeholderTextColor="#888888"
                    onChangeText={text => setQuantidadeLugares(text)}
                    value={quantidadeLugares}
                />

                <Text style={styles.textocampo}>Ar-condicionado</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedAr}
                        selectionColor={'fff'}
                        itemStyle={{ color: '#fff', alignItems: 'center' }}
                        style={[pickerStyle]}
                        onValueChange={(itemValue, _itemIndex) => setSelectedAr(itemValue)}
                        dropdownIconColor='#fff'
                    >
                        <Picker.Item style={styles.picker} label="Selecione..." value="Nenhum" />
                        <Picker.Item style={styles.picker} label="Sim" value="Sim" />
                        <Picker.Item style={styles.picker} label="Não" value="Não" />
                    </Picker>
                </View>

                <Text style={styles.textocampo}>Step</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedStep}
                        style={[pickerStyle]}
                        onValueChange={(itemValue, _itemIndex) => setSelectedStep(itemValue)}
                        dropdownIconColor='#fff'
                        itemStyle={{ color: '#fff', alignItems: 'center' }}

                    >
                        <Picker.Item style={styles.picker} label="Selecione..." value="Nenhum" />
                        <Picker.Item style={styles.picker} label="Sim" value="Sim" />
                        <Picker.Item style={styles.picker} label="Não " value="Não" />

                    </Picker>
                </View>

                <Text style={styles.textocampo}>Câmbio</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedCambio}
                        style={[pickerStyle]}
                        onValueChange={(itemValue, _itemIndex) => setSelectedCambio(itemValue)}
                        dropdownIconColor='#fff'
                        itemStyle={{ color: '#fff', alignItems: 'center' }}

                    >
                        <Picker.Item style={styles.picker} label="Selecione..." value="Nenhum" />
                        <Picker.Item style={styles.picker} label="Manual" value="Manual" />
                        <Picker.Item style={styles.picker} label="Automatizado " value="Automatizado" />
                        <Picker.Item style={styles.picker} label="Automático" value="Automático" />
                    </Picker>
                </View>

                <Text style={styles.textocampo}>Airbags</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedAirbags}
                        style={[pickerStyle]}
                        onValueChange={(itemValue) => setSelectedAirbags(itemValue)}
                        dropdownIconColor='#fff'
                        itemStyle={{ color: '#fff', alignItems: 'center' }}

                    >
                        <Picker.Item style={styles.picker} label="Selecione..." value="Nenhum" />
                        <Picker.Item style={styles.picker} label="Sim" value="Sim" />
                        <Picker.Item style={styles.picker} label="Não" value="Não" />
                    </Picker>
                </View>

                <Text style={styles.textocampo}> Modalidade de aluguel:</Text>
                <View style={{ flexDirection: 'row', paddingTop: 8 }}>
                    <CheckBox
                        checked={selectedPeriods.includes(0)}
                        checkedColor='#FFCD1B'
                        onPress={() => togglePeriod(0)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, paddingRight: 0 }}
                    />
                    <Text style={styles.textobox}>Dia</Text>

                    <CheckBox
                        checked={selectedPeriods.includes(1)}
                        checkedColor='#FFCD1B'
                        onPress={() => togglePeriod(1)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, paddingRight: 0 }}
                    />
                    <Text style={styles.textobox}>Semana</Text>

                    <CheckBox
                        checked={selectedPeriods.includes(2)}
                        checkedColor='#FFCD1B'
                        onPress={() => togglePeriod(2)}
                        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, paddingRight: 0 }}
                    />
                    <Text style={styles.textobox}>Mês</Text>


                </View>

                {/* Condicionalmente renderiza os campos se os CheckBox estiverem marcados */}
                {selectedPeriods.includes(0) && (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                            <Text style={{ fontSize: 20, color: '#fff', marginRight: 5 }}>R$</Text>
                            <TextInput
                                style={{
                                    flex: 1,
                                    color: '#fff',
                                    fontSize: 16,
                                    borderRadius: 5,
                                    height: 45,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Preço por Dia"
                                placeholderTextColor="#888888"
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/\D/g, ''); // Remove tudo que não seja número
                                    const valueAsNumber = Number(numericValue) / 100; // Formata para centavos, se necessário
                                    setPrecoDia(valueAsNumber); // Atualiza o estado com o valor numérico
                                }}
                                value={typeof precoDia === 'number' && !isNaN(precoDia) ? precoDia.toFixed(2).replace('.', ',') : ''} // Verifica antes de usar toFixed()
                                keyboardType="numeric" // Define o teclado numérico
                            />
                        </View>
                    </>
                )}

                {selectedPeriods.includes(1) && (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                            <Text style={{ fontSize: 20, color: '#fff', marginRight: 5 }}>R$</Text>
                            <TextInput
                                style={{
                                    flex: 1,
                                    color: '#fff',
                                    fontSize: 16,
                                    borderRadius: 5,
                                    height: 45,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder='Preço por Semana'
                                placeholderTextColor="#888888"
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/\D/g, '');
                                    const valueAsNumber = Number(numericValue) / 100;
                                    setPrecoSemana(valueAsNumber);
                                }}
                                value={typeof precoSemana === 'number' && !isNaN(precoSemana) ? precoSemana.toFixed(2).replace('.', ',') : ''}
                                keyboardType="numeric"
                            />
                        </View>
                    </>
                )}

                {selectedPeriods.includes(2) && (
                    <>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                            <Text style={{ fontSize: 20, color: '#fff', marginRight: 5 }}>R$</Text>
                            <TextInput
                                style={{
                                    flex: 1,
                                    color: '#fff',
                                    fontSize: 16,
                                    borderRadius: 5,
                                    height: 45,
                                    padding: 10,
                                    borderWidth: 1,
                                    borderColor: '#fff',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                autoCapitalize="none"
                                autoCorrect={false}
                                placeholder="Preço por Mês"
                                placeholderTextColor="#888888"
                                onChangeText={(text) => {
                                    const numericValue = text.replace(/\D/g, '');
                                    const valueAsNumber = Number(numericValue) / 100;
                                    setPrecoMes(valueAsNumber);
                                }}
                                value={typeof precoMes === 'number' && !isNaN(precoMes) ? precoMes.toFixed(2).replace('.', ',') : ''}
                                keyboardType="numeric"
                            />
                        </View>
                    </>
                )}



                <Text style={[styles.textocampo, { marginBottom: 5, }]}>
                    Valor de garantia (Caução):
                </Text>
                <Text style={[styles.textodescri, { marginBottom: 30, }]}>
                    Este é o valor em dinheiro destinado a ser ressarcido ao locador,
                    caso durante a locação o veículo sofra alguma avaria.
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, width: '100%' }}>
                    <Text style={{ fontSize: 20, color: '#fff', marginRight: 5 }}>R$</Text>
                    <TextInput
                        style={{
                            flex: 1,
                            color: '#fff',
                            fontSize: 16,
                            borderRadius: 5,
                            height: 45,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: '#fff',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder="Valor da caução"
                        placeholderTextColor="#888888"
                        onChangeText={(text) => {
                            const numericValue = text.replace(/\D/g, '');
                            const valueAsNumber = Number(numericValue) / 100;
                            setCaucao(valueAsNumber);
                        }}
                        value={typeof caucao === 'number' && !isNaN(caucao) ? caucao.toFixed(2).replace('.', ',') : ''}
                        keyboardType="numeric"
                    />
                </View>

                <Text style={[styles.textocampo, { marginBottom: 5, }]}>
                    Ponto de Encontro:
                </Text>
                <Text style={[styles.textodescri, { marginBottom: 30, }]}>
                    Este campo se refere a um endereço para se encontrar com o locatário,
                    a fim de alugar o automovél.<Text style={styles.titlePT}> Não é
                        recomendado colocar seu endereço residencial!</Text>
                </Text>

                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='Metrô Itaquera'
                    placeholderTextColor="#888888"
                    onChangeText={text => setPontoEncontro(text)} // Aplica a função
                    value={pontoencontro}
                />


                <Text style={styles.textocampo}>Laudo Cautelar:</Text>
                <View style={{ alignItems: 'center' }}>
                    {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
                    {LaudImage ? (
                        <>
                            <Image
                                style={styles.laudImage}
                                source={{ uri: LaudImage }}
                                onError={(error) => console.log("Erro ao carregar imagem:", error)}
                            />
                            <TouchableOpacity onPress={handleCancelLaudImage} style={styles.cancelButton}>
                                <Text style={styles.cancelarText} >Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <MaterialCommunityIcons style={{ marginBottom: 10, marginTop: 10, }} name="file-document-multiple-outline" size={160} color="#888" />
                    )}


                    <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione a imagem do laudo</Text>
                            <Image
                                style={styles.iconUpl}
                                source={upload}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Botão para selecionar PDF */}
                <Text style={styles.textocampo}>Apólice de Seguro:</Text>
                <View style={styles.pdfContainer}>
                    {pdfUri ? (
                        <>
                            {/* Exibe o nome do arquivo PDF selecionado */}
                            <Text style={styles.pdfText}>PDF selecionado: {pdfName}</Text>
                            <View>
                                {/* Botão para cancelar o PDF */}
                                <TouchableOpacity onPress={handleCancelPdf} style={styles.cancelButton}>
                                    <Text style={styles.cancelarText}>Cancelar PDF</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <MaterialCommunityIcons
                            style={{ marginBottom: 10, marginTop: 10 }}
                            name="file-document-multiple-outline"
                            size={160}
                            color="#888"
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={handlePdfPicker}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione o PDF da Apólice</Text>
                            <Image
                                style={styles.iconUpl}
                                source={upload}
                            />
                        </View>
                    </TouchableOpacity>
                </View>



                <Text style={styles.textocampo}>Adicione as fotos do seu carro:</Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


                    {fotosCarro.length > 0 ? (
                        <PagerView style={styles.pageview} initialPage={0}>
                            {fotosCarro.map((fotoUri, index) => (
                                <View key={index} style={styles.page}>
                                    <Image
                                        key={index}
                                        source={{ uri: fotoUri }}
                                        style={styles.vehicleImage} // Estilo apropriado para as imagens do veículo
                                    />
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        onPress={() => handleCancelCarImage(index)} // Botão de cancelar imagem
                                    >
                                        <Text style={styles.cancelarText}>Cancelar </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </PagerView>
                    ) : (
                        <MaterialCommunityIcons
                            style={{ marginBottom: 10, marginTop: 10 }}
                            name="file-document-multiple-outline"
                            size={160}
                            color="#888"
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={handleMultipleImagePicker}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione imagens do carro</Text>
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
                            <Text style={styles.foco}>Locação adicionada com sucesso!</Text>
                            <Pressable
                                style={styles.modalButton}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                    router.push('../LocationList/location-list');
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

                {/* Botão de Salvar */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <TouchableOpacity style={styles.buttonSave} onPress={handleSave} disabled={isUploading}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18, }}>Salvar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </View>
    );
}


