import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { SolicitacaoContato } from '../types/Contact';
import images from '../constants/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Divider } from '@rneui/base';

interface ContatoItemProps {
    item: SolicitacaoContato;
    onPress: (id: string, locadorId: string, locatarioId: string) => void;
}

const ContatoItem: React.FC<ContatoItemProps> = ({ item, onPress }) => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                setUserId(id);
            } catch (error) {
                console.error('Erro ao buscar userId:', error);
            }
        };

        fetchUserId();
    }, []);

    if (!userId) return null; // Se não achou userId, não renderiza nada

    const isLocador = userId === item.locadorId;

    const imageSource = isLocador
        ? item.locatarioperfilImage
            ? { uri: item.locatarioperfilImage }
            : images.defaultProfileImage
        : item.locadorperfilImage
            ? { uri: item.locadorperfilImage }
            : images.defaultProfileImage;

    const nome = isLocador ? item.locatarionome : item.locadornome;

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => onPress(item.id, item.locadorId, item.locatarioId)}
            >
                <Image source={imageSource} style={styles.image} />
                <Text style={styles.text}>{nome}</Text>
            </TouchableOpacity>
            <Divider style={{ marginBottom: 0, marginTop: 0 }} />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#022036',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 8,
        marginHorizontal: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
});

export default ContatoItem;
