import { Request } from "~/types/index";
import { View, Image, Text, TouchableOpacity } from 'react-native';
import images from "~/constants/images";
import { FontAwesome } from "@expo/vector-icons";
import styles from "./styles";

interface Props {
  item: Request;
  expandedId: string | null;
  toggleExpand: (id: string) => void;
}

const LocationAcepted: React.FC<Props> = ({ item, expandedId, toggleExpand }) => {


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
export default LocationAcepted;
