import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import styles from './StylesAddress';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import images from '~/constants/images';
import { routes } from '~/constants/routes';
import { Services } from '~/services';
import { Components } from '~/components';

export default function Endereco() {
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEndereco();
    }, []);

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
    

    return (
        <View style={styles.container}>
            {(loading) && <Components.LoadingCarAnimation loading={loading} />}
            <View>
                <View style={{
                    display: 'flex',
                    justifyContent: 'flex-end', // Alinha no lado esquerdo
                    alignItems: 'flex-end',
                    zIndex: 1000
                }}>
                    <TouchableOpacity style={{ marginTop: 30, width: 45, height: 45 }} onPress={() => router.replace(routes.editAddress)}>
                        <Image
                            style={[styles.EditImage, { marginTop: 30 }]}
                            source={images.editIcon}
                        />
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'center' }}>
                    {/* Verifica se há uma imagem selecionada, caso contrário usa a imagem padrão */}
                </View>
                <Text style={styles.textoexi}>Cep</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="map-pin" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{cep}</Text>
                </View>
                <Text style={styles.textoexi}>Endereço</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="home" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{endereco}</Text>
                </View>
                <Text style={styles.textoexi}>Número</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="hashtag" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{numero}</Text>
                </View>
                <Text style={styles.textoexi}>Complemento</Text>
                <View style={[styles.Dataarea]}>
                    <MaterialCommunityIcons name="home-outline" size={28} color="#F2A51A" />
                    <Text style={styles.textoexi}>{complemento}</Text>
                </View>
                <Text style={styles.textoexi}>Bairro</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="building" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{bairro}</Text>
                </View>
                <Text style={styles.textoexi}>Cidade</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="map-marker" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{cidade}</Text>
                </View>
                <Text style={styles.textoexi}>Estado</Text>
                <View style={[styles.Dataarea]}>
                    <FontAwesome name="map" size={24} color="#F2A51A" />
                    <Text style={styles.textoexi}>{estado}</Text>
                </View>
            </View>
        </View>
    );
}