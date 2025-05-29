import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import styles from './StylesReportProblem';
import LoadingCarAnimation from '~/components/LoadingCarAnimation';
import { fetchUserData } from '~/services/userService';
import CustomModal from '~/components/CustomModal';
import { routes } from '~/constants/routes';
import { sendEmail } from '~/services/emailService';
import { validateMessageForm } from '~/utils/validators';


export default function InformacoesPessoais() {
    const [email, setEmail] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [situ, setSitu] = useState('');
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await fetchUserData();
        if (userData) {
            setEmail(userData.email);
        }
        setLoading(false);
    };

    const onSubmit = async () => {
        setLoading2(true);

        try {
            validateMessageForm(email, mensagem);
            await sendEmail(email, mensagem);
            setModalVisible(true);
        } catch (error: any) {
            console.error(error);
            setSitu('Erro ao enviar mensagem.');
            setModalVisible2(true);
        } finally {
            setLoading2(false);
        }
    };


    { (loading || loading2) && <LoadingCarAnimation loading={true} /> }

    return (
        <View style={{ flex: 1 }}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}

            <View style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={{ marginTop: 20 }}></View>
                    <Text style={styles.textocampo}>Algum problema com o Uso da Aplicação ou com o Aplicativo?</Text>

                    <Text style={styles.textocampo}>Relate o seu problema:</Text>
                    <TextInput
                        style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                        multiline
                        value={mensagem}
                        onChangeText={text => setMensagem(text)}
                        placeholder="Digite seu problema aqui ..."
                        placeholderTextColor="#888888"
                    />

                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity style={styles.buttonSave} onPress={() => { onSubmit(), setLoading2(true) }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Enviar</Text>
                        </TouchableOpacity>
                    </View>

                    <CustomModal
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                        message="Relato enviado com sucesso!"
                        confirmText="Entendi"
                        onConfirm={() => {
                            setModalVisible(false);
                            router.replace(routes.account);
                        }}
                    />

                    <CustomModal
                        visible={modalVisible2}
                        onClose={() => setModalVisible2(false)}
                        message={situ}
                        confirmText="Entendi"
                        onConfirm={() => {
                            router.replace(routes.account);
                        }}
                    />
                </ScrollView>
            </View>
        </View>
    );
}