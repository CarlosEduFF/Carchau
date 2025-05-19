import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../utils/firebase';
import { useFocusEffect } from '@react-navigation/native';
import { Animated } from 'react-native';
import styles from '../Styles/StylesActivity';

export default function AtividadeScreen() {
    interface Solicitacao {
        id: string;
        modelo: string;
        marca: string;
        ano: number;
        valorTotal: number;
        totalDias: number;
        visto: boolean;
        dataInicio: string;
        dataTermino: string;
        locadorId: string;
        locatarioId: string;
        caucao: number;
        modalidadesAluguel: string;
        precoDia: number | null;
        precoSemana: number | null;
        precoMes: number | null;
        pontoencontro: string;
        dia: string;
        locatarionome: string;
        locatarioperfilImage: string,
        locadornome: string,
        locadorperfilImage: string,
        carroId: string;
        estado: string;
        descricao: string;
        estadoPGCaucao: string,
        estadoPGAluguel: string,
        confirRecepLocata: string,
        confirEntregaLocador: string,
        confirRecepLocador: string,
        confirDevoLocata: string,
        estadoavaliLD: string,
        estadoavaliLT: string
    }

    const [solicitacoesLocador, setSolicitacoesLocador] = useState<Solicitacao[]>([]);
    const [solicitacoesLocatario, setSolicitacoesLocatario] = useState<Solicitacao[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [userId, setUserId] = useState<string | null>(null); // Definição do estado para userId
    const defaultProfileImage = require('../../assets/icons/Profile-Icon.png');
    const translateX = useRef(new Animated.Value(-100)).current; // Inicia fora da tela à esquerda
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);
    const [modalShown, setModalShown] = useState<{ [key: string]: boolean }>({});
    const [activeTab, setActiveTab] = useState<'suas' | 'recebidas'>('suas'); // Estado para controlar a aba ativa
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            setUserId(id); // Armazena o userId no estado
        };


        fetchUserId();

    }, []);





    useFocusEffect(
        React.useCallback(() => {
            // Certifique-se de que o userId foi carregado
            if (!userId) return;

            const unsubscribeLocador = firebase.firestore()
                .collection('Locatarios')
                .onSnapshot(async (locatariosSnapshot) => {
                    try {
                        const solicitacoesPromises = locatariosSnapshot.docs.map(async (locatarioDoc) => {
                            const solicitacoesRef = locatarioDoc.ref
                                .collection('solicitacoes')
                                .where('locadorId', '==', userId)  // Garantindo que userId esteja disponível
                                .orderBy('dia', 'desc');

                            const solicitacoesSnapshot = await solicitacoesRef.get();
                            return solicitacoesSnapshot.docs.map(doc => {
                                const data = doc.data();
                                return {
                                    id: doc.id,
                                    modelo: data.modelo || '',
                                    marca: data.marca || '',
                                    ano: data.ano || 0,
                                    valorTotal: data.valorTotal || 0,
                                    totalDias: data.totalDias || 0,
                                    visto: data.visto || false,
                                    dataInicio: data.dataInicio || '',
                                    dataTermino: data.dataTermino || '',
                                    locadorId: data.locadorId || '',
                                    locatarioId: locatarioDoc.id,
                                    caucao: data.caucao || 0,
                                    modalidadesAluguel: data.modalidadesAluguel || '',
                                    precoDia: data.precoDia || null,
                                    precoSemana: data.precoSemana || null,
                                    precoMes: data.precoMes || null,
                                    pontoencontro: data.pontoencontro || '',
                                    dia: data.dia || '',
                                    locatarionome: data.locatarionome || '',
                                    locatarioperfilImage: data.locatarioperfilImage || null,
                                    locadornome: data.locadornome || null,
                                    locadorperfilImage: data.locadorperfilImage || null,
                                    carroId: data.carroId || '',
                                    estado: data.estado || '',
                                    descricao: data.descricao || '',
                                    estadoPGCaucao: data.estadoPGCaucao || '',
                                    estadoPGAluguel: data.estadoPGAluguel || '',
                                    confirRecepLocata: data.confirRecepLocata || '',
                                    confirEntregaLocador: data.confirEntregaLocador || '',
                                    confirRecepLocador: data.confirRecepLocador || '',
                                    confirDevoLocata: data.confirDevoLocata || '',
                                    estadoavaliLT: data.estadoavaliLT || '',
                                    estadoavaliLD: data.estadoavaliLD || '',
                                } as Solicitacao;
                            });
                        });

                        const solicitacoesList = (await Promise.all(solicitacoesPromises)).flat();
                        const filteredSolicitacoes = solicitacoesList.filter(solicitacao => solicitacao.visto);
                        setSolicitacoesLocador(filteredSolicitacoes);
                        setLoading(false);
                    } catch (error) {
                        console.error('Erro ao buscar solicitações do locador: ', error);
                        alert('Erro ao buscar solicitações do locador.');
                        setLoading(false);
                    }
                });

            return () => unsubscribeLocador(); // Cancela o listener quando o componente desmonta
        }, [userId]) // Executa quando o userId estiver disponível
    );


    useFocusEffect(
        React.useCallback(() => {
            if (!userId) return; // Só executa o listener se o userId estiver disponível

            const unsubscribeLocatario = firebase.firestore()
                .collection('Locatarios')
                .doc(userId)
                .collection('solicitacoes')
                .orderBy('dia', 'desc')
                .onSnapshot((solicitacoesSnapshot) => {
                    try {
                        const solicitacoesList = solicitacoesSnapshot.docs.map(doc => {
                            const data = doc.data();
                            return {
                                id: doc.id,
                                modelo: data.modelo || '',
                                marca: data.marca || '',
                                ano: data.ano || 0,
                                valorTotal: data.valorTotal || 0,
                                totalDias: data.totalDias || 0,
                                visto: data.visto || false,
                                dataInicio: data.dataInicio || '',
                                dataTermino: data.dataTermino || '',
                                locadorId: data.locadorId || '',
                                locatarioId: userId,
                                caucao: data.caucao || 0,
                                modalidadesAluguel: data.modalidadesAluguel || '',
                                precoDia: data.precoDia || null,
                                precoSemana: data.precoSemana || null,
                                precoMes: data.precoMes || null,
                                pontoencontro: data.pontoencontro || '',
                                dia: data.dia || '',
                                locatarionome: data.locatarionome || '',
                                locatarioperfilImage: data.locatarioperfilImage || null,
                                locadornome: data.locadornome || null,
                                locadorperfilImage: data.locadorperfilImage || null,
                                carroId: data.carroId || '',
                                estado: data.estado || '',
                                descricao: data.descricao || '',
                                estadoPGCaucao: data.estadoPGCaucao || '',
                                estadoPGAluguel: data.estadoPGAluguel || '',
                                confirRecepLocata: data.confirRecepLocata || '',
                                confirEntregaLocador: data.confirEntregaLocador || '',
                                confirRecepLocador: data.confirRecepLocador || '',
                                confirDevoLocata: data.confirDevoLocata || '',
                                estadoavaliLT: data.estadoavaliLT || '',
                                estadoavaliLD: data.estadoavaliLD || '',

                            } as Solicitacao;
                        });

                        setSolicitacoesLocatario(solicitacoesList);
                        setLoading(false);
                    } catch (error) {
                        console.error('Erro ao buscar solicitações do locatário: ', error);
                        alert('Erro ao buscar solicitações do locatário.');
                        setLoading(false);
                    }
                });

            return () => unsubscribeLocatario(); // Cancela o listener quando o componente desmonta
        }, [userId])
    );

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
                    <Image style={styles.carlogo} source={require('../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }


    const LocacaoFinalizada = ({ item }: { item: Solicitacao }) => {
        return (
            <View style={styles.eventContainer}>
                <Image
                    source={
                        item.locatarioperfilImage &&
                            typeof item.locatarioperfilImage === 'string' &&
                            item.locatarioperfilImage.trim() !== '' &&
                            item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>Locação finalizada</Text>
                    <Text style={styles.eventDate}>{item.dia}</Text>
                </View>
                <Text style={styles.eventValue}>Finalizado</Text>
            </View>
        );
    };

    const LocacaoRecusada = ({ item }: { item: Solicitacao }) => {
        if (item.estado !== 'Recusado') return null; // Se não for recusado, não exibe nada

        return (
            <View style={[styles.eventContainer]}>
                <Image
                    source={
                        item.locatarioperfilImage &&
                            typeof item.locatarioperfilImage === 'string' &&
                            item.locatarioperfilImage.trim() !== '' &&
                            item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>{item.descricao}</Text>
                </View>
                <Text style={styles.eventValue}>{item.estado}</Text>
            </View>
        );
    };

    const LocacaoAceita = ({ item }: { item: Solicitacao }) => {


        return (
            <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.dateText}>
                <View style={[styles.eventContainer]}>
                    <Image
                        source={
                            item.locatarioperfilImage &&
                                typeof item.locatarioperfilImage === 'string' &&
                                item.locatarioperfilImage.trim() !== '' &&
                                item.locatarioperfilImage.startsWith('http')
                                ? { uri: item.locatarioperfilImage }
                                : defaultProfileImage
                        }
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.eventName}>{item.locatarionome}</Text>
                        <Text style={styles.eventDescription}>{item.descricao}</Text>
                        <Text style={styles.eventDate}>{item.dia}</Text>
                    </View>
                    <Text style={styles.eventValue}>{item.estado}</Text>
                    <FontAwesome
                        name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                        size={25}
                        color='#fff'
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const RequisacaoLocacao = ({ item }: { item: Solicitacao }) => {

        return (
            <TouchableOpacity
                onPress={() =>
                    Requisicao(
                        item.id,
                        item.locadorId,
                        item.locatarioId,
                        item.carroId,
                        item.modalidadesAluguel,
                        item.dataInicio,
                        item.dataTermino,
                        item.valorTotal.toString(),
                        item.totalDias.toString(),
                        item.dia,
                        item.estado,
                        item.descricao
                    )
                }
            >
                <View style={[styles.eventContainer]}>
                    <Image
                        source={
                            item.locatarioperfilImage &&
                                typeof item.locatarioperfilImage === 'string' &&
                                item.locatarioperfilImage.trim() !== '' &&
                                item.locatarioperfilImage.startsWith('http')
                                ? { uri: item.locatarioperfilImage }
                                : defaultProfileImage
                        }
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.eventName}>{item.locatarionome}</Text>
                        <Text style={styles.eventDescription}>{item.descricao}</Text>
                        <Text style={styles.eventDate}>{item.dia}</Text>
                    </View>
                    <Text style={styles.eventValue}>{item.estado}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const getOpacity = (disabled: boolean) => ({
        opacity: disabled ? 0.5 : 1,
    });

    const AtivdPGCaucao = ({ item, isLocador }: { item: Solicitacao; isLocador: boolean }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    !isLocador && PGCaucao(item.id, item.locadorId, item.locatarioId, item.carroId)
                }
                disabled={isLocador || item.estadoPGCaucao === 'Caução pago'}
                style={[styles.eventContainer, getOpacity(isLocador || item.estadoPGCaucao === 'Caução pago')]}
            >
                <Image
                    source={
                        item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>
                        {item.estadoPGCaucao === 'Caução pago' ? 'Caução pago' : 'Realize o pagamento do caução'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const AtivdPGAluguel = ({ item, isLocador }: { item: Solicitacao; isLocador: boolean }) => {
        return (
            <TouchableOpacity
                onPress={() =>
                    !isLocador && PGAluguel(item.id, item.locadorId, item.locatarioId, item.carroId, item.valorTotal)
                }
                disabled={isLocador || item.estadoPGAluguel === 'Aluguel pago' || item.estadoPGCaucao !== 'Caução pago'}
                style={[
                    styles.eventContainer,
                    getOpacity(isLocador || item.estadoPGAluguel === 'Aluguel pago' || item.estadoPGCaucao !== 'Caução pago'),
                ]}
            >
                <Image
                    source={
                        item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>
                        {item.estadoPGAluguel === 'Aluguel pago' ? 'Aluguel pago' : 'Realize o pagamento do aluguel'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const AtivdConEn = ({ item, isLocador }: { item: Solicitacao; isLocador: boolean }) => {
        return (
            <TouchableOpacity
                onPress={() => Verificacao(item.id, item.locadorId, item.locatarioId)}
                disabled={
                    (item.confirRecepLocata === 'Veículo recebido' &&
                        item.confirEntregaLocador === 'Veículo entregue') ||
                    item.estadoPGAluguel !== 'Aluguel pago'
                }
                style={[
                    styles.eventContainer,
                    getOpacity((item.confirRecepLocata === 'Veículo recebido' &&
                        item.confirEntregaLocador === 'Veículo entregue') ||
                        item.estadoPGAluguel !== 'Aluguel pago'),
                ]}
            >
                <Image
                    source={
                        item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>Confirmar entrega do veículo</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const AtivdConDe = ({ item, isLocador }: { item: Solicitacao; isLocador: boolean }) => {
        return (
            <TouchableOpacity
                onPress={() => VerificacaoDev(item.id, item.locadorId, item.locatarioId)}
                disabled={
                    (item.confirRecepLocador === 'Veículo recebido' &&
                        item.confirDevoLocata === 'Veículo devolvido') ||
                    item.confirRecepLocata !== 'Veículo recebido' ||
                    item.confirEntregaLocador !== 'Veículo entregue'
                }
                style={[
                    styles.eventContainer,
                    getOpacity((item.confirRecepLocador === 'Veículo recebido' &&
                        item.confirDevoLocata === 'Veículo devolvido') ||
                        item.confirRecepLocata !== 'Veículo recebido' ||
                        item.confirEntregaLocador !== 'Veículo entregue'),
                ]}
            >
                <Image
                    source={
                        item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>Confirmar devolução do veículo</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const AtivdAvali = ({ item, isLocador }: { item: Solicitacao; isLocador: boolean }) => {
        return (
            <TouchableOpacity
                onPress={() => Avaliacao(item.id, item.locadorId, item.locatarioId, item.carroId)}
                disabled={
                    (isLocador && item.estadoavaliLD === 'Avaliado') ||
                    (!isLocador && item.estadoavaliLT === 'Avaliado') ||
                    item.confirDevoLocata !== 'Veículo devolvido'
                }
                style={[
                    styles.eventContainer,
                    getOpacity((isLocador && item.estadoavaliLD === 'Avaliado') ||
                        (!isLocador && item.estadoavaliLT === 'Avaliado') ||
                        item.confirDevoLocata !== 'Veículo devolvido'),
                ]}
            >
                <Image
                    source={
                        item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>Realize a avaliação desta locação</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const AtivdVerfMaps = ({ item, isLocador }: { item: Solicitacao; isLocador: boolean }) => {
        return (
            <TouchableOpacity
                onPress={() => Maps(item.id, item.locadorId, item.locatarioId, item.carroId)}
                disabled={
                    (item.confirRecepLocata === 'Veículo recebido') ||
                    item.estadoPGAluguel !== 'Aluguel pago'
                }
                style={[
                    styles.eventContainer,
                    getOpacity((item.confirRecepLocata === 'Veículo recebido') ||
                        item.estadoPGAluguel !== 'Aluguel pago'),
                ]}
            >
                <Image
                    source={
                        item.locatarioperfilImage && item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>Realize a verificação de sua Localização</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const renderSolicitacao = ({ item }: { item: Solicitacao }) => {

        const isLocador = userId === item.locadorId;
        const isLocacaoFinalizada =
            item.estadoPGCaucao === 'Caução pago' &&
            item.estadoPGAluguel === 'Aluguel pago' &&
            item.confirRecepLocata === 'Veículo recebido' &&
            item.confirEntregaLocador === 'Veículo entregue' &&
            item.confirDevoLocata === 'Veículo devolvido' &&
            item.confirRecepLocador === 'Veículo recebido' &&
            item.estadoavaliLD === 'Avaliado' &&
            item.estadoavaliLT === 'Avaliado';

        // Função que chamará o finalizarLocacao


        return (
            <View style={styles.dateSection}>
                {isLocacaoFinalizada ? (
                    <LocacaoFinalizada item={item} />
                ) : item.estado === 'Recusado' ? (
                    <LocacaoRecusada item={item} />
                ) : item.estado === 'Aceito' ? (
                    <LocacaoAceita item={item} />
                ) : (
                    <RequisacaoLocacao item={item} />
                )}

                {/* Exibir atividades adicionais se a solicitação for aceita e expandida */}
                {item.estado === 'Aceito' && expandedId === item.id && item.visto && (
                    <View>
                        {/* Botão para pagamento do caução */}
                        <AtivdPGCaucao item={item} isLocador={isLocador} />

                        {/* Botão para pagamento do aluguel */}
                        <AtivdPGAluguel item={item} isLocador={isLocador} />

                        {/* Confirmação de entrega */}
                        {(item.locatarioId === userId || item.locadorId === userId) && (
                            <AtivdVerfMaps item={item} isLocador={isLocador} />
                        )}

                        {(item.locatarioId === userId || item.locadorId === userId) && (
                            <AtivdConEn item={item} isLocador={isLocador} />
                        )}

                        {/* Confirmação de devolução */}
                        {(item.locatarioId === userId || item.locadorId === userId) && (
                            <AtivdConDe item={item} isLocador={isLocador} />
                        )}

                        {/* Avaliação */}
                        {(item.locatarioId === userId || item.locadorId === userId) && (
                            <AtivdAvali item={item} isLocador={isLocador} />
                        )}


                    </View>
                )}
            </View>
        );
    };



    const Requisicao = (
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
        CarroID: string,
        SelectedModalidade: string,
        DataInicio: string,
        DataTermino: string,
        TotalValor: string,
        TotalDias: string,
        Dia: string,
        Estado: string,
        Descricao: string
    ) => {
        console.log("Solicitação", SolicitacaoId, "Locador", LocadorId, "Locatario", LocatarioId, "Carro", CarroID, "Modalidade", SelectedModalidade, "DataInicio", DataInicio, "DataTermino", DataTermino, "TotalValor", TotalValor, "TotalDias", TotalDias, "Dia", Dia, "Estado", Estado, "Descricao", Descricao);

        AsyncStorage.getItem('userId').then(userId => {
            if (userId === LocadorId) {
                router.push({
                    pathname: '/screens/ActivityScreen/lessorRequiScreen/lessorrequi',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,
                        carroId: CarroID,
                        Modalidade: SelectedModalidade,
                        DataInicio: DataInicio,
                        DataTermino: DataTermino,
                        TotalValor: TotalValor,
                        TotalDias: TotalDias,
                        Dia: Dia,
                        Estado: Estado,
                        Descricao: Descricao
                    },
                });
            } else if (userId === LocatarioId) {
                console.log(LocatarioId);
                router.push({
                    pathname: '/screens/ActivityScreen/lesseeRequiScreen/lesseerequi',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,
                        carroId: CarroID,
                        Modalidade: SelectedModalidade,
                        DataInicio: DataInicio,
                        DataTermino: DataTermino,
                        TotalValor: TotalValor,
                        TotalDias: TotalDias,
                        Dia: Dia,
                        Estado: Estado,
                        Descricao: Descricao
                    },
                });
            }
        }).catch(error => {
            console.error("Erro ao obter o ID do usuário: ", error);
        });
    }

    function PGCaucao(
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
        CarroID: string,
    ) {
        router.push({
            pathname: '/screens/ActivityScreen/pyCaucao/caucao',
            params: {
                soliciId: SolicitacaoId,
                locadorId: LocadorId,
                locatarioId: LocatarioId,
                carroId: CarroID,
            }
        });
    }

    function PGAluguel(
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
        CarroID: string,
        TotalValor: number,
    ) {
        router.push({
            pathname: '/screens/ActivityScreen/pyRent/rent',
            params: {
                soliciId: SolicitacaoId,
                locadorId: LocadorId,
                locatarioId: LocatarioId,
                carroId: CarroID,
                TotalValor: TotalValor.toString(), // Converter para string caso necessário
            }
        });
    }

    function Verificacao(
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
    ) {
        console.log("Solicitação", SolicitacaoId, "Locador", LocadorId, "Locatario", LocatarioId);

        AsyncStorage.getItem('userId').then(userId => {
            if (userId === LocadorId) {
                router.push({
                    pathname: '/screens/ActivityScreen/verfLessor/verflessor',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,

                    },
                });
            } else if (userId === LocatarioId) {
                router.push({
                    pathname: '/screens/ActivityScreen/verfLessee/verflessee',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,
                    },
                });
            }
        }).catch((error: any) => {
            console.error("Erro ao obter o ID do usuário: ", error);
        });
    }
    function VerificacaoDev(
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
    ) {
        console.log("Solicitação", SolicitacaoId, "Locador", LocadorId, "Locatario", LocatarioId);

        AsyncStorage.getItem('userId').then(userId => {
            if (userId === LocadorId) {
                router.push({
                    pathname: '/screens/ActivityScreen/verfLessor/verflessor',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,

                    },
                });
            } else if (userId === LocatarioId) {
                router.push({
                    pathname: '/screens/ActivityScreen/verfLessee/verflessee',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,
                    },
                });
            }
        }).catch((error: any) => {
            console.error("Erro ao obter o ID do usuário: ", error);
        });
    }

    function Avaliacao(
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
        CarroId: string,
    ) {
        console.log("Solicitação", SolicitacaoId, "Locador", LocadorId, "Locatario", LocatarioId, "Carro:", CarroId);

        AsyncStorage.getItem('userId').then(userId => {
            if (userId === LocadorId) {
                router.push({
                    pathname: '/screens/ActivityScreen/evaluateLessor/evaluate',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,

                    },
                });
            } else if (userId === LocatarioId) {
                router.push({
                    pathname: '/screens/ActivityScreen/evaluateLessee/evaluate',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,
                        carroId: CarroId,
                    },
                });
            }
        }).catch((error: any) => {
            console.error("Erro ao obter o ID do usuário: ", error);
        });
    }

    const Maps = (
        SolicitacaoId: string,
        LocadorId: string,
        LocatarioId: string,
        CarroId: string,
    ) => {
        console.log("Solicitação", SolicitacaoId, "Locador", LocadorId, "Locatario", LocatarioId, "Carro:", CarroId);

        AsyncStorage.getItem('userId').then(userId => {
            if (userId === LocadorId) {
                router.push({
                    pathname: '/screens/ActivityScreen/verfMapsLessor/verfMapsLessorScreen',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,

                    },
                });
            } else if (userId === LocatarioId) {
                router.push({
                    pathname: '/screens/ActivityScreen/verfMapsLessee/verfMapsLesseeScreen',
                    params: {
                        soliciId: SolicitacaoId,
                        locadorId: LocadorId,
                        locatarioId: LocatarioId,
                        carroId: CarroId,
                    },
                });
            }
        }).catch((error: any) => {
            console.error("Erro ao obter o ID do usuário: ", error);
        });
    }






    return (
        <View style={styles.container}>

            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'suas' && styles.activeTab]}
                    onPress={() => setActiveTab('suas')}
                >
                    <Text style={styles.tabText}>Suas Solicitações</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'recebidas' && styles.activeTab]}
                    onPress={() => setActiveTab('recebidas')}
                >
                    <Text style={styles.tabText}>Solicitações Recebidas</Text>
                </TouchableOpacity>
            </View>

            {solicitacoesLocador.length > 0 || solicitacoesLocatario.length > 0 ? (
                <FlatList
                    data={activeTab === 'suas' ? solicitacoesLocatario : solicitacoesLocador}
                    keyExtractor={item => item.id}
                    renderItem={renderSolicitacao}
                />
            ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', width: '100%' }}>
                    <Text style={styles.foco}>Nenhuma solicitação encontrada</Text>
                </View>


            )}

            {selectedSolicitacao && (
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.foco}>Requisição Enviada</Text>
                            <Text style={styles.modalText}>
                                A solicitação foi enviada, em está em processo de análise pelo locador,
                                aguarde a resposta do locador.
                            </Text>
                            <Text>Solicitante: {selectedSolicitacao.locatarionome}</Text>
                            <Text>Descrição: {selectedSolicitacao.descricao}</Text>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}>
                                <Text style={styles.textStyle}>Entendi!</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}


