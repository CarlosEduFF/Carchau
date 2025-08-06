import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { CheckBox } from '@rneui/themed';
import PagerView from 'react-native-pager-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import styles from './StylesAddLocation';
import images from '~/constants/images';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { pickMultipleImages, pickPdf, pickSingleImage, removeImageByIndex } from '~/utils/handleMediaManager';
import { routes } from '~/constants/routes';
import CustomModal from '~/components/CustomModal';
import { saveCar } from '~/services/carSaveService';
import { Carro } from '~/types/Cars';
import firebase from '~/config/firebase';


export default function CarRegistrationScreen() {

    const pickerStyle = Platform.select({
        ios: {
            color: '#ffffff',
        },
        android: {
            color: '#fff',
        },
    });

    const [LaudImage, setLaudImage] = useState<string>('');
    const [pdfUri, setPdfUri] = useState<string>('');
    const [fotosCarro, setFotosCarro] = useState<string[]>([]);
    const [pdfName, setPdfName] = useState<string>('');
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
    const [isUploading, setIsUploading] = useState(false);
    const [precoDia, setPrecoDia] = useState<number>(0);
    const [precoSemana, setPrecoSemana] = useState<number>(0);
    const [precoMes, setPrecoMes] = useState<number>(0);
    const [caucao, setCaucao] = useState<number>(0);
    const [pontoencontro, setPontoEncontro] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [loading2, setLoading2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleSave = async () => {
        try {
            setLoading2(true);
            const quantidadeLugaresNum = Number(quantidadeLugares);
            if (isNaN(quantidadeLugaresNum)) {
                throw new Error("Quantidade de lugares inválida");
            }
            const carData: Carro = {
                modelo,
                marca,
                ano: Number(ano),
                placa,
                combustivel,
                quantidadeLugares: quantidadeLugaresNum,
                arCondicionado: selectedAr,
                step: selectedStep,
                cambio: selectedCambio,
                airbags: selectedAirbags,
                modalidadesAluguel: selectedPeriods,
                caucao: Number(caucao),
                pontoencontro,
                fotoLaud: LaudImage,
                pdfDocumento: pdfUri,
                pdfNome: pdfName,
                fotosCarro,
                precoDia: precoDia,
                precoSemana: precoSemana,
                precoMes: precoMes,
                dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            };

            await saveCar(carData);

            setLoading2(false);
            setModalVisible(true); // Sucesso
        } catch (error: any) {
            setLoading2(false);
            setSitu(error.message);
            setModalVisible2(true);
            console.error('Erro:', error);
        }
    };

    const togglePeriod = (period: number) => {
        if (selectedPeriods.includes(period)) {
            setSelectedPeriods(selectedPeriods.filter(p => p !== period));
        } else {
            setSelectedPeriods([...selectedPeriods, period]);
        }
    };

    const handleCancelMedia = (type: 'pdf' | 'Laud' | 'Car', index?: number) => {
        if (type === 'pdf') {
            setPdfUri(''); // Limpa PDF
            setPdfName('');
        }
        if (type === 'Laud') {
            setLaudImage(''); // Limpa Laud
        }
        if (type === 'Car') {
            if (typeof index === 'number') {
                const newImages = removeImageByIndex(fotosCarro, index);
                setFotosCarro(newImages);
            } else {
                console.warn('Index é necessário para remover uma imagem do carro');
            }
        }
    };

    const handleMediaManager = async (type: 'pdf' | 'single-image' | 'multi-image') => {
        try {
            if (type === 'pdf') {
                const pdf = await pickPdf();
                if (pdf) {
                    setPdfUri(pdf.uri);
                    setPdfName(pdf.name);
                    console.log('PDF selecionado:', pdf.uri);
                }
            }
            if (type === 'single-image') {
                const image = await pickSingleImage();
                if (image) {
                    setLaudImage(image);
                    console.log('Imagem selecionada:', image);
                }
            }
            if (type === 'multi-image') {
                const images = await pickMultipleImages();
                if (images.length > 0) {
                    setFotosCarro(images);
                    console.log('Imagens selecionadas:', images);
                }
            }
        } catch (error) {
            console.error('Erro no gerenciador de mídia:', error);
        }
    };

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
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
                            <TouchableOpacity onPress={() => handleCancelMedia('Laud')} style={styles.cancelButton}>
                                <Text style={styles.cancelarText} >Cancelar</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <MaterialCommunityIcons style={{ marginBottom: 10, marginTop: 10, }} name="file-document-multiple-outline" size={160} color="#888" />
                    )}


                    <TouchableOpacity style={styles.button} onPress={() => handleMediaManager('single-image')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione a imagem do laudo</Text>
                            <Image
                                style={styles.iconUpl}
                                source={images.uploadIcon}
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
                                <TouchableOpacity onPress={() => handleCancelMedia('pdf')} style={styles.cancelButton}>
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

                    <TouchableOpacity style={styles.button} onPress={() => handleMediaManager('pdf')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione o PDF da Apólice</Text>
                            <Image
                                style={styles.iconUpl}
                                source={images.uploadIcon}
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
                                        onPress={() => () => handleCancelMedia('Car')}
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

                    <TouchableOpacity style={styles.button} onPress={() => handleMediaManager('multi-image')}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: 'white', marginRight: 8 }}>Selecione imagens do carro</Text>
                            <Image
                                style={styles.iconUpl}
                                source={images.uploadIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="Locação adicionada com sucesso!"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
                        router.push(routes.viewLocation);
                    }}
                />

                <CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message={situ}
                    onConfirm={() => {
                        setModalVisible2(!modalVisible2);
                        router.push(routes.viewLocation);
                    }}
                />

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


