import { router } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckBox } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './StylesAceptTerms';
import Terms  from '~/components/Terms/Terms';
import { fetchLatestTermo } from '~/services/termsServices';
import { routes } from '~/constants/routes';
import LoadingCarAnimation from '~/components/LoadingCarAnimation/LoadingCarAnimation';

export default function Privacidade() {
    const [termoAceito, setTermoAceito] = useState(false);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loading2, setLoading2] = useState(false);
    const [dataAceitacao, setDataAceitacao] = useState<string | null>(null);


    const carregarTermo = async () => {
        const id = await AsyncStorage.getItem('userId');
        if (!id) return;

        try {
            const data = await fetchLatestTermo(id);
            if (data) {
                setTermoAceito(data.termoAceito);
                setDataAceitacao(data.dataAceitacao);
                setIsCheckboxDisabled(data.termoAceito);
            }
        } catch (error) {
            console.error('Erro ao carregar termo:', error);
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarTermo();
    }, []);

    return (
        <View style={styles.containerPriva}>
            {(loading || loading2) && <LoadingCarAnimation loading={loading} loading2={loading2} />}
            <ScrollView>
                <View style={styles.Topo}></View>

                <Terms></Terms>

                {dataAceitacao && (
                    <Text style={styles.TextAceitacao}>
                        Termo aceito em: {new Date(dataAceitacao).toLocaleString()}
                    </Text>
                )}

                <View style={styles.ViewAceitacao}>
                    <CheckBox
                        checked={termoAceito}
                        checkedColor='#F2A51A'
                        disabled={isCheckboxDisabled}
                        containerStyle={styles.CheckAceitacao}
                    />
                    <Text style={{ color: '#fff', fontSize: 13 }}>Li e concordo com os termos de Privacidade,{'\n'} Uso e Coleta de informações.</Text>
                </View>

                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                        style={[styles.buttonPriva, { backgroundColor: termoAceito ? '#F2A51A' : '#022036', borderColor: termoAceito ? '#F2A51A' : '#888888' }]}
                        disabled={!termoAceito}
                        onPress={() => router.replace(routes.account)}
                    >
                        <Text style={{ fontWeight: 'bold', color: termoAceito ? '#fff' : '#888888' }}>Entendi</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

