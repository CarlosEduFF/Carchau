import { Request } from "~/types/Request";
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import images from "~/constants/images";
import { FontAwesome } from "@expo/vector-icons";

interface Props {
  item: Request;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
}

export const LocacaoAceita: React.FC<Props> = ({ item, expandedId, toggleExpand }) => {


    return (
        <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.dateText}>
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
                    <Text style={styles.eventDescription}>{item.descricao}</Text>
                    <Text style={styles.eventDate}>{item.dia}</Text>
                </View>
                <Text style={styles.eventValue}>{item.estado}</Text>
                <FontAwesome
                    name={expandedId === item.id ? 'chevron-up' : 'chevron-down'}
                    size={25}
                    color='#fff'
                />
            </View>
        </TouchableOpacity>
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
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        marginLeft: 0
    },
});