import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import styles from './StylesChange';
import { Request } from '~/types/Request';
import { getSolicitacoesByLocador, updateSolicitacaoValor } from '~/services/changeService';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal';
import { fetchCarroById } from '~/services/carService';

export default function AluguelVeiculo() {
    const [valorTotal, setValorTotal] = useState<number | null>(null);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<Request | null>(null);
    const route = useRoute();

    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const locatarioIdParam = useLocalSearchParams()?.locatarioId;
    const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
    const [userId, setUserId] = useState<string | null>(null); // Definição do estado para userId
    const [modalVisible, setModalVisible] = useState(false);
    const [solicitacoes, setSolicitacoes] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [ano, setAno] = useState('');
    const [caucao, setCaucao] = useState<number | null>(null);
    const [dataInicio, setdataInicio] = useState<string>("Não avaliado");
    const [dataTermino, setdataTermino] = useState<string>("Não avaliado");
    const [totalDias, settotalDias] = useState<string>("Não avaliado");

    const fetchUserId = async () => {
        const id = await AsyncStorage.getItem('userId');
        setUserId(id); // Armazena o userId no estado
    };
    const [solicitacoesComCarro, setSolicitacoesComCarro] = useState<
        (Request & { marca?: string; modelo?: string; ano?: string })[]
    >([]);

    const fetchSolicitacoesByLocador = async () => {
        setLoading(true);
        const data = await getSolicitacoesByLocador(locatarioId, locadorId);

        // Buscar dados de cada carro
        const solicitacoesEnriquecidas = await Promise.all(
            data.map(async (solicitacao) => {
                try {
                    const carro = await fetchCarroById(solicitacao.locadorId, solicitacao.carroId);
                    return {
                        ...solicitacao,
                        marca: carro?.marca ?? '',
                        modelo: carro?.modelo ?? '',
                        ano: carro?.ano ? String(carro.ano) : '',
                    };
                } catch {
                    return solicitacao; // retorna como está se der erro
                }
            })
        );

        setSolicitacoesComCarro(solicitacoesEnriquecidas);
        setLoading(false);
    };

    const fetchCarroData = async (solicitacao: Request) => {
        try {
            if (!solicitacao.carroId) {
                console.warn("carroId não encontrado na solicitação.");
                return;
            }

            const carro = await fetchCarroById(solicitacao.locadorId, solicitacao.carroId);

            if (carro) {
                setModelo(carro.modelo);
                setMarca(carro.marca);
                setAno(String(carro.ano));
                setCaucao(carro.caucao);
            } else {
                console.warn("Carro não encontrado.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do carro:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleUpdate = async () => {
        if (!selectedSolicitacao || !locatarioId) return;

        try {
            setLoading2(true);

            await updateSolicitacaoValor({
                locatarioId,
                solicitacaoId: selectedSolicitacao.id,
                valorTotal,
                caucao,
            });

            setModalVisible(true);
        } catch {
            alert('Erro ao salvar as edições do carro.');
        } finally {
            setLoading2(false);
        }
    };


    useEffect(() => {
        const fetchAll = async () => {
            await fetchUserId(); // 1. Garante que o usuário esteja disponível
            await fetchSolicitacoesByLocador(); // 2. Busca as solicitações
        };
        fetchAll();
    }, [locatarioId, locadorId]);

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo}></View>
            <Text style={styles.textocampo}>
                Selecione a solicitação a ser alterada
            </Text>
            <View style={styles.pickerContainer}>
                {solicitacoesComCarro.length > 0 ? (
                    <Picker
                        selectedValue={selectedSolicitacao?.id}
                        dropdownIconColor={'#fff'}
                        onValueChange={(itemValue) => {
                            const solicitacao = solicitacoesComCarro.find(s => s.id === itemValue);
                            if (solicitacao) {
                                setSelectedSolicitacao(solicitacao);
                                setValorTotal(solicitacao.valorTotal ? Number(solicitacao.valorTotal) : 0);
                                fetchCarroData(solicitacao);
                            }
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione a solicitação" value="" />
                        {solicitacoesComCarro.map((solicitacao) => (
                            <Picker.Item
                                key={solicitacao.id}
                                label={`${solicitacao.id.slice(0, 6)} - ${solicitacao.marca} - ${solicitacao.modelo} - ${solicitacao.ano}`}
                                value={solicitacao.id}
                            />
                        ))}
                    </Picker>
                ) : (
                    <Text style={styles.textocampo}>Nenhuma solicitação disponível para edição.</Text>
                )}
            </View>

            {selectedSolicitacao && (
                <View>
                    <Text style={styles.textocampo}>
                        Modelo: {modelo}
                    </Text>
                    <Text style={styles.textocampo}>
                        Marca: {marca}
                    </Text>
                    <Text style={styles.textocampo}>
                        Ano: {ano}
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
                                setCaucao(valueAsNumber);
                            }}
                            value={typeof caucao === 'number' && !isNaN(caucao) ? caucao.toFixed(2).replace('.', ',') : ''}
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


            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message="Solicitação editada com sucesso!"
                confirmText="Entendi"
                onConfirm={() => { setModalVisible(false), router.push('/(tabs)/contact'); }}
            />

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
