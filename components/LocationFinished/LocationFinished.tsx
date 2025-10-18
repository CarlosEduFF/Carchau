import { Request } from "~/types/index";
import { View, Image, Text } from 'react-native';
import images from "~/constants/images";
import styles from "./styles";

interface Props {
    item: Request;
}

 const LocacaoFinalizada: React.FC<Props> = ({ item }) => {
    return (
        <View style={styles.eventContainer}>
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
                <Text style={styles.eventDescription}>Locação finalizada</Text>
                <Text style={styles.eventDate}>{item.dia}</Text>
            </View>
            <Text style={styles.eventValue}>Finalizado</Text>
        </View>
    );
};

export default LocacaoFinalizada;