import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import moment from 'moment';
import styles from './StylesLesseeRequi';
import images from '~/constants/images';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal/CustomModal';
import { fetchUserData } from '~/services/UserService/GetUserService';
import { deleteSolicitacao } from '~/services/requestService';
import { Services } from '~/services';

export default function AluguelScreen() {

    const [modalVisible, setModalVisible] = useState(false);
    const [modelo, setModelo] = useState('Não disponível');
    const [marca, setMarca] = useState('Não disponível');
    const [ano, setAno] = useState('Não disponível');
    const [loading, setloading] = useState(true); // Inicializando como true para mostrar carregamento

    const [caucao, setCaucao] = useState<number | null>(null);

    const [nome, setNome] = useState<string | null>(null);
    const [NomeLocador, setNomeLocador] = useState<string | null>(null);
    const [perfilImage, setPerfilImage] = useState<string | null>(null);
    const [fotosCarro, setFotosCarro] = useState<string[]>([]);
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [precoDia, setPrecoDia] = useState<number | null>(null);
    const [precoSemana, setPrecoSemana] = useState<number | null>(null);
    const [precoMes, setPrecoMes] = useState<number | null>(null);

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
    const [loading2, setLoading2] = useState(false);
    const [pontoencontro, setPontoEncontro] = useState('Não disponível');

    const [modalVisible2, setModalVisible2] = useState(false);

    const fetchCarroData = async (uid: string) => {
        try {
            if (carroId) {
                const carro = await Services.fetchCarById(locadorId, carroId);

                if (carro) {
                    setModelo(carro.modelo);
                    setMarca(carro.marca);
                    setAno(String(carro.ano));

                    setPontoEncontro(carro.pontoencontro);
                    setSelectedPeriods(carro.modalidadesAluguel);
                    setPrecoDia(carro.precoDia);
                    setPrecoSemana(carro.precoSemana);
                    setPrecoMes(carro.precoMes);
                    setCaucao(carro.caucao);
                    if (carro.fotosCarro) setFotosCarro(carro.fotosCarro);
                }
            }
        } catch (error) {
            console.error("Erro ao buscar dados do carro: ", error);
        } finally {
            setloading(false);
        }
    };

    const loadUserLocatario = async () => {
        const userData = await fetchUserData(LocatarioId);
        if (userData) {
            setNome(userData.nome);
            setPerfilImage(userData.fotoPerfil);
        }
        setloading(false);
    };

    const loadUserLocador = async () => {
        const userData = await fetchUserData(locadorId);
        if (userData) {
            setNomeLocador(userData.nome);
        }
        setloading(false);
    };
    
    useEffect(() => {
        loadUserLocador();
        loadUserLocatario();
        fetchCarroData(locadorId);
    });

    const formattedDia = moment(Dia).isValid() ? moment(Dia).format('DD/MM/YYYY') : Dia;
    const formattedInicio = moment(DataInicio).isValid() ? moment(DataInicio).format('DD/MM/YYYY') : DataInicio;
    const formattedTermino = moment(DataTermino).isValid() ? moment(DataTermino).format('DD/MM/YYYY') : DataTermino;

    const handleDelete = async () => {
        await deleteSolicitacao({
            soliciId,
            setModalVisible: setModalVisible,
            setModalVisible2: setModalVisible2,
            setLoading: setLoading2,
        });
    };

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View style={styles.Topo}></View>
            <Text style={styles.header}>Requisição de aluguel</Text>
            <Text style={styles.date}>{formattedDia}</Text>
            <View style={styles.userSection}>
                {/* Coluna para a imagem do perfil e o botão "Ver Perfil" */}
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <Image style={styles.avatar} source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage} />
                </View>
                <FontAwesome5 name="arrow-right" size={33} color="#d9d7d7" />
                <View style={{ alignItems: 'center', margin: 10 }}>
                    <Image
                        source={
                            fotosCarro && Array.isArray(fotosCarro) && fotosCarro.length > 0 && typeof fotosCarro[0] === 'string'
                                ? { uri: fotosCarro[0] }
                                : images.defaultVehicleImage
                        }
                        style={styles.avatar}
                    />
                </View>
            </View>
            <View style={styles.Conftext}>
                <Text style={styles.description}>
                    Você locatário <Text style={styles.foco}>{nome}</Text> confirma o interesse em alugar o veiculo
                    <Text style={styles.foco}> {marca} {modelo} {ano} </Text> do locador <Text style={styles.foco}>{NomeLocador}</Text>
                    do dia <Text style={styles.foco}>{formattedInicio}</Text> ao dia <Text style={styles.foco}>{formattedTermino}</Text> (<Text style={styles.foco}>por {TotalDias} dias</Text>),
                    tendo ciência da modalidade <Text style={styles.foco}>{Modalidade}</Text>, ponto de encontro <Text style={styles.foco}>{pontoencontro}.</Text>
                    {'\n'}O valor total do aluguel ficou <Text style={styles.foco}> R$ {TotalValor}</Text>.
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.declineButton} onPress={() => { handleDelete(), setLoading2(true) }}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton} onPress={() => setModalVisible(true)} >
                    <Text style={styles.buttonText}>Aguardar</Text>
                </TouchableOpacity>
            </View>

            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                message="A solicitação foi enviada, em está em processo de análise pelo locador,
                            aguarde a resposta do locador."
                confirmText="Entendi"
                onConfirm={() => { setModalVisible(false), router.replace('/(tabs)/activity'); }}
            />

            <CustomModal
                visible={modalVisible2}
                onClose={() => setModalVisible2(false)}
                message="A requisição foi cancelada, o processo locação será interrompido."
                confirmText="Entendi"
                onConfirm={() => { setModalVisible2(false), router.replace('/(tabs)/activity'); }}
            />

        </View>
    );
}



