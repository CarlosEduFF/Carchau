import React from 'react';
import { View, Text, Image, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '~/constants/colors';
import images from '~/constants/images';

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

const styles = StyleSheet.create({
    carCard: {
        backgroundColor: colors.azulBackground,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderColor: colors.amareloClaro,
        borderWidth: 2,
        width: '90%',
        alignSelf: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    carName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.branco,
    },
    carSeats: {
        color: colors.branco,
    },
    carLocation: {
        color: colors.branco,
        marginVertical: 5,
    },
    carImage: {
        width: '100%',
        height: 220,
        borderRadius: 10,
        marginVertical: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 5,
    },
    price: {
        color: colors.branco,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ownerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    carOwner: {
        color: colors.branco,
        marginLeft: 8,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    carRating: {
        color: colors.branco,
        marginLeft: 5,
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
});

export default CarCard;
