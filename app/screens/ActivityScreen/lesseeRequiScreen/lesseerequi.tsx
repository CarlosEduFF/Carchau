import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../utils/firebase';
import { Alert, Modal, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from './StylesLesseeRequi';

export default function AluguelScreen() {


    const defaultProfileImage = require('../../../../assets/icons/Profile-Icon.png');


    const [modalVisible, setModalVisible] = useState(false);
    const [modelo, setModelo] = useState('Não disponível');
    const [marca, setMarca] = useState('Não disponível');
    const [ano, setAno] = useState('Não disponível');
    const [isUploading, setIsUploading] = useState(false);
    const [loading, setloading] = useState(true); // Inicializando como true para mostrar carregamento


    const defaultVehicleImage = require('../../../../assets/icons/Car-Icon.png');


    const [caucao, setCaucao] = useState("Não disponível");

    const [nome, setNome] = useState<string | null>(null);
    const [nome2, setNome2] = useState<string | null>(null);
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [laudImage, setLaudImage] = useState<string | null>(null);
    const [fotosCarro, setFotosCarro] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [precoDia, setPrecoDia] = useState('Não disponível');
    const [precoSemana, setPrecoSemana] = useState('Não disponível');
    const [precoMes, setPrecoMes] = useState('Não disponível');

    const soliciIdParam = useLocalSearchParams()?.soliciId;
    const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
    const locadorIdParam = useLocalSearchParams()?.locadorId;
    const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
    const LocatarioIdParam = useLocalSearchParams()?.locatarioId;
    const LocatarioId = Array.isArray(LocatarioIdParam) ? LocatarioIdParam[0] : LocatarioIdParam;
    const carroIdParam = useLocalSearchParams()?.carroId;
    const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
    const ModalidadeParam = useLocalSearchParams()?.Modalidade;
    const Modalidade = Array.isArray(ModalidadeParam) ? ModalidadeParam[0] : ModalidadeParam;
    const DataInicioParam = useLocalSearchParams()?.DataInicio;
    const DataInicio = Array.isArray(DataInicioParam) ? DataInicioParam[0] : DataInicioParam;
    const DataTerminoParam = useLocalSearchParams()?.DataTermino;
    const DataTermino = Array.isArray(DataTerminoParam) ? DataTerminoParam[0] : DataTerminoParam;
    const TotalDiasParam = useLocalSearchParams()?.TotalDias;
    const TotalDias = Array.isArray(TotalDiasParam) ? TotalDiasParam[0] : TotalDiasParam;
    const TotalValorParam = useLocalSearchParams()?.TotalValor;
    const TotalValor = Array.isArray(TotalValorParam) ? TotalValorParam[0] : TotalValorParam;
    const DiaParam = useLocalSearchParams()?.Dia;
    const Dia = Array.isArray(DiaParam) ? DiaParam[0] : DiaParam;
    const EstadoParam = useLocalSearchParams()?.Estado;
    const DescricaoParam = useLocalSearchParams()?.Descricao;
    const [loading2, setLoading2] = useState(false);
    const [selectedModalidade, setSelectedModalidade] = useState('economico');
    const [dataInicio, setDataInicio] = useState<string | null>(null);
    const [dataTermino, setDataTermino] = useState<string | null>(null);
    const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
    const [mostrarDataTermino, setMostrarDataTermino] = useState(false);
    const [valorTotal, setValorTotal] = useState(0);
    const [totaldias, setTotalDias] = useState("Não disponível");
    const [pontoencontro, setPontoEncontro] = useState('Não disponível');
    const [visto, setVisto] = useState('false');
    const [LocadorID, setLocadorID] = useState("Não disponível");
    const [carroID, setCarroID] = useState("Não disponível");

    const [modalVisible2, setModalVisible2] = useState(false);

    const handle = async () => {
        setIsUploading(true); // Mostrar indicador de carregamento

        setModalVisible(true);


    };



    useEffect(() => {
        if (!carroId) {
            console.log('carroId não está disponível ainda');
            return;
        }

        const fetchCarroData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (locadorId && carroId) {
                    const carroDoc = await firebase.firestore()
                        .collection('Locatarios')
                        .doc(locadorId)
                        .collection('carros')
                        .doc(carroId)
                        .get();

                    setLocadorID(locadorId);
                    setCarroID(carroId);

                    if (carroDoc.exists) {
                        const carroData = carroDoc.data();
                        setModelo(carroData?.modelo || 'Não disponível');
                        setMarca(carroData?.marca || 'Não disponível');
                        setAno(carroData?.ano || 'Não disponível');
                        setCaucao(carroData?.caucao || 'Não disponível');
                        setPontoEncontro(carroData?.pontoencontro || '');
                        if (carroData?.fotoLaud) {
                            setLaudImage(carroData.fotoLaud);
                        }
                        if (carroData?.fotosCarro && Array.isArray(carroData.fotosCarro)) {
                            setFotosCarro(carroData.fotosCarro);
                        }
                        setSelectedPeriods(carroData?.modalidadesAluguel || []);
                        setPrecoDia(carroData?.precoDia || '');
                        setPrecoSemana(carroData?.precoSemana || '');
                        setPrecoMes(carroData?.precoMes || '');
                    }
                }
                if (uid) {
                    const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData) {
                            setNome(userData.nome || 'Usuário');
                            setPerfilImage(userData.fotoPerfil || null);
                        }
                    }
                }
                if (locadorId) {
                    const userDoc = await firebase.firestore().collection('Locatarios').doc(locadorId).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData) {
                            setNome2(userData.nome || 'Usuário');

                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do carro: ", error);
            } finally {
                setloading(false); // Finaliza o carregamento
            }
        };
        fetchCarroData();
    }, [carroId]);

    const handleDelete = async () => {

        try {
            const uid = await AsyncStorage.getItem('userId');
            if (!uid) {
                alert('Erro ao obter ID do usuário.');
                return;
            }
            console.log(soliciId);

            const carroRef = firebase.firestore()
                .collection('Locatarios')
                .doc(uid)
                .collection('solicitacoes')
                .doc(soliciId);

            await carroRef.delete(); // Exclui o documento

            console.log('Solicitação excluída com sucesso');
            setLoading2(false);

            setModalVisible2(true);
        } catch (error) {
            setLoading2(false);
            console.error("Erro ao excluir a solicitação: ", error);
            alert('Erro ao excluir a solicitação.');
        } finally {
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
                    <Image style={styles.carlogo} source={require('../../../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.Topo}></View>
            <Text style={styles.header}>Requisição de aluguel</Text>
            <Text style={styles.date}>{Dia}</Text>
            <View style={styles.userSection}>
                {/* Coluna para a imagem do perfil e o botão "Ver Perfil" */}
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <Image style={styles.avatar} source={perfilImage ? { uri: perfilImage } : defaultProfileImage} />
                </View>
                <FontAwesome5 name="arrow-right" size={33} color="#d9d7d7" />
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <Image
                        source={
                            fotosCarro && Array.isArray(fotosCarro) && fotosCarro.length > 0 && typeof fotosCarro[0] === 'string'
                                ? { uri: fotosCarro[0] }
                                : defaultVehicleImage
                        }
                        style={styles.avatar}
                    />
                </View>
            </View>
            <View style={styles.Conftext}>
                <Text style={styles.description}>
                    Você locatário <Text style={styles.foco}>{nome}</Text> confirma o interesse em alugar o veiculo
                    <Text style={styles.foco}> {marca} {modelo} {ano} </Text> do locador <Text style={styles.foco}>{nome2}</Text>
                    do dia <Text style={styles.foco}>{DataInicio}</Text> ao dia <Text style={styles.foco}>{DataTermino}</Text> (<Text style={styles.foco}>por {TotalDias} dias</Text>),
                    tendo ciência da modalidade <Text style={styles.foco}>{Modalidade}</Text>, ponto de encontro <Text style={styles.foco}>{pontoencontro}.</Text>
                    {'\n'}O valor total do aluguel ficou <Text style={styles.foco}> R$ {TotalValor}</Text>.
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.declineButton} onPress={() => { handleDelete(), setLoading2(true) }}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={handle} >
                    <Text style={styles.buttonText}>Aguardar</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.foco}>Requisição já foi enviada!</Text>
                        <Text style={styles.modalText}>
                            A solicitação foi enviada, em está em processo de análise pelo locador,
                            aguarde a resposta do locador.
                        </Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                router.replace('/(tabs)/activity');
                            }}>
                            <Text style={styles.textStyle}>Entendi!</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible2}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible2);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.foco}>Requisição Cancelada</Text>
                        <Text style={styles.modalText}>
                            A requisição foi cancelada, o processo locação será interrompido.
                        </Text>
                        <Pressable
                            style={styles.button}
                            onPress={() => {
                                setModalVisible(!modalVisible2);
                                router.replace('/(tabs)/activity');
                            }}>
                            <Text style={styles.textStyle}>Entendi</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>


        </View>

    );
}



