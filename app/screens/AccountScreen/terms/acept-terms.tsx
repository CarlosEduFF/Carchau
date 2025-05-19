import { router } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckBox } from '@rneui/themed';
import firebase from '../../../../utils/firebase'; // Certifique-se que a configuração do Firebase está correta
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesAceptTerms';
import { Terms } from '~/components/Terms';

export default function Privacidade() {
    const [termoAceito, setTermoAceito] = useState(false);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(false);
    const [coletaAceito, setColetaAceito] = useState(false); // Estado para coleta de dados
    const [dataAceitacao, setDataAceitacao] = useState<string | null>(null);
    // Para armazenar a data de aceitação

    // Buscar dados do usuário e verificar se ele já aceitou o termo de privacidade
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const uid = await AsyncStorage.getItem('userId');
                if (uid) {
                    // Buscar a subcoleção "termos" dentro do documento do Locatario
                    const termosSnapshot = await firebase.firestore()
                        .collection('Locatarios')
                        .doc(uid)
                        .collection('termos')
                        .orderBy('dataAceitacao', 'desc') // Ordena pelos termos mais recentes
                        .limit(1) // Obtém o termo mais recente
                        .get();

                    if (!termosSnapshot.empty) {
                        const termoData = termosSnapshot.docs[0].data();
                        setTermoAceito(termoData.termoAceito || false);
                        setColetaAceito(termoData.coletaAceito || false);
                        setDataAceitacao(termoData.dataAceitacao || null);
                        setIsCheckboxDisabled(termoData.termoAceito || false);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados do usuário: ", error);
            }
        };

        fetchUserData();
    }, []);



    // Função para redirecionar após aceitação
    const handleAceito = () => {
        router.replace('../../../(tabs)/account');
    };

    return (
        <View style={styles.containerPriva}>
            <ScrollView>
                <View style={styles.Topo}></View>
                <Terms></Terms>


                {/* Exibir a data de aceitação do termo, se houver */}
                {dataAceitacao && (
                    <Text style={{ color: '#fff', fontSize: 13, marginVertical: 10, paddingLeft: 10 }}>
                        Termo aceito em: {new Date(dataAceitacao).toLocaleString()}
                    </Text>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft:10 }}>
                    <CheckBox
                        checked={termoAceito}
                        checkedColor='#F2A51A'
                        disabled={isCheckboxDisabled}
                        containerStyle={{ backgroundColor: 'transparent', width: 0, paddingRight: 0, left: -20 }}
                    />
                    <Text style={{ color: '#fff', fontSize: 13 }}>Li e concordo com os termos de Privacidade,{'\n'} Uso e Coleta de informações.</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={[styles.buttonPriva, { backgroundColor: termoAceito ? '#F2A51A' : '#022036', borderColor: termoAceito ? '#F2A51A' : '#888888' }]}
                        disabled={!termoAceito}
                        onPress={handleAceito}
                    >
                        <Text style={{ fontWeight: 'bold', color: termoAceito ? '#fff' : '#888888' }}>Entendi</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

