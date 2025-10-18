import colors from "~/constants/colors";
import { StyleSheet } from "react-native";

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

export default styles;