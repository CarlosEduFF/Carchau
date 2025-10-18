import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import images from '~/constants/images';
import styles from './styles';

interface CarCardProps {
    carro: any;
    type: 'edit' | 'view';
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onPress?: (id: string, locaId?: string) => void;
}

const CarCard: React.FC<CarCardProps> = ({
    carro,
    type,
    onEdit,
    onDelete,
    onPress,
}) => {
    const imageUri = carro.primeiraFoto || carro.image;
    const seats = carro.quantidadeLugares || carro.seats;
    const location = carro.pontoencontro || carro.location;
    const rating = carro.nota || carro.rating;
    const owner = carro.owner;
    const fotoLoca = carro.fotoLoca;

    const handlePress = () => {
        if (type === 'view' && onPress) {
            onPress(carro.id, carro.LocaId);
        }
    };

    return type === 'view' ? (
        <Pressable style={styles.carCard} onPress={handlePress}>
            <View style={styles.header}>
                <Text style={styles.carName}>{carro.marca} {carro.modelo}</Text>
                <Text style={styles.carSeats}>{seats} Lugares</Text>
            </View>

            <Text style={styles.carLocation}>{location}</Text>

            <Image
                source={imageUri ? { uri: imageUri } : images.defaultVehicleImage}
                style={styles.carImage}
            />

            <View style={styles.priceContainer}>
                {carro.precoDia && <Text style={styles.price}>R$ {carro.precoDia} /dia</Text>}
                {carro.precoSemana && <Text style={styles.price}>R$ {carro.precoSemana} /semana</Text>}
                {carro.precoMes && <Text style={styles.price}>R$ {carro.precoMes} /mês</Text>}
            </View>

            <View style={styles.footer}>
                <View style={styles.ownerContainer}>
                    <Image
                        source={fotoLoca ? { uri: fotoLoca } : images.defaultProfileImage}
                        style={styles.avatar}
                    />
                    <Text style={styles.carOwner}>{owner}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={18} color="#F2A50A" />
                    <Text style={styles.carRating}>{rating}</Text>
                </View>
            </View>
        </Pressable>
    ) : (
        <View style={styles.carCard}>
            <View style={styles.header}>
                <Text style={styles.carName}>{carro.marca} {carro.modelo}</Text>
                <Text style={styles.carSeats}>{seats} Lugares</Text>
            </View>

            <Text style={styles.carLocation}>{location}</Text>

            <Image
                source={imageUri ? { uri: imageUri } : images.defaultVehicleImage}
                style={styles.carImage}
            />

            <View style={styles.priceContainer}>
                {carro.precoDia && <Text style={styles.price}>R$ {carro.precoDia} /dia</Text>}
                {carro.precoSemana && <Text style={styles.price}>R$ {carro.precoSemana} /semana</Text>}
                {carro.precoMes && <Text style={styles.price}>R$ {carro.precoMes} /mês</Text>}
            </View>

            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => onEdit && onEdit(carro.id)}>
                    <MaterialCommunityIcons name="pencil-outline" size={24} color="#F2A51A" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete && onDelete(carro.id)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={24} color="#F2A51A" />
                </TouchableOpacity>
            </View>

            <View style={styles.ratingContainer}>
                <FontAwesome name="star" size={18} color="#F2A50A" />
                <Text style={styles.carRating}>{rating}</Text>
            </View>
        </View>
    );
};


export default CarCard;
