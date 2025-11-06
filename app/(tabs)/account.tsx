import { View, Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import React from 'react';
import styles from '../Styles/StylesAccount';
import { routes } from '~/constants/routes';
import CustomModal from '~/components/CustomModal/CustomModal';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import images from '~/constants/images';
import colors from '~/constants/colors';
import { Services } from '~/services/index';
import { validarCampos } from '~/utils/Validators/RequiredFieldsValidator';


export default function Account() {
  const [nome, setNome] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [sexoIndex, setIndex] = useState(0);
  const [cep, setCep] = useState('');
  const [cpf, setCPF] = useState('');
  const [profissao, setProfissao] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [frontCNH, setFrontCNH] = useState<string | null>(null);
  const [backCNH, setBackCNH] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cnhvalida, setCNHValida] = useState<'valido' | 'invalido' | 'pendente' | null>(null);

  const loadCnhData = async () => {
    const data = await Services.fetchCnhData();
    if (data) {
      setExistingImages({ front: data.fotoFront, back: data.fotoBack });
      if ( data.cnhvalida === 'valido') {
        setCNHValida('valido');
      } else if (data.cnhvalida === 'invalido') {
        setCNHValida('invalido');
      } else {
        setCNHValida(null); // pendente, inválido, etc.
      }
    }
    setLoading(false);
  };

  const loadUser = async () => {
    const userData = await Services.fetchUserData();
    if (userData) {
      setNome(userData.nome);
      setNacionalidade(userData.nacionalidade);
      setTelefone(userData.telefone);
      setEmail(userData.email);
      setCPF(userData.cpf);
      setProfissao(userData.profissao);
      setIndex(userData.sexo === 'Masculino' ? 0 : 1);
    }
    setLoading(false);
  };

  const loadEndereco = async () => {
    setLoading(true);
    const endereco = await Services.fetchAddress();

    if (endereco) {
      setCep(endereco.cep);
      setEndereco(endereco.endereco);
      setNumero(endereco.numero);
      setComplemento(endereco.complemento);
      setBairro(endereco.bairro);
      setCidade(endereco.cidade);
      setEstado(endereco.estado);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLoading2(true);
    loadEndereco();
    loadUser();
    loadCnhData();
    setLoading2(false);
  }, []);

  const { valido: dadosPessoaisValidos } = validarCampos(
    { nome, nacionalidade, telefone, email, profissao, cpf },
    ['nome', 'nacionalidade', 'telefone', 'email', 'profissao', 'cpf']
  );

  const { valido: enderecoValido } = validarCampos(
    { endereco, cep, numero, bairro, cidade, estado },
    ['endereco', 'cep', 'numero', 'bairro', 'cidade', 'estado']
  );

  const cnhIncompleta =
    !existingImages?.front ||
    !existingImages?.back ||
    cnhvalida !== 'valido';




  return (
    <View style={styles.container}>
      {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.viewProfile)}>
        <FontAwesome6 style={{ padding: 4 }} name="user-pen" size={20} color={colors.amareloClaro} />
        <Text style={styles.text}>Dados Pessoais</Text>
        {!dadosPessoaisValidos && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageRight}>
            <Image style={styles.imageRight} source={images.alertImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.viewAddress)}>
        <Entypo style={{ padding: 4 }} name="location" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Endereço</Text>
        {!enderecoValido && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageRight}>
            <Image style={styles.imageRight} source={images.alertImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.viewCnh)}>
        <FontAwesome style={{ padding: 4 }} name="id-card" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>CNH</Text>
        {cnhIncompleta && (
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.imageRight}>
            <Image style={styles.imageRight} source={images.alertImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>



      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.viewCard)}>
        <MaterialIcons style={{ padding: 4 }} name="add-card" size={28} color={colors.amareloClaro} />
        <Text style={styles.text}>Cartão de crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.viewLocation)}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="car-multiple" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Minhas locações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.report)}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="wrench-outline" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Relatar Problema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.termos)}>
        <MaterialIcons style={{ padding: 4 }} name="private-connectivity" size={26} color={colors.amareloClaro} />
        <Text style={styles.text}>Termos e Condições</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.replace(routes.config)}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="cogs" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Configurações</Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message='Antes de começar a usufruir do Aplicativo e de nossos serviços, regularize sua conta!'
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible(false);
        }}
      />
    </View>
  );
}

