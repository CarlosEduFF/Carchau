import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import { SolicitacaoContato } from '../../types/Chat/Contact';
import images from '../../constants/images';
import { Divider } from '@rneui/base';
import { Services } from '~/services';
import styles from './styles';

interface ContatoItemProps {
    item: SolicitacaoContato;
    onPress: (id: string, locadorId: string, locatarioId: string) => void;
}

const ContactItem: React.FC<ContatoItemProps> = ({ item, onPress }) => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const id = await Services.StorageService.getUserId();
                setUserId(id);
            } catch (error) {
                console.error('Erro ao buscar userId:', error);
            }
        };

        fetchUserId();
    }, []);

    if (!userId) return null; 

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



export default ContactItem;
