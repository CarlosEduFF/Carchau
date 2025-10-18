import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from 'expo-router';
import PagerView from 'react-native-pager-view';
import { CheckBox, Divider } from '@rneui/themed';
import { Entypo, FontAwesome, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import styles from './StylesEditLocation';
import images from '~/constants/images';

import { clearFile, pickMultipleImages, pickSingleImage, removeImageByIndex } from '~/utils/handleMediaManager';

import { getUserId, updateCarData, uploadImage, uploadMultipleImages, uploadPDF } from '~/services/carUpdateService';
import { routes } from '~/constants/routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '~/config/firebase';
import { Services } from '~/services';
import { Components } from '~/components';

export default function CarRegistrationScreen() {
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const carroIdParam = useLocalSearchParams()?.carroId;
    const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
    const [LaudImage, setLaudImage] = useState<string>('');
    const [pdfName, setPdfName] = useState<string | null>(null);
    const [fotosCarro, setFotosCarro] = useState<string[]>([]);
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [ano, setAno] = useState('');
    const [placa, setPlaca] = useState('');
    const [combustivel, setCombustivel] = useState('Gasolisolina');
    const [quantidadeLugares, setQuantidadeLugares] = useState<number>(0);
    const [selectedAr, setSelectedAr] = useState('sim');
    const [selectedCambio, setSelectedCambio] = useState('manual');
    const [selectedStep, setSelectedStep] = useState('general');
    const [selectedAirbags, setSelectedAirbags] = useState('general');
    const [pdfUri, setPdfUri] = useState<string>(''); // Estado para armazenar o URI do PDF
    const [pontoencontro, setPontoEncontro] = useState('');
    const [precoDia, setPrecoDia] = useState<number | null>(null);
    const [precoSemana, setPrecoSemana] = useState<number | null>(null);
    const [precoMes, setPrecoMes] = useState<number | null>(null);
    const [caucao, setCaucao] = useState<number | null>(null);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [locadorId, setLocadorId] = useState('');

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading2(true);
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    setLocadorId(uid);  // Atualiza para o app todo, se precisar
                    await fetchCarroData(uid);
                } else {
                    console.error('ID do locador não encontrado');
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading2(false);
            }
        };
        carregarDados();
    }, [carroId]);



    const togglePeriod = (period: number) => {
        if (selectedPeriods.includes(period)) {
            setSelectedPeriods(selectedPeriods.filter(p => p !== period));
        } else {
            setSelectedPeriods([...selectedPeriods, period]);
        }
    };

    const handleCancelPdf = () => setPdfUri(clearFile());


    const handleImagePicker = async () => {
        const uri = await pickSingleImage();
        if (uri) {
            setLaudImage(uri);
        }
    };

    const handleCancelCarImage = (index: number) => {
        const newImages = removeImageByIndex(fotosCarro, index);
        setFotosCarro(newImages);
    };

    const handleMultipleImagePicker = async () => {
        const selectedImages = await pickMultipleImages();
        if (selectedImages.length > 0) {
            setFotosCarro(prev => [...prev, ...selectedImages]);
        }
    };

    const handleUpdate = async () => {
        setLoading2(true);
        try {
            const uid = await getUserId();
            const laudURL = await uploadImage(LaudImage, `laudoCarro/${uid}`);
            const carPhotosURLs = await uploadMultipleImages(fotosCarro, `carros/${uid}`);
            const pdfURL = await uploadPDF(pdfUri, `documentos/${uid}/${Date.now()}_doc.pdf`);

            await updateCarData(uid, carroId, {
                modelo,
                marca,
                ano,
                placa,
                combustivel,
                quantidadeLugares: Number(quantidadeLugares),
                arCondicionado: selectedAr,
                cambio: selectedCambio,
                step: selectedStep,
                airbags: selectedAirbags,
                fotoLaud: laudURL,
                fotosCarro: carPhotosURLs,
                modalidadesAluguel: selectedPeriods,
                precoDia: selectedPeriods.includes(0) ? precoDia : null,
                precoSemana: selectedPeriods.includes(1) ? precoSemana : null,
                precoMes: selectedPeriods.includes(2) ? precoMes : null,
                caucao,
                pdfDocumento: pdfURL,
                pontoencontro,
                pdfNome: pdfName,
                dataCriacao: firebase.firestore.FieldValue.serverTimestamp(), // 🔥 Aqui adiciona a data
            });

            setModalVisible(true);
            setLoading2(false);
        } catch (error) {
            console.error("Erro ao salvar as edições do carro: ", error);
            setLoading(false);
            setLoading2(false);
            setSitu('Erro ao salvar as edições do carro.');
            setModalVisible2(true);
        }
    };


    const fetchCarroData = async (uid: string) => {
        try {
            if (carroId) {
                const carro = await Services.fetchCarById(uid, carroId);
                if (carro) {
                    setModelo(carro.modelo);
                    setMarca(carro.marca);
                    setAno(String(carro.ano));
                    setPlaca(carro.placa);
                    setCombustivel(carro.combustivel);
                    setQuantidadeLugares(carro.quantidadeLugares);
                    setSelectedAr(carro.arCondicionado);
                    setSelectedStep(carro.step);
                    setSelectedCambio(carro.cambio);
                    setSelectedAirbags(carro.airbags);
                    setPontoEncontro(carro.pontoencontro);
                    setSelectedPeriods(carro.modalidadesAluguel);
                    setPrecoDia(carro.precoDia);
                    setPrecoSemana(carro.precoSemana);
                    setPrecoMes(carro.precoMes);
                    setCaucao(carro.caucao);
                    if (carro.fotoLaud) setLaudImage(carro.fotoLaud);
                    if (carro.fotosCarro) setFotosCarro(carro.fotosCarro);
                    if (carro.pdfDocumento) setPdfUri(carro.pdfDocumento);
                    if (carro.pdfNome) setPdfName(carro.pdfNome);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do carro: ", error);
        } finally {
            setIsUploading(false);
            setLoading(false);
        }
    };


    return (

        <View style={styles.container}>
            {(loading || loading2) && <Components.LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo}></View>
            <ScrollView>
                <Text style={styles.title}>
                    Edite os campos abaixo com cuidado, pois essas informações serão usadas para criar
                    o anúncio de aluguel do seu carro. Certifique-se de que todos os detalhes sejam precisos
                    e reflitam o estado real do veículo.
                </Text>

                <Divider style={{ marginBottom: 20, marginTop: 10 }} />

                {/* Modelo e Marca lado a lado */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    {/* Modelo */}
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.textocampo}>Modelo:</Text>
                        <TextInput
                            style={styles.modeloCarro}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Uno"
                            placeholderTextColor="#888888"
                            onChangeText={text => setModelo(text)}
                            value={modelo}
                        />
                    </View>

                    {/* Marca */}
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.textocampo}>Marca:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={marca}
                                onValueChange={(itemValue, _itemIndex) => setMarca(itemValue)}
                                selectionColor={'#fff'}
                                itemStyle={{ alignItems: 'center', color: 'white' }}
                                dropdownIconColor="#fff"
                                style={{ color: 'white' }}
                            >
                                <Picker.Item label="Selecione..." value="Nenhum" />
                                <Picker.Item label="BMW" value="BMW" />
                                <Picker.Item label="Chevrolet" value="Chevrolet" />
                                <Picker.Item label="Dodge" value="Dodge" />
                                <Picker.Item label="Fiat" value="Fiat" />
                                <Picker.Item label="Ford" value="Ford" />
                                <Picker.Item label="Honda" value="Honda" />
                                <Picker.Item label="Hyundai" value="Hyundai" />
                                <Picker.Item label="Jaguar" value="Jaguar" />
                                <Picker.Item label="Jeep" value="Jeep" />
                                <Picker.Item label="Nissan" value="Nissan" />
                                <Picker.Item label="Peugeot" value="Peugeot" />
                                <Picker.Item label="Renault" value="Renault" />
                                <Picker.Item label="Tesla" value="Tesla" />
                                <Picker.Item label="Toyota" value="Toyota" />
                                <Picker.Item label="Volkswagen" value="Volkswagen" />
                            </Picker>
                        </View>
                    </View>
                </View>

                {/* Ano e Placa lado a lado */}
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                    {/* Ano */}
                    <View style={{ flex: 1, marginRight: 8 }}>
                        <Text style={styles.textocampo}>Ano:</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="2010"
                            placeholderTextColor="#888888"
                            onChangeText={text => setAno(text)}
                            value={ano}
                        />
                    </View>

                    {/* Placa */}
                    <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text style={styles.textocampo}>Placa:</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="JHDCJH"
                            placeholderTextColor="#888888"
                            onChangeText={text => setPlaca(text)}
                            value={placa}
                        />
                    </View>
                </View>

                {/* Fotos do Carro ====================================================================================== */}
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
                                source={images.uploadIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                <View style={styles.pagination}>
                    {fotosCarro.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                { backgroundColor: index === activeIndex ? '#f2a51a' : '#888', width: index === activeIndex ? 9 : 7, height: index === activeIndex ? 9 : 7, marginBottom: 15, } // Amarelo para o ativo, cinza para os outros
                            ]}
                        />
                    ))}
                </View>

                <Text style={styles.caracteristicasTitle}>Características</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>


                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                        {/* Coluna Esquerda */}
                        <View>
                            <View style={styles.caracteristicaBloco}>
                                <View style={styles.caracteristicaLinha}>
                                    <FontAwesome name="tachometer" size={30} color="#f2a51a" />
                                    <Text style={styles.caracteristicaTexto}>Combustível</Text>
                                </View>
                                <Picker
                                    selectedValue={combustivel}
                                    onValueChange={(itemValue) => setCombustivel(itemValue)}
                                    selectionColor={'#fff'}
                                    itemStyle={{ alignItems: 'center', color: 'white' }}
                                    dropdownIconColor="#fff"
                                    style={{ color: 'white' }}
                                >
                                    <Picker.Item label="Selecione..." value="Nenhum" />
                                    <Picker.Item label="Gasolina" value="Gasolina" />
                                    <Picker.Item label="Etanol" value="Etanol" />
                                    <Picker.Item label="Flex" value="Flex" />
                                    <Picker.Item label="Elétrico" value="Elétrico" />
                                </Picker>
                            </View>

                            <View style={styles.caracteristicaBloco}>
                                <View style={styles.caracteristicaLinha}>
                                    <MaterialCommunityIcons name="car-seat" size={30} color="#f2a51a" />
                                    <Text style={styles.caracteristicaTexto}>Lugares</Text>
                                </View>
                                <TextInput
                                    value={String(quantidadeLugares)}
                                    onChangeText={(text) => setQuantidadeLugares(Number(text))}
                                    placeholder='5'
                                    keyboardType="numeric"
                                    style={styles.input}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholderTextColor="#888888"
                                />
                            </View>

                            <View style={styles.caracteristicaBloco}>
                                <View style={styles.caracteristicaLinha}>
                                    <MaterialCommunityIcons name="airbag" size={30} color="#f2a51a" />
                                    <Text style={styles.caracteristicaTexto}>Airbags</Text>
                                </View>
                                <Picker
                                    selectedValue={selectedAirbags}
                                    onValueChange={(itemValue) => setSelectedAirbags(itemValue)}
                                    selectionColor={'#fff'}
                                    itemStyle={{ alignItems: 'center', color: 'white' }}
                                    dropdownIconColor="#fff"
                                    style={{ color: 'white' }}
                                >
                                    <Picker.Item label="Selecione..." value="Nenhum" />
                                    <Picker.Item label="Sim" value="Sim" />
                                    <Picker.Item label="Não" value="Não" />
                                </Picker>
                            </View>
                        </View>

                        {/* Coluna Direita */}
                        <View>
                            <View style={styles.caracteristicaBloco}>
                                <View style={styles.caracteristicaLinha}>
                                    <MaterialCommunityIcons name="car-shift-pattern" size={30} color="#f2a51a" />
                                    <Text style={styles.caracteristicaTexto}>Câmbio</Text>
                                </View>
                                <Picker
                                    selectedValue={selectedCambio}
                                    onValueChange={(itemValue) => setSelectedCambio(itemValue)}
                                    selectionColor={'#fff'}
                                    itemStyle={{ alignItems: 'center', color: 'white' }}
                                    dropdownIconColor="#fff"
                                    style={{ color: 'white' }}
                                >
                                    <Picker.Item label="Selecione..." value="Nenhum" />
                                    <Picker.Item label="Manual" value="Manual" />
                                    <Picker.Item label="Automatizado " value="Automatizado" />
                                    <Picker.Item label="Automático" value="Automático" />
                                </Picker>
                            </View>

                            <View style={styles.caracteristicaBloco}>
                                <View style={styles.caracteristicaLinha}>
                                    <FontAwesome name="snowflake-o" size={30} color="#f2a51a" />
                                    <Text style={styles.caracteristicaTexto}>Ar-condicionado</Text>
                                </View>
                                <Picker
                                    selectedValue={selectedAr}
                                    onValueChange={(itemValue) => setSelectedAr(itemValue)}
                                    selectionColor={'#fff'}
                                    itemStyle={{ alignItems: 'center', color: 'white' }}
                                    dropdownIconColor="#fff"
                                    style={{ color: 'white' }}
                                >
                                    <Picker.Item label="Selecione..." value="Nenhum" />
                                    <Picker.Item label="Sim" value="Sim" />
                                    <Picker.Item label="Não" value="Não" />
                                </Picker>
                            </View>

                            <View style={styles.caracteristicaBloco}>
                                <View style={styles.caracteristicaLinha}>
                                    <MaterialCommunityIcons name="tire" size={30} color="#f2a51a" />
                                    <Text style={styles.caracteristicaTexto}>Estepe</Text>
                                </View>
                                <Picker
                                    selectedValue={selectedStep}
                                    onValueChange={(itemValue) => setSelectedStep(itemValue)}
                                    selectionColor={'#fff'}
                                    itemStyle={{ alignItems: 'center', color: 'white' }}
                                    dropdownIconColor="#fff"
                                    style={{ color: 'white' }}
                                >
                                    <Picker.Item label="Selecione..." value="Nenhum" />
                                    <Picker.Item label="Sim" value="Sim" />
                                    <Picker.Item label="Não" value="Não" />
                                </Picker>
                            </View>
                        </View>
                    </View>
                </View>


                <Divider style={{ marginBottom: 20, marginTop: 10 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 20 }}>
                    {/* CAUÇÃO */}
                    <View style={{ flex: 1 }}>
                        <View style={styles.caracteristicaLinha}>
                            <FontAwesome6 name="money-bill-transfer" size={26} color="#f2a51a" />
                            <Text style={styles.caracteristicaTexto}>Caução:R$</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder="Valor do caução"
                            placeholderTextColor="gray"
                            onChangeText={(text) => {
                                const numericValue = text.replace(/\D/g, '');
                                const valueAsNumber = Number(numericValue) / 100;
                                setCaucao(valueAsNumber);
                            }}
                            value={typeof caucao === 'number' && !isNaN(caucao) ? caucao.toFixed(2).replace('.', ',') : ''}
                            keyboardType="numeric"
                        />
                    </View>

                    {/* PONTO DE ENCONTRO */}
                    <View style={{ flex: 1 }}>
                        <View style={styles.caracteristicaLinha}>
                            <Entypo name="location" size={30} color="#f2a51a" />
                            <Text style={styles.caracteristicaTexto}>Ponto de Encontro:</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            placeholder='Metrô Itaquera'
                            placeholderTextColor="gray"
                            onChangeText={text => setPontoEncontro(text)}
                            value={pontoencontro}
                        />
                    </View>
                </View>

                <View style={[styles.caracteristicaLinha, { justifyContent: 'center' }]}>
                    <FontAwesome name="calendar" size={42} color="#f2a51a" />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={[styles.caracteristicaTexto, { color: '#f2a51a' }]}>Modalidade: </Text>
                        {/* Modalidade ====================================================================================== */}
                        <View>
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
                                            placeholderTextColor="gray"
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
                                            placeholderTextColor="gray"
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
                                            placeholderTextColor="gray"
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
                        </View>
                    </View>
                </View>

                <Divider style={{ marginBottom: 20, marginTop: 10 }} />

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
                            <TouchableOpacity onPress={() => setLaudImage('')} style={styles.cancelButton}>
                                <Text style={styles.cancelarText} >Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <MaterialCommunityIcons
                            style={{ marginBottom: 10, marginTop: 10 }}
                            name="file-document-multiple-outline"
                            size={160}
                            color="#888"
                        />
                    )}

                    <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione a imagem do laudo</Text>
                            <Image
                                style={styles.iconUpl}
                                source={images.uploadIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>


                {/* Visualizar PDF*/}

                <Text style={styles.textocampo}>Apólice de Seguro:</Text>
                <View style={styles.pdfContainer}>
                    {pdfUri ? (
                        <>
                            {/* Exibe o nome do arquivo PDF selecionado */}
                            <Text style={styles.pdfTex}>PDF selecionado: {pdfName}</Text>
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

                    {/* Botão para selecionar PDF */}
                    <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione o PDF da Apólice</Text>
                            <Image
                                style={styles.iconUpl}
                                source={images.uploadIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <Components.CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="Locação editada com sucesso!"
                    onConfirm={() => {
                        router.push(routes.viewLocation); // só se estiver usando `expo-router`
                    }}
                />

                <Components.CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message={situ}
                    confirmText="Entendi"
                    onConfirm={() => {
                        setModalVisible2(false);
                    }}
                />



                {/* Botão de Salvar */}
                <View style={{ alignItems: 'center', marginBottom: 30 }}>
                    <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18, }}>Salvar</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

        </View>
    );
}



