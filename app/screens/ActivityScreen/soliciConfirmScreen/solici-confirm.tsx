import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../utils/firebase';
import { Button, Alert, Modal, Pressable, ScrollView, FlatList } from 'react-native';
import { useRoute } from '@react-navigation/native'; // Import correto
import PagerView from 'react-native-pager-view';
import { router, useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import styles from './StylesSoliciConfirm';

export default function AluguelScreen() {

  const [dia, setDia] = useState('');



  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

  const [situ, setSitu] = useState('');
  const [modelo, setModelo] = useState('Não disponível');
  const [marca, setMarca] = useState('Não disponível');
  const [ano, setAno] = useState('Não disponível');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true); // Inicializando como true para mostrar carregamento
  const [loading2, setLoading2] = useState(false);
  const [laudImage, setLaudImage] = useState<string | null>(null);
  const [fotosCarro, setFotosCarro] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [precoDia, setPrecoDia] = useState('Não disponível');
  const [precoSemana, setPrecoSemana] = useState('Não disponível');
  const [precoMes, setPrecoMes] = useState('Não disponível');
  const defaultVehicleImage = require('../../../../assets/icons/Car-Icon.png');

  const [caucao, setCaucao] = useState(0);

  const [locatarionome, setlocatarioNome] = useState<string | null>(null);
  const [locatarioperfilImage, setlocatarioPerfilImage] = useState<string | null>(null);

  const [locadornome, setlocadorNome] = useState<string | null>(null);
  const [locadorperfilImage, setlocadorPerfilImage] = useState<string | null>(null);

  const carroIdParam = useLocalSearchParams()?.carroId;
  const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
  const LocadorIdParam = useLocalSearchParams()?.LocadorId;
  const LocadorId = Array.isArray(LocadorIdParam) ? LocadorIdParam[0] : LocadorIdParam;
  const ModalidadeParam = useLocalSearchParams()?.Modalidade;
  const Modalidade = Array.isArray(ModalidadeParam) ? ModalidadeParam[0] : ModalidadeParam;
  const ValorTotalParam = useLocalSearchParams()?.ValorTotal;
  const ValorTotal = Array.isArray(ValorTotalParam) ? ValorTotalParam[0] : ValorTotalParam
  const DataInicioParam = useLocalSearchParams()?.DataInicio;
  const DataInicio = Array.isArray(DataInicioParam) ? DataInicioParam[0] : DataInicioParam;
  const DataTerminoParam = useLocalSearchParams()?.DataTermino;
  const DataTermino = Array.isArray(DataTerminoParam) ? DataTerminoParam[0] : DataTerminoParam;
  const TotalDiasParam = useLocalSearchParams()?.TotalDias;
  const TotalDias = Array.isArray(TotalDiasParam) ? TotalDiasParam[0] : TotalDiasParam;

  const valorT = ValorTotal;

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
  const [descrição, setDescrição] = useState("Solicitação de Aluguel");
  const [estado, setEstado] = useState("Em Processo");
  const [EstadoPGCaucao, setEstadoPGCaucao] = useState("Caução não pago");
  const [EstadoPGAluguel, setEstadoPGAluguel] = useState("Aluguel não pago");
  const [EstadoAvaliLT, setEstadoAvaliLT] = useState("Não avaliado");
  const [EstadoAvaliLD, setEstadoAvaliLD] = useState("Não avaliado");
  const [Total, setTotal] = useState(parseFloat(ValorTotal) || 0);

  useEffect(() => {
    if (!carroId) {
      console.log('carroId não está disponível ainda');
      return;
    }

    const fetchCarroData = async () => {
      try {
        const uid = await AsyncStorage.getItem('userId');
        if (LocadorId && carroId) {
          const carroDoc = await firebase.firestore()
            .collection('Locatarios')
            .doc(LocadorId)
            .collection('carros')
            .doc(carroId)
            .get();

          setLocadorID(LocadorId);
          setCarroID(carroId);

          if (carroDoc.exists) {
            const carroData = carroDoc.data();
            setModelo(carroData?.modelo || 'Não disponível');
            setMarca(carroData?.marca || 'Não disponível');
            setAno(carroData?.ano || 'Não disponível');
            if (carroData?.fotosCarro && Array.isArray(carroData.fotosCarro)) {
              setFotosCarro(carroData.fotosCarro);
            }
            setSelectedPeriods(carroData?.modalidadesAluguel || []);
            setPrecoDia(carroData?.precoDia || '');
            setPrecoSemana(carroData?.precoSemana || '');
            setPrecoMes(carroData?.precoMes || '');
            setCaucao(carroData?.caucao || '');
            setPontoEncontro(carroData?.pontoencontro || '');
          }
        }
        if (uid) {
          const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            if (userData) {
              setlocatarioNome(userData.nome || 'Usuário');
              setlocatarioPerfilImage(userData.fotoPerfil || null);
            }
          }
        }
        if (LocadorId) {
          const userDoc1 = await firebase.firestore().collection('Locatarios').doc(LocadorId).get();
          if (userDoc1.exists) {
            const userData1 = userDoc1.data();
            if (userData1) {
              setlocadorNome(userData1.nome || 'Usuário');
              setlocadorPerfilImage(userData1.fotoPerfil || null);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do carro: ", error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    fetchCarroData();
  }, [carroId]);

  useEffect(() => {
    const obterDiaAtualEmTexto = () => {
      const hoje = new Date();
      const dia = hoje.getDate();
      const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      const mes = meses[hoje.getMonth()]; // Pega o nome do mês
      return `${dia} de ${mes}`;
    };

    // Definindo o valor da data formatada na variável dia
    setDia(obterDiaAtualEmTexto());
  }, []); // O array vazio faz com que o efeito seja executado apenas uma vez, ao montar o componente



  function Voltar(CarroID: string, LocadorID: string, SelectedModalidade: string, ValorTotal: string, TotalDias: string) {
    console.log("Carro:", CarroID, "Locatário:", LocadorID, "Modalidade:", selectedModalidade, "Total:", valorTotal, 'Dias:', TotalDias);
    router.push({
      pathname: '/screens/ActivityScreen/scheduleScreen/schedule', // Caminho da tela que mostra os detalhes do veículo
      params: { carroId: carroId, LocadorId: LocadorId, Modalidade: selectedModalidade, ValorTotal: valorTotal, Dias: totaldias },   // Passa o carroId como parâmetro
    });
  }

  const handleSave = async () => {
    setIsUploading(true); // Mostrar indicador de carregamento
    try {
      const uid = await AsyncStorage.getItem('userId');
      if (!uid) {
        alert('Erro ao obter ID do usuário.');
        return;
      }

      const carrosRef = firebase.firestore()
        .collection('Locatarios')
        .doc(uid)
        .collection('solicitacoes');
      if (locatarioperfilImage) {
        const response = await fetch(locatarioperfilImage);
        const blob = await response.blob();

        // Define o caminho no Firebase Storage
        const storageRef = firebase.storage().ref().child(`imagemPerfil/${uid}`);

        // Faz o upload da imagem
        const snapshot = await storageRef.put(blob);

        // Obtém a URL de download da imagem
        const downloadURL = await snapshot.ref.getDownloadURL();
        await carrosRef.add({
          modelo: modelo,
          marca: marca,
          ano: ano,
          valorTotal: ValorTotal,
          totalDias: TotalDias,
          visto: visto,
          dataInicio: DataInicio,
          dataTermino: DataTermino,
          locadorId: LocadorId,
          locatarioId: uid,
          carroId: carroId,
          caucao: caucao,
          modalidadesAluguel: Modalidade,
          pontoencontro: pontoencontro,
          dia: dia,
          locatarionome: locatarionome,
          locatarioperfilImage: downloadURL,
          locadornome: locadornome,
          locadorperfilImage: locadorperfilImage,
          descricao: descrição,
          estado: estado,
          estadoPGCaucao: EstadoPGCaucao,
          estadoPGAluguel: EstadoPGAluguel,
          estadoavaliLT: EstadoAvaliLT,
          estadoavaliLD: EstadoAvaliLD,
          codVerf: 0
        });
      } else {
        await carrosRef.add({
          modelo: modelo,
          marca: marca,
          ano: ano,
          valorTotal: ValorTotal,
          totalDias: TotalDias,
          visto: visto,
          dataInicio: DataInicio,
          dataTermino: DataTermino,
          locadorId: LocadorId,
          locatarioId: uid,
          carroId: carroId,
          caucao: caucao,
          modalidadesAluguel: Modalidade,
          pontoencontro: pontoencontro,
          dia: dia,
          locatarionome: locatarionome,
          locadornome: locadornome,
          locadorperfilImage: locadorperfilImage,
          descricao: descrição,
          estado: estado,
          estadoPGCaucao: EstadoPGCaucao,
          estadoPGAluguel: EstadoPGAluguel,
          estadoavaliLT: EstadoAvaliLT,
          estadoavaliLD: EstadoAvaliLD,
          codVerf: 0
        });
      }
      setLoading2(false);
      setModalVisible(true);

    } catch (error) {
      console.error("Erro ao salvar solicitação de aluguel: ", error);
      alert('Erro ao salvar solicitação de aluguel.');
      setLoading2(false);
    } finally {
      setIsUploading(false);
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
        <View style={styles.Topo} ></View>
      <Text style={styles.header}>Solicitação de aluguel</Text>
      <Text style={styles.date}>{dia}</Text>
      <View style={styles.vehicleView} >
        <Image
          source={
            fotosCarro && Array.isArray(fotosCarro) && fotosCarro.length > 0 && typeof fotosCarro[0] === 'string'
              ? { uri: fotosCarro[0] } // Certificando que fotosCarro[0] é uma string
              : defaultVehicleImage // Usando uma imagem padrão caso contrário
          }
          style={styles.vehicleImage}

        />
      </View>

      <Text style={styles.description}>
        Você Locatário <Text style={styles.foco}> {locatarionome} </Text>confirma o interesse em alugar o veiculo
        <Text style={styles.foco}> {marca} {modelo} {ano} </Text>
        do dia <Text style={styles.foco}>{DataInicio}</Text> ao dia <Text style={styles.foco}>
          {DataTermino}</Text><Text> (por {TotalDias} dias), </Text>
        tendo ciência da modalidade <Text style={styles.foco}>{Modalidade}</Text> escolhida, optando pelo ponto de encontro <Text style={styles.foco}>{pontoencontro}</Text> ?
      </Text>
      <View style={styles.containerprice}>
        <View style={styles.section}>
          <Text style={styles.label}>Valor do total:</Text>
          <Text style={styles.price}>
            R$ {isNaN(Number(valorT)) ? '0.00' : Number(valorT).toFixed(2)}
          </Text>

        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Valor da caução:</Text>
          <Text style={styles.price}>R$ {caucao}</Text>
        </View>
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
            <Text style={[styles.foco, { fontWeight: 'bold', }]}>Solicitação realizada com sucesso!</Text>
            <Text style={styles.modalText}>
              Assim que o proprietário aprovar sua solicitação de aluguel você poderá seguir
              para a tela de pagamento e finalizar o aluguel!
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                setModalVisible(!modalVisible);
                router.replace('/(tabs)/home');
              }}>
              <Text style={styles.textStyle}>Entendi</Text>
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.declineButton} onPress={() => Voltar(LocadorID, carroID, valorTotal.toString(), selectedModalidade, TotalDias.toString())}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={() => { handleSave(), setLoading2(true) }}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
}


