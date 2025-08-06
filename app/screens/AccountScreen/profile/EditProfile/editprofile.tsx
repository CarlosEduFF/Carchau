import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { CheckBox } from '@rneui/themed';
import { MaskedTextInput } from 'react-native-mask-text';
import { router } from 'expo-router';
import styles from './StylesEdit.';
import { pickSingleImage } from '~/utils/handleMediaManager';
import { fetchUserData } from '~/services/userService';
import images from '~/constants/images'
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import CustomModal from '~/components/CustomModal';
import { routes } from '~/constants/routes';
import { updateUserProfile } from '~/services/userUpdateService';
import { validateUserData } from '~/utils/validators';


export default function InformacoesPessoais() {
    const [selectedIndex, setIndex] = useState<number | null>(null);
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [nacionalidade, setNacionalidade] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [profissao, setProfissao] = useState('');
    const [perfilImage, setPerfilImage] = useState<string | null>(null); // Estado inicial como null
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [situ, setSitu] = useState('');

    useEffect(() => {
        loadUser();
    }, []);

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

    const handleSave = async () => {
        setLoading2(true);

        try {
            await updateUserProfile({
                nome,
                nacionalidade,
                telefone,
                email,
                profissao,
                sexo: selectedIndex === 0 ? 'Masculino' : 'Feminino',
                perfilImage: perfilImage ?? undefined,
                selectedIndex: selectedIndex === null ? undefined : selectedIndex,
            });

            setModalVisible(true);
        } catch (error: any) {
            setSitu(error.message || 'Erro ao atualizar dados.');
            setModalVisible2(true);
        } finally {
            setLoading2(false);
        }
    };
    
    const handleImagePicker = async () => {
        const uri = await pickSingleImage();
        if (uri) {
            setPerfilImage(uri);
        }
    };

    return (
        <View style={styles.container}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <ScrollView style={styles.scroll}>
                <View style={{ alignItems: 'center' }}>

                    <Image
                        style={styles.profileImage}
                        source={perfilImage ? { uri: perfilImage } : images.defaultProfileImage}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleImagePicker}>
                        <View style={styles.ViewButtonPerfil}>
                            <Text style={styles.TextButtonPerfil}>Selecione sua foto de perfil</Text>
                            <Image
                                style={styles.iconUpl}
                                source={images.uploadIcon}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
                <Text style={styles.textocampo}>CPF: {cpf} </Text>

                <Text style={styles.textocampo}>Nome completo:</Text>
                <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={text => setNome(text)}
                />

                <Text style={styles.textocampo}>Nacionalidade:</Text>
                <TextInput
                    style={styles.input}
                    value={nacionalidade}
                    onChangeText={text => setNacionalidade(text)}
                />

                <Text style={styles.textocampo}>Sexo:</Text>
                <View style={{ flexDirection: 'row', paddingTop: 0 }}>
                    <CheckBox
                        checked={selectedIndex === 0}
                        checkedColor='#FFCD1B'
                        onPress={() => setIndex(0)}
                        containerStyle={styles.ChechboxSexo}
                    />
                    <Text style={styles.textobox}>Masculino</Text>

                    <CheckBox
                        checked={selectedIndex === 1}
                        checkedColor='#FFCD1B'
                        onPress={() => setIndex(1)}
                        containerStyle={styles.ChechboxSexo}
                    />
                    <Text style={styles.textobox}>Feminino</Text>
                </View>

                <Text style={styles.textocampo}>Celular:</Text>
                <MaskedTextInput
                    style={styles.input}
                    value={telefone}
                    onChangeText={text => setTelefone(text)}
                    mask="(99) 99999-9999"
                    placeholderTextColor="gray"
                    keyboardType="numeric"
                    autoCapitalize="none"
                    autoCorrect={false}
                    placeholder='(XX) XXXXX-XXXX'
                />

                <Text style={styles.textocampo}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType='email-address'
                />

                <Text style={styles.textocampo}>Profissão:</Text>
                <TextInput
                    style={styles.input}
                    value={profissao}
                    onChangeText={text => setProfissao(text)}
                />

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity style={styles.buttonSave} onPress={() => { handleSave(); }}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Salvar</Text>
                    </TouchableOpacity>

                </View>

                <CustomModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    message="Perfil atualizado com Sucesso!"
                    confirmText="Entendi!"
                    onConfirm={() => {
                        setModalVisible(!modalVisible);
                        router.push(routes.viewProfile);
                    }}
                />

                <CustomModal
                    visible={modalVisible2}
                    onClose={() => setModalVisible2(false)}
                    message={situ}
                    confirmText='Entendi!'
                    onConfirm={() => {
                        setModalVisible2(!modalVisible2);
                    }}
                />

            </ScrollView>
        </View>
    );
}


