import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import { CheckBox, Divider } from '@rneui/themed';
import { router } from 'expo-router';
import styles from './StylesProfile';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import images from '~/constants/images'
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';
import { fetchUserData } from '~/services/UserService/GetUserService';
import AvaliacaoItem from '~/components/EvalueItem';
import { fetchAvaliacoes } from '~/services/evalueServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { routes } from '~/constants/routes';
import colors from '~/constants/colors';
import { Avaliacao } from '~/types/Evalue/Evalue';



export default function InformacoesPessoais() {
    const [selectedIndex, setIndex] = useState<number | null>(null);
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [nacionalidade, setNacionalidade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [profissao, setProfissao] = useState('');
    const [perfilImage, setPerfilImage] = useState<string | null>(null); 
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]); 
    const [userId, setUserId] = useState<string | null>(null); 


    useEffect(() => {
        loadUser();
        carregarAvaliacoes();
    }, []);

    const carregarAvaliacoes = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (!id) return; // Checa o id, não o estado
        setUserId(id); // Atualiza o estado se quiser usar em outros lugares
        try {
            const data = await fetchAvaliacoes(id);
            setAvaliacoes(data);
        } catch (error) {
            console.error('Erro ao carregar avaliações:', error);
        } finally {
            setLoading(false);
        }
    };


    const loadUser = async () => {
        const userData = await fetchUserData();
        if (userData) {
            setNome(userData.nome);
            setNacionalidade(userData.nacionalidade);
            setTelefone(userData.telefone);
            setEmail(userData.email);
            setCpf(userData.cpf);
            setProfissao(userData.profissao);
            setIndex(userData.sexo === 'Masculino' ? 0 : 1);
            setPerfilImage(userData.fotoPerfil);
        }
        setLoading(false);
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    { (loading || loading2) && <LoadingCarAnimation loading={true} /> }

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <View>
                <View style={styles.EditButton}>
                    <TouchableOpacity style={styles.EditButton} onPress={() => router.push(routes.editProfile)}>
                        <Image
                            style={styles.EditImage}
                            source={images.editIcon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <Image
                        style={styles.profileImage}
                        source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage}
                    />
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="id-card" size={24} color={colors.amareloClaro} />
                    <Text style={styles.textoexi}>{cpf}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="user" size={24} color={colors.amareloClaro} />
                    <Text style={styles.textoexi}>{nome}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="globe" size={24} color={colors.amareloClaro} />
                    <Text style={styles.textoexi}>{nacionalidade}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Checkbox Masculino */}
                        <CheckBox
                            checked={selectedIndex === 0}
                            checkedColor="#FFCD1B"
                            containerStyle={styles.CheckBoxSexo}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome
                                name="mars"
                                size={24}
                                color={colors.amareloClaro}
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
                            containerStyle={styles.CheckBoxSexo}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome name="venus" size={24} color={colors.amareloClaro} style={{ marginRight: 4 }} />
                            <Text style={[styles.textobox]}>
                                Feminino
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.Dataarea]}>
                    <MaterialCommunityIcons name="cellphone" size={28} color={colors.amareloClaro} />
                    <Text style={styles.textoexi}>{telefone}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="envelope" size={24} color={colors.amareloClaro} />
                    <Text style={styles.textoexi}>{email}</Text>
                </View>

                <View style={[styles.Dataarea]}>
                    <FontAwesome name="briefcase" size={24} color={colors.amareloClaro} />
                    <Text style={styles.textoexi}>{profissao}</Text>
                </View>

                <Divider style={{ marginBottom: 20, marginTop: 10 }} />

                <View style={styles.AvalicoesView}>
                    <Text style={styles.AvalicoesText}>
                        Avaliações
                    </Text>
                </View>
                {loading ? (
                    <Text style={styles.textoexi}>Carregando avaliações...</Text>
                ) : (
                    <FlatList
                        data={avaliacoes}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <AvaliacaoItem
                                item={item}
                                expanded={expandedId === item.id}
                                onToggleExpand={toggleExpand}
                            />
                        )}
                    />
                )}
            </View>
        </View>
    );
}




