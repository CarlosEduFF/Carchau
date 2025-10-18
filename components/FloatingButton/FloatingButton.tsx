import { View, Text, Pressable } from "react-native";
import styles from "./styles";
import { Navigations } from "~/utils/navigations";
import { useEffect, useRef, useState } from "react";
import { Services } from "~/services";
import Validators from "~/utils/Validators/index";

interface FloatingButtonProps {
    carroId: string;
    LocadorId: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ carroId, LocadorId }) => {

    const [LocatarioId, setLocatarioId] = useState('');
    const [nomeLocatario, setNomeLocatario] = useState('');
    const [perfilImageLocatario, setPerfilImageLocatario] = useState<string | null>(null);
    const [cpf, setCPF] = useState('');
    const [profissao, setProfissao] = useState('');
    const [nacionalidade, setNacionalidade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [index, setIndex] = useState(0);

    //Endereço locatário
    const [endereco, setEndereco] = useState('');
    const [cep, setCep] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    //CNH Locátario
    const [existingImages, setExistingImages] = useState<{ front: string | null; back: string | null }>({
        front: null,
        back: null,
    });

    //Dados Locador
    const [nomeLocador, setNomeLocador] = useState<string>('');
    const [perfilImageLocador, setPerfilImageLocador] = useState<string | null>(null);

    //Avaliações
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    //Loading
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    //modais
      const [modalVisible, setModalVisible] = useState(false);
      const [modalVisible2, setModalVisible2] = useState(false);
      const [situ, setSitu] = useState('');

    const loadLocadorUser = async () => {
        const userData = await Services.fetchUserData(LocadorId);
        if (userData) {
            setNomeLocador(userData.nome || 'Usuário');
            setPerfilImageLocador(userData.fotoPerfil || null);
        }
        setLoading(false);
    };

    const loadUser = async () => {
        const userData = await Services.fetchUserData();
        if (userData) {
            setNomeLocatario(userData.nome);
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

    const loadCnhData = async () => {
        const data = await Services.fetchCnhData();
        if (data) {
            setExistingImages({ front: data.fotoFront, back: data.fotoBack });
        }
        setLoading(false);
    };

    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading2(true);
                const uid = await Services.StorageService.getUserId();
                setLocatarioId(uid ?? '');
                await loadLocadorUser();
                await loadUser();
                await loadEndereco();
                await loadCnhData();
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            } finally {
                setLoading2(false);
            }
        };
        carregarDados();
    }, []);

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
            console.error('Erro ao criar ou buscar chat:', error);
            setSitu('Erro ao criar ou buscar chat.');
            setModalVisible2(true);
        }
    };

    const { valido, camposVazios } = Validators.validarCampos(
        {
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
            frontImage: existingImages?.front,
            backImage: existingImages?.back,
        },
        [
            'nomeLocatario',
            'nacionalidade',
            'telefone',
            'email',
            'profissao',
            'cpf',
            'endereco',
            'cep',
            'numero',
            'bairro',
            'cidade',
            'estado',
            'frontImage',
            'backImage',
        ]
    );


    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={[styles.button]}
                onPress={() => {
                    if (!valido) {
                        setSitu('Campos vazios: ' + camposVazios.join(', '));
                        setModalVisible2(true);
                    } else {
                        Navigations().ChooseDate(carroId, LocadorId, LocatarioId);
                    }
                }}
            >
                <Text style={styles.textStyle}>Alugar Carro</Text>
            </Pressable>

            <Pressable
                style={[styles.button]}
                onPress={() => {
                    if (LocadorId === LocatarioId) {
                        setSitu("Você não pode criar um chat consigo mesmo.");
                        setModalVisible2(true);
                    } else {
                        GerarChat();
                    }
                }}>
                <Text style={styles.textStyle}>Chat</Text>
            </Pressable>
        </View>
    );
}
export default FloatingButton;