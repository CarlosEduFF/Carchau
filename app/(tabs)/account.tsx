import React, { useEffect, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
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
  const [loading, setLoading] = useState(true);   // controla primeiro carregamento
  const [loading2, setLoading2] = useState(false); // controle adicional (se usar)
  const [modalVisible, setModalVisible] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [cnhvalida, setCNHValida] = useState<'valido' | 'invalido' | 'pendente' | null>(null);

  // --- Funções de carregamento (não altere os nomes se Services dependem disso) ---
  const loadCnhData = async () => {
    try {
      const data = await Services.fetchCnhData();
      if (data) {
        setExistingImages({ front: data.fotoFront ?? null, back: data.fotoBack ?? null });
        if (data.cnhvalida === 'valido') setCNHValida('valido');
        else if (data.cnhvalida === 'invalido') setCNHValida('invalido');
        else setCNHValida(data.cnhvalida ?? null); // pendente ou null
      }
    } catch (err) {
      // opcional: console.warn('Erro loadCnhData', err);
    }
  };

  const loadUser = async () => {
    try {
      const userData = await Services.fetchUserData();
      if (userData) {
        setNome(userData.nome ?? '');
        setNacionalidade(userData.nacionalidade ?? '');
        setTelefone(userData.telefone ?? '');
        setEmail(userData.email ?? '');
        setCPF(userData.cpf ?? '');
        setProfissao(userData.profissao ?? '');
        setIndex(userData.sexo === 'Masculino' ? 0 : 1);
      }
    } catch (err) {
      // opcional: console.warn('Erro loadUser', err);
    }
  };

  const loadEndereco = async () => {
    try {
      const enderecoData = await Services.fetchAddress();
      if (enderecoData) {
        setCep(enderecoData.cep ?? '');
        setEndereco(enderecoData.endereco ?? '');
        setNumero(enderecoData.numero ?? '');
        setComplemento(enderecoData.complemento ?? '');
        setBairro(enderecoData.bairro ?? '');
        setCidade(enderecoData.cidade ?? '');
        setEstado(enderecoData.estado ?? '');
      }
    } catch (err) {
      // opcional: console.warn('Erro loadEndereco', err);
    }
  };

  // --- useEffect que aguarda todos os loads ---
  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      try {
        setLoading(true);
        setLoading2(true);
        await Promise.all([loadEndereco(), loadUser(), loadCnhData()]);
      } finally {
        if (mounted) {
          setLoading(false);
          setLoading2(false);
        }
      }
    };

    loadAll();

    loadAll();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await Services.StorageService.removeUserId();
      router.replace('/');
    } catch (err) {
      console.error('Erro ao deslogar:', err);
    }
  };

  const showValidationAlert = () => {
    const fieldLabels: Record<string, string> = {
      nome: 'Nome Completo',
      nacionalidade: 'Nacionalidade',
      telefone: 'Telefone',
      email: 'E-mail',
      profissao: 'Profissão',
      cpf: 'CPF',
      endereco: 'Endereço',
      cep: 'CEP',
      numero: 'Número',
      bairro: 'Bairro',
      cidade: 'Cidade',
      estado: 'Estado',
    };

    const resPessoais = validarCampos(camposPessoaisDados, ['nome', 'nacionalidade', 'telefone', 'email', 'profissao', 'cpf']);
    const resEndereco = validarCampos(enderecoDados, ['endereco', 'cep', 'numero', 'bairro', 'cidade', 'estado']);
    const resCnh = validarCampos(cnhDadosParaValidar, []);

    let missing: string[] = [];
    if (!resPessoais.valido) {
      missing.push(...resPessoais.camposVazios.map(f => fieldLabels[f] || f));
    }
    if (!resEndereco.valido) {
      missing.push(...resEndereco.camposVazios.map(f => fieldLabels[f] || f));
    }
    if (!resCnh.valido && resCnh.errosEspecificos) {
      missing.push(...resCnh.errosEspecificos);
    }

    if (missing.length > 0) {
      setValidationMessage('Para regularizar sua conta, preencha os seguintes campos:\n\n• ' + missing.join('\n• '));
    } else {
      setValidationMessage('Todos os seus dados obrigatórios estão preenchidos corretamente!');
    }
    setModalVisible(true);
  };

  // --- Chamada do validador: passamos explicitamente os nomes que o validator espera ---
  const camposPessoaisDados = {
    nome,
    nacionalidade,
    telefone,
    email,
    profissao,
    cpf,
  };

  const enderecoDados = {
    endereco,
    cep,
    numero,
    bairro,
    cidade,
    estado,
  };

  // Passa frontImage/backImage com fallback para estados que vc tem (existingImages | frontCNH/backCNH)
  const cnhDadosParaValidar = {
    frontImage: existingImages.front ?? frontCNH,
    backImage: existingImages.back ?? backCNH,
    cnhvalida,
  };

  const { valido: dadosPessoaisValidos } = validarCampos(camposPessoaisDados, [
    'nome',
    'nacionalidade',
    'telefone',
    'email',
    'profissao',
    'cpf',
  ]);

  const { valido: enderecoValido } = validarCampos(enderecoDados, [
    'endereco',
    'cep',
    'numero',
    'bairro',
    'cidade',
    'estado',
  ]);

  // Validamos CNH usando o objeto específico (sem campos obrigatórios textuais)
  const { valido: cnhValidaCampos } = validarCampos(cnhDadosParaValidar, []);

  // cnhIncompleta usado para exibir alerta de CNH; só mostramos depois de terminar o loading
  const cnhIncompleta = !cnhValidaCampos;

  return (
    <View style={styles.container}>
      {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.viewProfile)}>
        <FontAwesome6 style={{ padding: 4 }} name="user-pen" size={20} color={colors.amareloClaro} />
        <Text style={styles.text}>Dados Pessoais</Text>
        {/* Só mostrar alerta depois de carregar */}
        {!loading && !dadosPessoaisValidos && (
          <TouchableOpacity onPress={showValidationAlert} style={styles.imageRight}>
            <Image style={styles.imageRight} source={images.alertImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.viewAddress)}>
        <Entypo style={{ padding: 4 }} name="location" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Endereço</Text>
        {!loading && !enderecoValido && (
          <TouchableOpacity onPress={showValidationAlert} style={styles.imageRight}>
            <Image style={styles.imageRight} source={images.alertImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.viewCnh)}>
        <FontAwesome style={{ padding: 4 }} name="id-card" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>CNH</Text>
        {!loading && cnhIncompleta && (
          <TouchableOpacity onPress={showValidationAlert} style={styles.imageRight}>
            <Image style={styles.imageRight} source={images.alertImage} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.viewCard)}>
        <MaterialIcons style={{ padding: 4 }} name="add-card" size={28} color={colors.amareloClaro} />
        <Text style={styles.text}>Cartão de crédito</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.viewLocation)}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="car-multiple" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Minhas locações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.report)}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="wrench-outline" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Relatar Problema</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.termos)}>
        <MaterialIcons style={{ padding: 4 }} name="private-connectivity" size={26} color={colors.amareloClaro} />
        <Text style={styles.text}>Termos e Condições</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={() => router.push(routes.config)}>
        <MaterialCommunityIcons style={{ padding: 4 }} name="cogs" size={24} color={colors.amareloClaro} />
        <Text style={styles.text}>Configurações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.opcao} onPress={handleLogout}>
        <MaterialIcons style={{ padding: 4 }} name="logout" size={24} color="red" />
        <Text style={styles.textLogout}>Sair da conta</Text>
      </TouchableOpacity>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        message={validationMessage}
        confirmText="Entendi"
        onConfirm={() => {
          setModalVisible(false);
        }}
      />
    </View>
  );
}
