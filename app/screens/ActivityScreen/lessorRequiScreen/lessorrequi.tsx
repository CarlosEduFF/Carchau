
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from './StylesLessorRequi';
import CustomModal from '~/components/CustomModal';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { Perfil } from '~/services/navigationService';
import images from '~/constants/images';
import { fetchCarroById } from '~/services/carService';
import { fetchUserData } from '~/services/userService';
import { updateEstadoSolicitacao } from '~/services/requestService';

export default function AluguelScreen() {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modelo, setModelo] = useState('Não disponível');
  const [marca, setMarca] = useState('Não disponível');
  const [ano, setAno] = useState('Não disponível');
  const [loading, setloading] = useState(true); // Inicializando como true para mostrar carregamento
  const [loading2, setLoading2] = useState(false);
  const [caucao, setCaucao] = useState(0);
  const [nome, setNome] = useState<string | null>(null);
  const [perfilImage, setPerfilImage] = useState<string | null>(null);
  const [laudImage, setLaudImage] = useState<string | null>(null);
  const [fotosCarro, setFotosCarro] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [precoDia, setPrecoDia] = useState<number | null>(null);
  const [precoSemana, setPrecoSemana] = useState<number | null>(null);
  const [precoMes, setPrecoMes] = useState<number | null>(null);
  const soliciIdParam = useLocalSearchParams()?.soliciId;
  const soliciId = Array.isArray(soliciIdParam) ? soliciIdParam[0] : soliciIdParam;
  const locadorIdParam = useLocalSearchParams()?.locadorId;
  const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;
  const locatarioIdParam = useLocalSearchParams()?.locatarioId;
  const locatarioId = Array.isArray(locatarioIdParam) ? locatarioIdParam[0] : locatarioIdParam;
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

  const [Total, setTotal] = useState(parseFloat(TotalValor) || 0);
  const [pontoencontro, setPontoEncontro] = useState('Não disponível');


  const handleUpdate = async () => {
    await updateEstadoSolicitacao({
      locatarioId,
      soliciId,
      novoEstado: 'Aceito',
      setModalVisible,
    });
  };

  const handleUpdateRe = async () => {
    await updateEstadoSolicitacao({
      locatarioId,
      soliciId,
      novoEstado: 'Recusado',
      setModalVisible: setModalVisible2,
    });
  };

  const fetchCarroData = async (uid: string) => {
    try {
      if (carroId) {
        const carro = await fetchCarroById(locadorId, carroId);

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
    const userData = await fetchUserData(locatarioId);
    if (userData) {
      setNome(userData.nome);
      setPerfilImage(userData.fotoPerfil);
    }
    setloading(false);
  };

  useEffect(() => {
    fetchCarroData(locadorId);
    loadUserLocatario();
  });

  return (
    <View style={styles.container}>
      {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
      <View style={styles.Topo}></View>
      <Text style={styles.header}>Requisição de aluguel</Text>
      <Text style={styles.date}>{Dia}</Text>
      <View style={styles.userSection}>
        {/* Coluna para a imagem do perfil e o botão "Ver Perfil" */}
        <View style={{ alignItems: 'center', margin: 10 }}>
          <Image style={styles.avatar} source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage} />
          <TouchableOpacity style={styles.viewProfileButton} onPress={() => Perfil(locatarioId)}>
            <Text style={styles.textStyle}>Ver Perfil</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.bottonEmpty}>
            <Text style={styles.textStyle}>{/*Botão para Ocupar o espaço vazio*/}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.description}>
        Locatário <Text style={styles.foco}>{nome}</Text> possui o interesse em alugar o seu veiculo
        <Text style={styles.foco}> {marca} {modelo} {ano} </Text>
        do dia <Text style={styles.foco}>{DataInicio}</Text> ao dia <Text style={styles.foco}>{DataTermino}</Text> (<Text style={styles.foco}>por {TotalDias} dias</Text>),
        optando pela modalidade <Text style={styles.foco}>{Modalidade}</Text>, no ponto de encontro <Text style={styles.foco}>{pontoencontro}</Text>. O valor total do aluguel
        ficou <Text style={styles.foco}> R$ {Total.toFixed(2)}</Text>. Deseja alugar o seu carro?
      </Text>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message="Assim que o locatário realizar o pagamento do aluguel e do caução,
              será possivel realizar a troca de posse do veiculo, basta entrar em confirmar posse."
        confirmText="Entendi"
        onConfirm={() => { setModalVisible(false), router.replace('/(tabs)/activity'); }}
      />

      <CustomModal
        visible={modalVisible2}
        onClose={() => setModalVisible2(false)}
        message="A requisição foi recusada, o processo locação será interrompido."
        confirmText="Entendi"
        onConfirm={() => { setModalVisible2(false), router.replace('/(tabs)/activity'); }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.declineButton} onPress={handleUpdateRe}>
          <Text style={styles.buttonText}>Recusar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleUpdate} >
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}

