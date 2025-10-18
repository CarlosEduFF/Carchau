import { Request } from "~/types/index";
import { View, Image, Text } from 'react-native';
import images from "~/constants/images";
import styles from "./styles";
interface Props {
    item: Request;
}

const LocationRefused: React.FC<Props> = ({ item }) => {
        if (item.estado !== 'Recusado') return null; // Se não for recusado, não exibe nada

        return (
            <View style={[styles.eventContainer]}>
                <Image
                    source={
                        item.locatarioperfilImage &&
                            typeof item.locatarioperfilImage === 'string' &&
                            item.locatarioperfilImage.trim() !== '' &&
                            item.locatarioperfilImage.startsWith('http')
                            ? { uri: item.locatarioperfilImage }
                            : images.defaultProfileImage
                    }
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={styles.eventName}>{item.locatarionome}</Text>
                    <Text style={styles.eventDescription}>{item.descricao}</Text>
                </View>
                <Text style={styles.eventValue}>{item.estado}</Text>
            </View>
        );
    };
    
export default LocationRefused;