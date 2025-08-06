import { Request } from "~/types/Request";
import { StyleSheet, View, Image, Text } from 'react-native';
import images from "~/constants/images";

interface Props {
    item: Request;
}

export const LocacaoFinalizada: React.FC<Props> = ({ item }) => {
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

const styles = StyleSheet.create({
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    eventDescription: {
        fontSize: 14,
        color: '#888',
    },
    eventDate: {
        fontSize: 14,
        color: '#888',
    },
    eventValue: {
        fontSize: 14,
        color: '#f2a51a',
        marginRight: 8,
    },
});