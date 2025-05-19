
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../utils/firebase';
import { Button, Alert, Modal, Pressable, ScrollView, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native';
import PagerView from 'react-native-pager-view';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import styles from './StylesLessorRequi';

export default function AluguelScreen() {


  const defaultProfileImage = require('../../../../assets/icons/Profile-Icon.png');


  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modelo, setModelo] = useState('Não disponível');
  const [marca, setMarca] = useState('Não disponível');
  const [ano, setAno] = useState('Não disponível');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setloading] = useState(true); // Inicializando como true para mostrar carregamento
  const [loading2, setLoading2] = useState(false);

  const defaultVehicleImage = require('../../../../assets/icons/Car-Icon.png');


  const [caucao, setCaucao] = useState(0);

  const [nome, setNome] = useState<string | null>(null);
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
  const EstadoParam = useLocalSearchParams()?.Estado;
  const Estado = Array.isArray(EstadoParam) ? EstadoParam[0] : EstadoParam;
  const DescricaoParam = useLocalSearchParams()?.Descricao;
  const Descricao = Array.isArray(DescricaoParam) ? DescricaoParam[0] : DescricaoParam;



  const [Total, setTotal] = useState(parseFloat(TotalValor) || 0);


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


  const handleUpdate = async () => {
    setIsUploading(true); // Mostrar indicador de carregamento
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (!uid) {
        alert('Erro ao obter ID do usuário.');
        return;
      }
      console.log(soliciId);
      const carroRef = firebase.firestore()
        .collection('Locatarios')
        .doc(locatarioId)
        .collection('solicitacoes')
        .doc(soliciId);

      await carroRef.update({
        visto: true,
        estado: 'Aceito'

      });


      // Atualiza o campo 'visto' para true


      console.log('Estado de visto atualizado para true');
      setModalVisible(true);

    } catch (error) {
      console.error("Erro ao atualizar o estado de visto: ", error);
      alert('Erro ao atualizar o estado de visto.');
    } finally {
      setIsUploading(false);
    }
  };

  const Perfil = async () => {
    console.log(locadorId);
    router.push({
      pathname: '/screens/ActivityScreen/viewProfile/profile',
      params: {
        locatarioId: locatarioId,
      },
    });

  };

  const handleUpdateRe = async () => {
    setIsUploading(true); // Mostrar indicador de carregamento
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (!uid) {
        alert('Erro ao obter ID do usuário.');
        return;
      }
      console.log(soliciId);
      const carroRef = firebase.firestore()
        .collection('Locatarios')
        .doc(locatarioId)
        .collection('solicitacoes')
        .doc(soliciId);

      await carroRef.update({
        visto: true,
        estado: 'Recusado'

      });


      // Atualiza o campo 'visto' para true


      console.log('Estado de visto atualizado para true');
      setModalVisible2(true);

    } catch (error) {
      console.error("Erro ao atualizar o estado de visto: ", error);
      alert('Erro ao atualizar o estado de visto.');
    } finally {
      setIsUploading(false);
    }
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
            setCaucao(parseFloat(carroData?.caucao) || 0);
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
        if (locatarioId) {
          const userDoc = await firebase.firestore().collection('Locatarios').doc(locatarioId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData) {
              setNome(userData.nome || 'Usuário');
              setPerfilImage(userData.fotoPerfil || null);

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


  function Voltar(CarroID: string, LocadorID: string, SelectedModalidade: string, ValorTotal: string, TotalDias: string) {
    console.log("Carro:", CarroID, "Locatário:", LocadorID, "Modalidade:", selectedModalidade, "Total:", valorTotal, 'Dias:', TotalDias);
    router.push({
      pathname: '../aluguel/escolherdata', // Caminho da tela que mostra os detalhes do veículo
      params: { carroId: carroId, locadorId: locadorId, Modalidade: selectedModalidade, ValorTotal: valorTotal, Dias: totaldias },   // Passa o carroId como parâmetro
    });
  }
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
          <TouchableOpacity style={styles.viewProfileButton} onPress={() => Perfil()}>
            <Text style={styles.textStyle}>Ver Perfil</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={{
            borderRadius: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            alignItems: 'center',
            width: 90,
            marginTop: 10
          }}>
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
            <Text style={styles.foco}>Requisição realizada com sucesso</Text>
            <Text style={styles.modalText}>
              Assim que o locatário realizar o pagamento do aluguel e do caução,
              será possivel realizar a troca de posse do veiculo, basta entrar em confirmar posse.
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                setModalVisible(!modalVisible);
                router.replace('/(tabs)/activity');
              }}>
              <Text style={styles.textStyle}>Entendi</Text>
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
            <Text style={styles.foco}>Requisição recusada</Text>
            <Text style={styles.modalText}>
              A requisição foi recusada, o processo locação será interrompido.
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

