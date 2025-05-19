import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, Animated, Modal, Pressable, FlatList } from 'react-native';
import firebase from '../../../../../utils/firebase';
import { CheckBox, Divider } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaskedTextInput } from 'react-native-mask-text';
import { router, useFocusEffect } from 'expo-router';
import styles from './StylesProfile';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from '@rneui/base';


interface Avaliacao {
    id: string,
    nome: string,
    avaliacao: string,
    estrelas: number,
    fotoPerfil: string,
}

export default function InformacoesPessoais() {
    const [selectedIndex, setIndex] = useState<number | null>(null);
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [nacionalidade, setNacionalidade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [perfilImage, setPerfilImage] = useState<string | null>(null); // Estado inicial como null
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState<boolean | null>(null);
    const defaultProfileImage = require('../../../../../assets/icons/Profile-Icon.png'); // Caminho local da imagem padrão
    const editarButton = require('../../../../../assets/icons/Edit-Button-Icon.png'); // Caminho local da imagem padrão
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [situ, setSitu] = useState('');
    const [profissao, setProfissao] = useState('');
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    const userDoc = await firebase.firestore().collection('Locatarios').doc(uid).get();
                    if (userDoc.exists) {
                        const userData = userDoc.data();
                        if (userData) {
                            setNome(userData.nome || '');
                            setNacionalidade(userData.nacionalidade || '');
                            setTelefone(userData.telefone || '');
                            setEmail(userData.email || '');
                            setIndex(userData.sexo === 'Masculino' ? 0 : 1);
                            setCpf(userData.cpf || '');
                            setProfissao(userData.profissao || '');

                            // Carregar a URL da imagem de perfil, se existir
                            if (userData.fotoPerfil) {
                                setPerfilImage(userData.fotoPerfil); // Define a URL da imagem de perfil salva no Firestore


                            }
                        }
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Erro ao buscar dados do usuário: ", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null); // Definição do estado para userId
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); // Estado para armazenar as avaliações


    // Função para alternar a exibição dos detalhes
    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        const fetchUserId = async () => {
            const id = await AsyncStorage.getItem('userId');
            setUserId(id); // Armazena o userId no estado
        };

        fetchUserId();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const fetchSolicitacoesLocador = async () => {
                if (!userId) return;
                try {
                    // Referência da coleção de avaliações para o locatário específico
                    const locatariosRef = firebase.firestore().collection('Locatarios').doc(userId).collection('avaliacoes');

                    // Obtém todas as avaliações
                    const locatariosSnapshot = await locatariosRef.get();

                    // Cria uma array de promessas para buscar os dados de cada documento
                    const solicitacoesPromises = locatariosSnapshot.docs.map(async (doc) => {
                        const data = doc.data();
                        return {
                            id: doc.id,
                            nome: data.nome || '',
                            avaliacao: data.avaliacao || '',
                            estrelas: data.estrelas || 0,
                            fotoPerfil: data.fotoPerfil || '',
                        } as Avaliacao;
                    });

                    // Espera por todas as avaliações e as organiza em um array
                    const solicitacoes = await Promise.all(solicitacoesPromises);
                    setAvaliacoes(solicitacoes); // Define as avaliações no estado

                } catch (error) {
                    console.error('Erro ao buscar solicitações do locador: ', error);
                    alert('Erro ao buscar solicitações do locador.');
                } finally {
                    setLoading(false);
                }
            };

            fetchSolicitacoesLocador();
        }, [userId])
    );


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
                    <Image style={styles.carlogo} source={require('../../../../../assets/icons/Car-Logo.png')} />
                </Animated.View>
                <Text style={{ color: 'white' }}>Carregando...</Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: Avaliacao }) => (
        <View style={styles.reviewItem}>
            <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.reviewHeader}>
                <Image
                    source={
                        item.fotoPerfil && item.fotoPerfil.startsWith('http')
                            ? { uri: item.fotoPerfil }
                            : defaultProfileImage
                    }
                    style={styles.avatar}
                />
                <View style={styles.reviewInfo}>
                    <Text style={styles.name}>{item.nome}</Text>
                    <View style={styles.ratingRow}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <FontAwesome
                                key={index}
                                name={index < Math.floor(item.estrelas) ? 'star' : 'star-o'}
                                size={16}
                                color='#FFCD1B'
                            />
                        ))}
                        <Text style={styles.rating}>{item.estrelas.toFixed(1)}</Text>
                    </View>
                </View>
                <FontAwesome
                    name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color='#fff'
                />
            </TouchableOpacity>

            {/* Exibe os detalhes apenas se a avaliação estiver expandida */}
            {expandedId === item.id && (
                <View style={styles.reviewDetails}>
                    <Text style={styles.detailsText}>{item.avaliacao}</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View>
                <View style={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Alinha no lado esquerdo
                    alignItems: 'flex-end' // Garante alinhamento vertical, caso necessário
                }}>
                    <TouchableOpacity style={{ marginTop: 30, width: 45, height: 45 }} onPress={() => router.push('/screens/AccountScreen/profile/EditProfile/editprofile')}>
                        <Image
                            style={[styles.EditImage, { marginTop: 30 }]}
                            source={editarButton}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                    {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
                    <Image
                        style={styles.profileImage}
                        source={perfilImage ? { uri: perfilImage } : defaultProfileImage}
                    />
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="id-card" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{cpf}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="user" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{nome}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="globe" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{nacionalidade}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Checkbox Masculino */}
                        <CheckBox
                            checked={selectedIndex === 0}
                            checkedColor="#FFCD1B"
                            containerStyle={{
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                marginRight: 8,
                                padding: 0,
                                alignItems: 'center',
                            }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome
                                name="mars"
                                size={24}
                                color="#F2A51A"
                                style={{ marginRight: 4 }}
                            />
                            <Text style={[styles.textobox]}>
                                Masculino
                            </Text>
                        </View>

                        {/* Espaço entre os itens */}
                        <View style={{ width: 20 }} />

                        {/* Checkbox Feminino */}
                        <CheckBox
                            checked={selectedIndex === 1}
                            checkedColor="#FFCD1B"
                            containerStyle={{
                                backgroundColor: 'transparent',
                                borderWidth: 0,
                                marginRight: 8,
                                padding: 0,
                                alignItems: 'center',
                            }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="venus" size={24} color="#F2A51A" style={{ marginRight: 4 }} />
                            <Text style={[styles.textobox]}>
                                Feminino
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.Dataarea]}>
                    <MaterialCommunityIcons name="cellphone" size={28} color="#f2a51a" />
                    <Text style={styles.textoexi}>{telefone}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="envelope" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{email}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="briefcase" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{profissao}</Text>
                </View>

                <Divider style={{ marginBottom: 20, marginTop: 10 }} />

                <View style={{ display: 'flex', alignItems: 'center', width: '100%', height: '5%' }}>
                    <Text style={{ color: '#F2A51A', justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>
                        Avaliações
                    </Text>
                </View>
                {loading ? (
                    <Text>Carregando avaliações...</Text>
                ) : (
                    <FlatList
                        data={avaliacoes}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                )}


            </View>
        </View>
    );
}


