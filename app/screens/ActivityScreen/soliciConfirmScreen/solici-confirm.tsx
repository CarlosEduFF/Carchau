import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import styles from './StylesSoliciConfirm';
import images from '~/constants/images';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';

import { fetchUserData } from '~/services/UserService/GetUserService';
import { BackSchedule } from '~/services/navigationService';
import CustomModal from '~/components/CustomModal/CustomModal';
import { routes } from '~/constants/routes';
import { salvarSolicitacaoAluguel } from '~/services/requestService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Services } from '~/services';
import { useLoading } from '~/context/LoadingContext';
import { Components } from '~/components';


export default function AluguelScreen() {
  const [dia, setDia] = useState<string>('Não disponível');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState<string>('');
  const { setLoading } = useLoading();
  const [laudImage, setLaudImage] = useState<string | null>(null);
  const [fotosCarro, setFotosCarro] = useState<string[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
  const [precoDia, setPrecoDia] = useState<number>(0);
  const [precoSemana, setPrecoSemana] = useState<number>(0);
  const [precoMes, setPrecoMes] = useState<number>(0);
  const [caucao, setCaucao] = useState<number>(0);
  const [locatarionome, setLocatarioNome] = useState<string | undefined>();
  const [locatarioperfilImage, setLocatarioPerfilImage] = useState<string | undefined>();
  const [locadornome, setLocadorNome] = useState<string | undefined>();
  const [locadorperfilImage, setLocadorPerfilImage] = useState<string | undefined>();
  const params = useLocalSearchParams();
  const carroId = Array.isArray(params?.carroId) ? params.carroId[0] : params?.carroId;
  const locadorId = Array.isArray(params?.locadorId) ? params.locadorId[0] : params?.locadorId;
  const modalidade = Array.isArray(params?.modalidade) ? params.modalidade[0] : params?.modalidade;
  const valorTotal = Number(Array.isArray(params?.valorTotal) ? params.valorTotal[0] : params?.valorTotal);
  const dataInicio = Array.isArray(params?.dataInicio) ? params.dataInicio[0] : params?.dataInicio;
  const dataTermino = Array.isArray(params?.dataTermino) ? params.dataTermino[0] : params?.dataTermino;
  const totalDias = Number(Array.isArray(params?.totalDias) ? params.totalDias[0] : params?.totalDias);
  const [selectedModalidade, setSelectedModalidade] = useState<string>('economico');
  const [mostrarDataInicio, setMostrarDataInicio] = useState<boolean>(false);
  const [mostrarDataTermino, setMostrarDataTermino] = useState<boolean>(false);
  const [pontoencontro, setPontoEncontro] = useState<string>('Não disponível');
  const [visto, setVisto] = useState<boolean | undefined>();
  const [descrição, setDescricao] = useState<string>("Solicitação de Aluguel");
  const [estado, setEstado] = useState<string>("Em Processo");
  const [EstadoPGCaucao, setEstadoPGCaucao] = useState<string>("Caução não pago");
  const [EstadoPGAluguel, setEstadoPGAluguel] = useState<string>("Aluguel não pago");
  const [EstadoAvaliLT, setEstadoAvaliLT] = useState<string>("Não avaliado");
  const [EstadoAvaliLD, setEstadoAvaliLD] = useState<string>("Não avaliado");
  const [userId, setUserId] = useState<string | null>(null);
  const fetchCarroData = async () => {
    try {
      if (carroId) {
        const carro = await Services.fetchCarById(locadorId, carroId);

        if (carro) {
          setModelo(carro.modelo);
          setMarca(carro.marca);
          setAno(carro.ano);
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
    }
  };

  const loadLocadorUser = async () => {
    const userDataLo = await fetchUserData(locadorId);
    if (userDataLo) {
      setLocadorNome(userDataLo.nome || 'Usuário');
      setLocadorPerfilImage(userDataLo.fotoPerfil || undefined);
    }
  };
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          await Promise.all([
            loadUser(id),
            loadLocadorUser(),
            fetchCarroData(),
          ]);
        } else {
          console.warn('Nenhum userId encontrado no AsyncStorage');
        }
      } catch (error) {
        console.error('Erro ao inicializar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    init();
    setDia(obterDiaAtualEmTexto());
  }, []);
  const loadUser = async (uId: string | null) => {
    if (!uId) return;
    const userData = await fetchUserData(uId);
    if (userData) {
      setLocatarioNome(userData.nome || 'Usuário');
      setLocatarioPerfilImage(userData.fotoPerfil || undefined);
    }
  };

  const obterDiaAtualEmTexto = () => {
    const hoje = new Date();
    const dia = hoje.getDate();
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const mes = meses[hoje.getMonth()];
    return `${dia} de ${mes}`;
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const resultado = await salvarSolicitacaoAluguel({
        valorTotal,
        totalDias,
        visto: visto ?? false,
        dataInicio: dataInicio ?? "",
        dataTermino: dataTermino ?? "",
        locadorId: locadorId ?? "",
        carroId: carroId ?? "",
        caucao,
        modalidadesAluguel: modalidade ?? "econômico",
        pontoencontro,
        dia: dia ?? "",
        descricao: descrição ?? "Solicitação de Aluguel",
        estado,
        estadoPGCaucao: EstadoPGCaucao,
        estadoPGAluguel: EstadoPGAluguel,
        estadoavaliLT: EstadoAvaliLT,
        estadoavaliLD: EstadoAvaliLD,
        confirRecepLocata: "",
        confirEntregaLocador: "",
        confirRecepLocador: "",
        confirDevoLocata: "",
        locadornome,
        locadorperfilImage: locadorperfilImage,
        locatarionome,
        locatarioperfilImage: locatarioperfilImage,
      });


      if (resultado.success) {
        setModalVisible(true);
      } else {
        setSitu(resultado.error ?? "");
        setModalVisible2(true);
      }
    } catch (error) {
      console.error("Erro ao salvar solicitação: ", error);
    } finally {
      setLoading(false);
    }
  };


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
              : images.defaultVehicleImage // Usando uma imagem padrão caso contrário
          }
          style={styles.vehicleImage}
        />
      </View>

      <Text style={styles.description}>
        Você Locatário <Text style={styles.foco}> {locatarionome} </Text>confirma o interesse em alugar o veiculo
        <Text style={styles.foco}> {marca} {modelo} {ano} </Text>
        do dia <Text style={styles.foco}>{dataInicio}</Text> ao dia <Text style={styles.foco}>
          {dataTermino}</Text><Text> (por {totalDias} dias), </Text>
        tendo ciência da modalidade <Text style={styles.foco}>{modalidade}</Text> escolhida, optando pelo ponto de encontro <Text style={styles.foco}>{pontoencontro}</Text> ?
      </Text>

      <View style={styles.containerprice}>
        <View style={styles.section}>
          <Text style={styles.label}>Valor do total:</Text>
          <Text style={styles.price}>
            R$ {isNaN(Number(valorTotal)) ? '0.00' : Number(valorTotal).toFixed(2)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Valor da caução:</Text>
          <Text style={styles.price}>R$ {caucao}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.declineButton} onPress={() =>
          BackSchedule(
            carroId,
            locadorId,
            selectedModalidade,
            valorTotal.toString(),
            dataInicio ?? '',
            dataTermino ?? '',
            totalDias.toString()
          )
        }>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.acceptButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={'Assim que o proprietário aprovar sua solicitação de aluguel você poderá seguir para a tela de pagamento e finalizar o aluguel!'}
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible(!modalVisible);
          router.replace(routes.home);
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
    </View>
  );
}