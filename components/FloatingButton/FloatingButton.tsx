import React, { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import styles from "./styles";
import { Navigations } from "~/utils/navigations";
import { Services } from "~/services";
import Validators from "~/utils/Validators/index";
import { Components } from "..";
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import images from "~/constants/images";
import colors from "~/constants/colors";

interface FloatingButtonProps {
  carroId: string;
  LocadorId: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ carroId, LocadorId }) => {
  const [LocatarioId, setLocatarioId] = useState("");
  const [nomeLocatario, setNomeLocatario] = useState("");
  const [perfilImageLocatario, setPerfilImageLocatario] = useState<string | null>(null);
  const [cpf, setCPF] = useState("");
  const [profissao, setProfissao] = useState("");
  const [nacionalidade, setNacionalidade] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [index, setIndex] = useState(0);

  // Endereço locatário
  const [endereco, setEndereco] = useState("");
  const [cep, setCep] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  // CNH Locatario
  const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
    front: null,
    back: null,
  });
  const [cnhvalida, setCNHValida] = useState<'valido' | 'invalido' | 'pendente' | null>(null);

  // Dados Locador
  const [nomeLocador, setNomeLocador] = useState<string>("");
  const [perfilImageLocador, setPerfilImageLocador] = useState<string | null>(null);

  // Avaliações
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // Loading
  const [loading, setLoading] = useState(false); // controla se está carregando dados
  const [loading2, setLoading2] = useState(false); // flag extra caso precise

  // modais
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [situ, setSitu] = useState("");
  const [isProfileError, setIsProfileError] = useState(false);

  // --- loaders (não alteram loading diretamente) ---
  const loadLocadorUser = async () => {
    const userData = await Services.fetchUserData(LocadorId);
    if (userData) {
      setNomeLocador(userData.nome || "Usuário");
      setPerfilImageLocador(userData.fotoPerfil || null);
    }
  };

  const loadUser = async () => {
    const userData = await Services.fetchUserData();
    if (userData) {
      setNomeLocatario(userData.nome ?? "");
      setNacionalidade(userData.nacionalidade ?? "");
      setTelefone(userData.telefone ?? "");
      setEmail(userData.email ?? "");
      setCPF(userData.cpf ?? "");
      setProfissao(userData.profissao ?? "");
      setIndex(userData.sexo === "Masculino" ? 0 : 1);
      setPerfilImageLocatario(userData.fotoPerfil ?? null);
    }
  };

  const loadEndereco = async () => {
    const enderecoData = await Services.fetchAddress();
    if (enderecoData) {
      setCep(enderecoData.cep ?? "");
      setEndereco(enderecoData.endereco ?? "");
      setNumero(enderecoData.numero ?? "");
      setComplemento(enderecoData.complemento ?? "");
      setBairro(enderecoData.bairro ?? "");
      setCidade(enderecoData.cidade ?? "");
      setEstado(enderecoData.estado ?? "");
    }
  };

  const loadCnhData = async () => {
    const data = await Services.fetchCnhData();
    if (data) {
      setExistingImages({ front: data.fotoFront ?? null, back: data.fotoBack ?? null });
      setCNHValida(data.cnhvalida ?? null);
    }
  };

  // carrega tudo e controla os flags de loading
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true);
        setLoading2(true);

        const uid = await Services.StorageService.getUserId();
        setLocatarioId(uid ?? "");

        // aguarda todos os carregamentos
        await Promise.all([loadLocadorUser(), loadUser(), loadEndereco(), loadCnhData()]);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
        setLoading2(false);
      }
    };

    carregarDados();
  }, [LocadorId]);

  const GerarChat = async () => {
    try {
      const chatId = await Services.createOrSearchChat(
        LocadorId,
        LocatarioId,
        nomeLocador,
        perfilImageLocador,
        nomeLocatario,
        perfilImageLocatario
      );
      Navigations().GenerateChat(chatId, LocadorId, LocatarioId);
    } catch (error) {
      console.error("Erro ao criar ou buscar chat:", error);
      setSitu("Erro ao criar ou buscar chat.");
      setModalVisible2(true);
    }
  };

  // --- Validações SEPARADAS ---
  // 1) dados pessoais + endereço
  const dadosPessoaisEndereco = {
    nomeLocatario,
    nacionalidade,
    telefone,
    email,
    profissao,
    cpf,
    endereco,
    cep,
    numero,
    bairro,
    cidade,
    estado,
  };

  const camposObrigatoriosPessoalEndereco = [
    "nomeLocatario",
    "nacionalidade",
    "telefone",
    "email",
    "profissao",
    "cpf",
    "endereco",
    "cep",
    "numero",
    "bairro",
    "cidade",
    "estado",
  ];

  // 2) CNH (payload específico)
  const cnhPayload = {
    frontImage: existingImages?.front ?? null,
    backImage: existingImages?.back ?? null,
    cnhvalida,
  };

  // Só validar quando não estiver carregando
  const pessoalEnderecoResult = !loading2 ? Validators.validarCampos(dadosPessoaisEndereco, camposObrigatoriosPessoalEndereco) : { valido: false, camposVazios: [] };
  const cnhResult = !loading2 ? Validators.validarCampos(cnhPayload, []) : { valido: false, camposVazios: [], errosEspecificos: [] };

  const validoFinal = pessoalEnderecoResult.valido && cnhResult.valido;

  // Mensagem amigável ao usuário (preparada no momento do clique)
  const handleAlugar = () => {
    setIsProfileError(false);
    if (loading2) {
      setSitu("Aguarde, carregando seus dados...");
      setModalVisible2(true);
      return;
    }

    if (!pessoalEnderecoResult.valido) {
      const fieldLabels: Record<string, string> = {
        nomeLocatario: 'Nome Completo',
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
      
      const missing = (pessoalEnderecoResult.camposVazios || []).map(f => fieldLabels[f] || f);
      setSitu("Para alugar, você precisa completar seu perfil na aba Conta. Campos faltando:\n\n• " + missing.join("\n• "));
      setIsProfileError(true);
      setModalVisible2(true);
      return;
    }

    if (!cnhResult.valido) {
      const detalhes = (cnhResult.errosEspecificos && cnhResult.errosEspecificos.length > 0)
        ? cnhResult.errosEspecificos.join("\n• ")
        : "Complete suas imagens da CNH e aguarde a validação.";
      setSitu("Sua CNH precisa de atenção:\n\n• " + detalhes);
      setIsProfileError(true);
      setModalVisible2(true);
      return;
    }

    // tudo ok
    Navigations().ChooseDate(carroId, LocadorId, LocatarioId);
  };

  const handleChat = () => {
    if (LocadorId === LocatarioId) {
      setSitu("Você não pode criar um chat consigo mesmo.");
      setModalVisible2(true);
    } else {
      GerarChat();
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={[styles.button]} onPress={handleAlugar}>
        <Text style={styles.textStyle}>Alugar Carro</Text>
      </Pressable>

      <Pressable style={[styles.button]} onPress={handleChat}>
        <Text style={styles.textStyle}>Chat</Text>
      </Pressable>

      <Components.CustomModal
        visible={modalVisible2}
        onClose={() => setModalVisible2(false)}
        hideDefaultButton
      >
        <Text style={{ color: colors.amareloClaro, fontSize: 16, textAlign: 'center', marginBottom: 20 }}>{situ}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          <Pressable 
            style={{ backgroundColor: '#888', padding: 10, borderRadius: 10, minWidth: 100, alignItems: 'center' }} 
            onPress={() => setModalVisible2(false)}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Fechar</Text>
          </Pressable>
          {isProfileError && (
            <Pressable 
              style={{ backgroundColor: colors.amareloClaro, padding: 10, borderRadius: 10, minWidth: 100, alignItems: 'center' }} 
              onPress={() => {
                setModalVisible2(false);
                router.replace(routes.account);
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Ir para Perfil</Text>
            </Pressable>
          )}
        </View>
      </Components.CustomModal>
    </View>
  );
};

export default FloatingButton;
