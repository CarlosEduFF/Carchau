import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity, Animated, Image, Modal, Pressable, Platform, Linking } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { Picker } from '@react-native-picker/picker';
import styles from './StylesAddress';
import { salvarOuAtualizarEndereco } from '~/services/addressUpdateService';
import { validateEndereco } from '~/utils/validators';
import { fetchEndereco } from '~/services/addressService';
import { buscarEnderecoPorCep } from '~/utils/cep';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal';

export default function Endereco() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [loading2, setLoading2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [situ, setSitu] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const pickerStyle = Platform.select({
        android: {
            color: '#fff',
        },
    });

    useEffect(() => {
        loadEndereco();
    }, []);

    const loadEndereco = async () => {
        setLoading(true);
        const endereco = await fetchEndereco();

        if (endereco) {
            setCep(endereco.cep);
            setEndereco(endereco.endereco);
            setNumero(endereco.numero);
            setComplemento(endereco.complemento);
            setBairro(endereco.bairro);
            setCidade(endereco.cidade);
            setEstado(endereco.estado);
        }

        setLoading(false);
    };

    const handleSave = async () => {
        try {
            const enderecoData = {
                cep,
                endereco,
                numero,
                complemento,
                bairro,
                cidade,
                estado,
            };

            const isValid = validateEndereco(enderecoData, setSitu, setModalVisible2);
            if (!isValid) return;

            setLoading2(true);

            await salvarOuAtualizarEndereco(enderecoData);

            setModalVisible(true);
        } catch (error) {
            console.error("Erro ao salvar os dados do usuário: ", error);
            setSitu('Erro ao salvar os dados. Tente novamente.');
            setModalVisible2(true);
        } finally {
            setLoading2(false);
        }
    };

    const handleBuscarCep = async (cep : string) => {
        try {
            const dados = await buscarEnderecoPorCep(cep);
            setEndereco(dados.endereco);
            setBairro(dados.bairro);
            setCidade(dados.cidade);
            setEstado(dados.estado);
        } catch (error) {
            setSitu('Erro ao buscar CEP');
            setModalVisible2(true);
        }
    };




    return (
        <>
            <View style={styles.container}>
                {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
                <View style={{ width: '100%', marginTop: 25 }}>
                    <ScrollView>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={styles.textocampo}>
                                Cep:
                            </Text>
                            <TouchableOpacity onPress={() => Linking.openURL('https://buscacepinter.correios.com.br')}>
                                <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 14 }}>
                                    Não sabe seu CEP?
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <MaskedTextInput
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={text => setCep(text)}
                            onBlur={() => handleBuscarCep(cep)}
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
                                selectedValue={estado}  // Usar o mesmo estado aqui
                                onValueChange={(itemValue) => setEstado(itemValue)}  // Atualizar diretamente o estado
                                dropdownIconColor='#fff'
                                style={pickerStyle}
                            >
                                <Picker.Item style={styles.picker} label="Selecione..." value="Selecione..." />
                                <Picker.Item style={styles.picker} label="AC" value="AC" />
                                <Picker.Item style={styles.picker} label="AL" value="AL" />
                                <Picker.Item style={styles.picker} label="AP" value="AP" />
                                <Picker.Item style={styles.picker} label="AM" value="AM" />
                                <Picker.Item style={styles.picker} label="BA" value="BA" />
                                <Picker.Item style={styles.picker} label="CE" value="CE" />
                                <Picker.Item style={styles.picker} label="ES" value="ES" />
                                <Picker.Item style={styles.picker} label="GO" value="GO" />
                                <Picker.Item style={styles.picker} label="MA" value="MA" />
                                <Picker.Item style={styles.picker} label="MT" value="MT" />
                                <Picker.Item style={styles.picker} label="MS" value="MS" />
                                <Picker.Item style={styles.picker} label="MG" value="MG" />
                                <Picker.Item style={styles.picker} label="PA" value="PA" />
                                <Picker.Item style={styles.picker} label="PB" value="PB" />
                                <Picker.Item style={styles.picker} label="PR" value="PR" />
                                <Picker.Item style={styles.picker} label="PE" value="PE" />
                                <Picker.Item style={styles.picker} label="PI" value="PI" />
                                <Picker.Item style={styles.picker} label="RJ" value="RJ" />
                                <Picker.Item style={styles.picker} label="RN" value="RN" />
                                <Picker.Item style={styles.picker} label="RS" value="RS" />
                                <Picker.Item style={styles.picker} label="RO" value="RO" />
                                <Picker.Item style={styles.picker} label="RR" value="RR" />
                                <Picker.Item style={styles.picker} label="SC" value="SC" />
                                <Picker.Item style={styles.picker} label="SP" value="SP" />
                                <Picker.Item style={styles.picker} label="SE" value="SE" />
                                <Picker.Item style={styles.picker} label="TO" value="TO" />
                                <Picker.Item style={styles.picker} label="DF" value="DF" />
                            </Picker>
                        </View>

                        <CustomModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            message='Endereço atualizado com Sucesso!'
                            confirmText="Entendi"
                            onConfirm={() => {
                                setModalVisible(!modalVisible);
                            }}
                        />

                        <CustomModal
                            visible={modalVisible2}
                            onClose={() => setModalVisible2(false)}
                            message={situ}
                            confirmText="Entendi"
                            onConfirm={() => {
                                setModalVisible2(!modalVisible2);
                            }}
                        />


                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={() => {handleSave();
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

