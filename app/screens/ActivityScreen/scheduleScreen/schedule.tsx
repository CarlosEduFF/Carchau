import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { useLocalSearchParams } from 'expo-router';
import styles from './StylesSchedule';

import { CustomMarkedDate } from '~/types/MarkedDate';
import CustomModal from '~/components/CustomModal/CustomModal';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { Requisitar } from '~/services/navigationService';
import { fetchOccupiedDates, marcarIntervalo } from '~/services/calendarService';
import { Services } from '~/services';


export default function AluguelVeiculo() {

  const params = useLocalSearchParams();

  // Variáveis derivadas dos parâmetros
  const carroIdParam = params?.carroId;
  const carroId = Array.isArray(carroIdParam) ? carroIdParam[0] : carroIdParam;

  const locadorIdParam = params?.LocadorId;
  const locadorId = Array.isArray(locadorIdParam) ? locadorIdParam[0] : locadorIdParam;

  const selectedModalidadeParam = params?.modalidade || params?.selectedModalidade;
  const selectedModalidadeDefault = Array.isArray(selectedModalidadeParam) ? selectedModalidadeParam[0] : selectedModalidadeParam || 'Não disponível';

  const valorTotalParam = params?.valorTotal;
  const valorTotalDefault = Array.isArray(valorTotalParam)
    ? parseFloat(valorTotalParam[0])
    : parseFloat(valorTotalParam || '0');

  const dataInicioParam = params?.dataInicio;
  const dataInicioDefault = Array.isArray(dataInicioParam)
    ? dataInicioParam[0]
    : dataInicioParam || null;

  const dataTerminoParam = params?.dataTermino;
  const dataTerminoDefault = Array.isArray(dataTerminoParam)
    ? dataTerminoParam[0]
    : dataTerminoParam || null;

  const totalDiasParam = params?.totalDias;
  const totalDiasDefault = Array.isArray(totalDiasParam)
    ? totalDiasParam[0]
    : totalDiasParam || '';

  const [valorTotal, setValorTotal] = useState<number>(valorTotalDefault);
  const [selectedModalidade, setSelectedModalidade] = useState<string>(selectedModalidadeDefault);
  const [dataInicio, setDataInicio] = useState<string | null>(dataInicioDefault);
  const [dataTermino, setDataTermino] = useState<string | null>(dataTerminoDefault);
  const [mostrarDataInicio, setMostrarDataInicio] = useState(false);
  const [mostrarDataTermino, setMostrarDataTermino] = useState(false);
  const [markedDates, setMarkedDates] = useState<Record<string, CustomMarkedDate>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);

  const [precoDia, setPrecoDia] = useState<number>(0);
  const [precoSemana, setPrecoSemana] = useState<number>(0);
  const [precoMes, setPrecoMes] = useState<number>(0);
  const [preco, setPreco] = useState<string>('0');

  const [DatadeInicio, setDatadeInicio] = useState<string>('');
  const [DatadeTermino, setDatadeTermino] = useState<string>('');
  const [totaldias, setTotalDias] = useState<string>(totalDiasDefault);
  const [resu, setResu] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);


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

  const fetchCarroData = async () => {
    try {
      if (carroId) {
        const carro = await Services.fetchCarById(locadorId, carroId);

        if (carro) {

          setSelectedPeriods(carro.modalidadesAluguel);
          setPrecoDia(carro.precoDia);
          setPrecoSemana(carro.precoSemana);
          setPrecoMes(carro.precoMes);
        }
      }
    } catch (error) {
      console.error("Erro ao buscar dados do carro: ", error);
    } finally {
      setLoading(false);
    }
  };

  const carregarDatas = async () => {
    const datasOcupadas = await fetchOccupiedDates(carroId);
    setMarkedDates(prev => ({ ...prev, ...datasOcupadas }));
  };

  const handleMarcar = () => {
    if (!dataInicio || !dataTermino) {
      setResu("Selecione as duas datas.");
      setModalVisible(true);
      return;
    }

    const resultado = marcarIntervalo(
      dataInicio,
      dataTermino,
      {
        inicio: dataInicio,
        termino: dataTermino,
        markedDates,
      }
    );


    if (resultado.error) {
      setResu(resultado.error);
      setModalVisible(true);
      setDataTermino(null);
      return;
    }

    setDatadeInicio(resultado.inicioFormatado!);
    setDatadeTermino(resultado.terminoFormatado!);
    setMarkedDates(resultado.updatedMarkedDates!);
  };

  useEffect(() => {
    calcularValorTotal();
  }, [dataInicio, dataTermino, selectedModalidade, precoDia, precoSemana, precoMes]);


  useEffect(() => {
    fetchCarroData();
    calcularValorTotal();
    carregarDatas();


    if (dataInicio && dataTermino) {
      handleMarcar();
    }
    if (selectedModalidade === 'dia') {
      setPreco(precoDia.toString());
    } else if (selectedModalidade === 'semana') {
      setPreco(precoSemana.toString());
    } else if (selectedModalidade === 'mes') {
      setPreco(precoMes.toString());
    }
  }, [selectedModalidade]);



  return (
    <View style={styles.container}>
      {loading && <LoadingCarAnimation loading={loading} loading2={loading2} />}
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

            if (markedDates[formattedDate]?.disableTouchEvent) {
              setResu("Esta data já está ocupada.");
              setModalVisible(true);
              return;
            }

            setDataInicio(formattedDate);
            setMostrarDataInicio(false);
            setDatadeInicio(moment(currentDate).format('DD/MM/YYYY'));

            // Automação de data de término baseada na modalidade
            let autoTerminoFormatted = null;
            if (selectedModalidade === 'semana') {
              autoTerminoFormatted = moment(currentDate).add(7, 'days').format('YYYY-MM-DD');
            } else if (selectedModalidade === 'mes') {
              autoTerminoFormatted = moment(currentDate).add(30, 'days').format('YYYY-MM-DD');
            }

            if (autoTerminoFormatted) {
              setDataTermino(autoTerminoFormatted);
              setDatadeTermino(moment(autoTerminoFormatted).format('DD/MM/YYYY'));
              
              // Atualiza marcação no calendário para o novo intervalo
              const resultado = marcarIntervalo(
                formattedDate,
                autoTerminoFormatted,
                {
                  inicio: formattedDate,
                  termino: autoTerminoFormatted,
                  markedDates,
                }
              );
              if (resultado?.updatedMarkedDates) {
                setMarkedDates(resultado.updatedMarkedDates);
              }
            } else {
              // Apenas marca o início se for diária ou modalidade não definida
              setMarkedDates(prevMarkedDates => ({
                ...prevMarkedDates,
                [formattedDate]: { selected: true, color: '#f2a51a', textColor: '#fff' },
              }));
            }
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

            const resultado = marcarIntervalo(
              dataInicio,
              formattedDate,
              {
                inicio: dataInicio,
                termino: formattedDate,
                markedDates,
              }
            );

            if (resultado?.error) {
              setResu(resultado.error);
              setModalVisible(true);
              return;
            }

            if (resultado?.updatedMarkedDates) {
              setMarkedDates(resultado.updatedMarkedDates);
            }
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
        <TouchableOpacity style={styles.button} onPress={() => {
          if (!dataInicio || !dataTermino || !valorTotal || !totaldias) {
            setLoading2(false)
            setModalVisible(true);
            return
          } else {
            Requisitar(
              carroId,
              locadorId,
              selectedModalidade,
              valorTotal.toString(),
              dataInicio,
              dataTermino,
              totaldias.toString()
            );
          }

        }}>
          <Text style={{ fontWeight: 'bold', color: '#fff', fontSize: 18 }}>Alocar</Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={`Faça a escolha da data e modalidade do aluguel corretamente! \n ` + resu}
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible(!modalVisible);
        }}
      />

    </View>
  );
}




