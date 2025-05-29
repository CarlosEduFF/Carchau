import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform, TouchableOpacity, Animated, Image, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '../../../../config/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import { useRoute } from '@react-navigation/native';
import styles from './StylesSchedule';

type MarkedDate = {
  selected: boolean;
  startingDay?: boolean;
  endingDay?: boolean;
  color: string;
  textColor: string;
};
type CustomMarkedDate = {
  selected?: boolean;
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
  disabled?: boolean; // Adicione esta propriedade
  disableTouchEvent?: boolean; // Para compatibilidade
};

export default function AluguelVeiculo() {




  const [valorTotal, setValorTotal] = useState(0);


  const [selectedModalidade, setSelectedModalidade] = useState('Não disponível');
  const [dataInicio, setDataInicio] = useState<string | null>(null);
  const [dataTermino, setDataTermino] = useState<string | null>(null);
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataTermino, setMostrarDataTermino] = useState(false);
  const [markedDates, setMarkedDates] = useState<Record<string, CustomMarkedDate>>({});


  const route = useRoute();
  const carroIdParam = useLocalSearchParams()?.carroId;
  const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;
  const LocadorIdParam = useLocalSearchParams()?.LocadorId;
  const LocadorId = Array.isArray(LocadorIdParam) ? LocadorIdParam[0] : LocadorIdParam;

  const [modalVisible, setModalVisible] = useState(false);
  const [modelo, setModelo] = useState('Não disponível');
  const [marca, setMarca] = useState('Não disponível');
  const [ano, setAno] = useState('Não disponível');
  const [placa, setPlaca] = useState('Não disponível');
  const [combustivel, setCombustivel] = useState('Não disponível');
  const [quantidadePortas, setQuantidadePortas] = useState('Não disponível');
  const [selectedAr, setSelectedAr] = useState('Não disponível');
  const [selectedCambio, setSelectedCambio] = useState('Não disponível');
  const [selectedStep, setSelectedStep] = useState('Não disponível');
  const [selectedAirbags, setSelectedAirbags] = useState('Não disponível');
  const [pontoencontro, setPontoEncontro] = useState('Não disponível');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Inicializando como true para mostrar carregamento

  const [laudImage, setLaudImage] = useState<string | null>(null);
  const [fotosCarro, setFotosCarro] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

  const [precoDia, setPrecoDia] = useState<number>(0);
  const [precoSemana, setPrecoSemana] = useState<number>(0);
  const [precoMes, setPrecoMes] = useState<number>(0);
  const [preco, setPreco] = useState('0');

  const [caucao, setCaucao] = useState<number>(0);

  const [LocadorID, setLocadorID] = useState("Não disponível");
  const [carroID, setCarroID] = useState("Não disponível");
  const [DatadeInicio, setDatadeInicio] = useState('');
  const [DatadeTermino, setDatadeTermino] = useState('');
  const [totaldias, setTotalDias] = useState("");
  const [resu, setResu] = useState("");

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState<boolean | null>(null);

  // Função para calcular o valor total
  const calcularValorTotal = () => {
    if (dataInicio && dataTermino && selectedModalidade) {
      const inicio = moment(dataInicio);
      const termino = moment(dataTermino);
      const dias = termino.diff(inicio, 'days') + 1; // Inclui o dia de início



      setTotalDias(dias.toString());
      let total = 0;
      switch (selectedModalidade) {
        case 'dia':
          total = dias * (precoDia || 0);
          break;
        case 'semana':
          total = (dias * (precoSemana || 0)) / 7; // Cálculo proporcional
          break;
        case 'mes':
          total = (dias * (precoMes || 0));
          break;
        default:
          break;
      }

      setValorTotal(total);
    }
  };

  // Atualiza o valor total quando a modalidade ou as datas mudarem
  useEffect(() => {
    calcularValorTotal();
  }, [selectedModalidade, dataInicio, dataTermino]);

  // Altera o preço da modalidade selecionada
  useEffect(() => {
    if (selectedModalidade === 'dia') {
      setPreco(precoDia.toString());
    } else if (selectedModalidade === 'semana') {
      setPreco(precoSemana.toString());
    } else if (selectedModalidade === 'mes') {
      setPreco(precoMes.toString());
    }
  }, [selectedModalidade]);


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

      } catch (error) {
        console.error("Erro ao buscar dados do carro: ", error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };
    fetchCarroData();
  }, [carroId]);

  // Calcule o valor total quando a modalidade ou as datas mudarem
  useEffect(() => {
    calcularValorTotal();
  }, [selectedModalidade, dataInicio, dataTermino]);

  useEffect(() => {
    if (selectedModalidade === 'dia') {
      setPreco(precoDia.toString());
    } else if (selectedModalidade === 'semana') {
      setPreco(precoSemana.toString());
    } else if (selectedModalidade === 'mes') {
      setPreco(precoMes.toString());
    }
  }, [selectedModalidade]);


  // Função para buscar datas ocupadas
  // Função para buscar datas ocupadas
  // Função para buscar datas ocupadas
  const fetchOccupiedDates = async () => {
    const occupiedDates: Record<string, CustomMarkedDate> = {}; // Use CustomMarkedDate aqui
    try {
      const usuariosSnapshot = await firebase.firestore().collection('Locatarios').get();

      const promises = usuariosSnapshot.docs.map(usuarioDoc =>
        usuarioDoc.ref.collection('solicitacoes')
          .where('estado', '==', 'Aceito')
          .where('carroId', '==', carroId)
          .get()
      );

      const resultados = await Promise.all(promises);

      resultados.forEach(solicitacoesSnapshot => {
        solicitacoesSnapshot.forEach(doc => {
          const data = doc.data();
          const inicio = moment(data.dataInicio, "DD-MM-YYYY").format('YYYY-MM-DD');
          const termino = moment(data.dataTermino, "DD-MM-YYYY").format('YYYY-MM-DD');

          if (!moment(inicio).isValid() || !moment(termino).isValid()) {
            console.error("Data inválida encontrada:", { inicio, termino });
            return;
          }

          let currentDate = moment(inicio);
          while (currentDate.isSameOrBefore(termino)) {
            const dateStr = currentDate.format('YYYY-MM-DD');
            // Atualiza o objeto occupiedDates para incluir todas as datas ocupadas
            occupiedDates[dateStr] = {
              selected: true,
              color: '#ff0000',
              textColor: '#fff',
              disableTouchEvent: true, // Impede interações
            };
            currentDate.add(1, 'days');
          }
        });
      });

      // Atualiza o estado com todas as datas ocupadas
      setMarkedDates(prevMarkedDates => ({
        ...prevMarkedDates,
        ...occupiedDates,
      }));
    } catch (error) {
      console.error("Erro ao buscar solicitações: ", error);
    }
  };




  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    const formattedDate = moment(currentDate).format('YYYY-MM-DD');

    // Verifica se a data está ocupada
    if (markedDates[formattedDate]?.disableTouchEvent) {
      setResu("Esta data já está ocupada.");
      setModalVisible(true);
      return;
    }

    setMostrarDataInicio(false);
    setMostrarDataTermino(false);

    if (mostrarDataInicio) {
      setDataInicio(formattedDate);
      setMarkedDates(prevMarkedDates => ({
        ...prevMarkedDates,
        [formattedDate]: { selected: true, color: '#f2a51a', textColor: '#fff' },
      }));
    } else if (mostrarDataTermino) {
      // Verifica se a data de término é anterior à data de início
      if (dataInicio && moment(formattedDate).isBefore(dataInicio)) {
        setResu("A data de término não pode ser anterior à data de início.");
        setModalVisible(true);
        return;
      }
      setDataTermino(formattedDate);
      marcarIntervalo(dataInicio, formattedDate);
    }
  };




  const marcarIntervalo = (inicio: string | null, termino: string) => {
    if (!inicio) return;

    if (moment(termino).isBefore(inicio)) {
      setResu("A data de término é anterior à data de início.");
      setModalVisible(true);
      setDataTermino(null);
      return;
    }

    const interval: Record<string, CustomMarkedDate> = {};
    let currentDate = moment(inicio);
    const lastDate = moment(termino);

    setDatadeInicio(moment(inicio).format('DD-MM-YYYY'));
    setDatadeTermino(moment(termino).format('DD-MM-YYYY'));

    // Copiar somente as datas ocupadas (evita limpar vermelho)
    const occupiedOnly: Record<string, CustomMarkedDate> = {};
    for (const [date, value] of Object.entries(markedDates)) {
      if (value.disableTouchEvent) {
        occupiedOnly[date] = value;
      }
    }

    while (currentDate.isSameOrBefore(lastDate)) {
      const dateStr = currentDate.format('YYYY-MM-DD');
      if (occupiedOnly[dateStr]) {
        setResu(`A data ${dateStr} está ocupada.`);
        setModalVisible(true);
        return;
      }

      interval[dateStr] = {
        startingDay: currentDate.isSame(inicio, 'day'),
        endingDay: currentDate.isSame(termino, 'day'),
        selected: true,
        color: '#f2a51a',
        textColor: '#fff'
      };
      currentDate.add(1, 'days');
    }

    // Atualiza somente com as ocupadas + novo intervalo
    setMarkedDates({
      ...occupiedOnly,
      ...interval
    });
  };



  useEffect(() => {
    fetchOccupiedDates(); // Chama a função para buscar datas ocupadas
  }, []);

  useEffect(() => {
    if (dataInicio && dataTermino) {
      marcarIntervalo(dataInicio, dataTermino);
    }
  }, [dataInicio, dataTermino]);


  function Requisitar(CarroID: string, LocadorID: string, SelectedModalidade: string, ValorTotal: string, DataInicio: string, DataTermino: string, TotalDias: string) {

    if (!DataInicio || !DataTermino || !valorTotal || !totaldias) {
      setLoading2(false)
      setModalVisible(true);
      return
    }


    console.log("Carro:", CarroID, "Locatário:", LocadorID, "Modalidade:", selectedModalidade, "Total:", valorTotal, 'Data Inicio:', DataInicio, 'Data Termino:', DataTermino, 'Total de dias:', TotalDias);
    router.push({
      pathname: '/screens/ActivityScreen/soliciConfirmScreen/solici-confirm', // Caminho da tela que mostra os detalhes do veículo
      params: { carroId: carroId, LocadorId: LocadorId, Modalidade: selectedModalidade, ValorTotal: valorTotal, DataInicio: DataInicio, DataTermino: DataTermino, TotalDias: totaldias },   // Passa o carroId como parâmetro
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
      <Calendar
        style={{ marginBottom: 10 }}
        markedDates={markedDates}
        markingType={'period'}
        theme={{
          calendarBackground: '#022036',
          textSectionTitleColor: 'white',
          selectedDayBackgroundColor: '#f2a51a',
          todayTextColor: '#f2a51a',
          dayTextColor: 'white',
          monthTextColor: 'white',
        }}
        disableAllTouchEventsForDisabledDays={true} // Propriedade para evitar interação em datas desativadas
      />

      <View style={styles.pickerContainer}>
        <Picker
          itemStyle={{ justifyContent: 'center' }}
          dropdownIconColor='#fff'
          selectedValue={selectedModalidade}
          onValueChange={(itemValue) => setSelectedModalidade(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione a modalidade" />
          {selectedPeriods.includes(0) && <Picker.Item label="Dia" value="dia" />}
          {selectedPeriods.includes(1) && <Picker.Item label="Semana" value="semana" />}
          {selectedPeriods.includes(2) && <Picker.Item label="Mês" value="mes" />}
        </Picker>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
        <View style={{ flexDirection: 'column', width: '48%' }}>
          <Text style={styles.textocampo}>Início:</Text>
          <Pressable onPress={() => setMostrarDataInicio(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{DatadeInicio || 'Selecionar data'}</Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'column', width: '48%' }}>
          <Text style={styles.textocampo}>Término:</Text>
          <Pressable onPress={() => setMostrarDataTermino(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>{DatadeTermino || 'Selecionar data'}</Text>
          </Pressable>
        </View>
      </View>

      {mostrarDataInicio && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            const currentDate = date || new Date();
            const formattedDate = moment(currentDate).format('YYYY-MM-DD');

            // Verifica se a data está ocupada
            if (markedDates[formattedDate]?.disableTouchEvent) {
              setResu("Esta data já está ocupada.");
              setModalVisible(true);
              return;
            }

            setDataInicio(formattedDate);
            setMostrarDataInicio(false);
            setMarkedDates(prevMarkedDates => ({
              ...prevMarkedDates,
              [formattedDate]: { selected: true, color: '#f2a51a', textColor: '#fff' },
            }));
          }}
        />
      )}

      {mostrarDataTermino && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            const currentDate = date || new Date();
            const formattedDate = moment(currentDate).format('YYYY-MM-DD');

            // Verifica se a data está ocupada
            if (markedDates[formattedDate]?.disableTouchEvent) {
              setResu("Esta data já está ocupada.");
              setModalVisible(true);
              return;
            }

            if (dataInicio && moment(formattedDate).isBefore(dataInicio)) {
              setResu("A data de término não pode ser anterior à data de início.");
              setModalVisible(true);
              return;
            }

            setDataTermino(formattedDate);
            setMostrarDataTermino(false);
            marcarIntervalo(dataInicio, formattedDate);
          }}
        />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={styles.valorTotal}>Valor da modalidade: </Text>
        <Text style={styles.valorTotal}> R$ {preco}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.valorTotal]}>Valor total: </Text>
        <Text style={styles.valorTotal}> R$ {valorTotal.toFixed(2)}</Text>
      </View>

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity style={styles.button} onPress={() => Requisitar(LocadorId, carroId, valorTotal.toString(), selectedModalidade, DatadeInicio, DatadeTermino, totaldias.toString())}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Alocar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.foco}>Faça a escolha da data e modalidade do aluguel corretamente!</Text>
            <Text style={styles.modalText}>{resu}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <Text style={styles.textStyle}>Entendi!</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}




