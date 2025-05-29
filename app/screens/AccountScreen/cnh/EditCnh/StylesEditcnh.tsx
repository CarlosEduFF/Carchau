import { StyleSheet } from 'react-native';
import colors from '~/constants/colors';

const styles = StyleSheet.create({
    
    container: {
        backgroundColor: colors.azulBackground,
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
    },
    input: {
        marginBottom: 10,
        color: colors.branco,
        fontSize: 16,
        borderRadius: 10,
        height: 45,
        width: '75%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: colors.amareloClaro, // Certifique-se da cor desejada
        display: 'flex',
        alignItems: 'center', // Centraliza horizontalmente
        justifyContent: 'center', // Centraliza verticalmente
    },

    button: {
        backgroundColor: colors.amareloClaro,
        width: 180,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.amareloClaro,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 20
    },

    textocampo: {
        fontWeight: 'bold',
        color: colors.branco,
        fontSize: 16,
        width: '90%',
        textAlign: 'justify'
    },

    text: {
        alignSelf: 'baseline',
        color: colors.amareloClaro,
        fontSize: 18,
        fontWeight: 'bold',
        paddingBottom: 10,
        paddingLeft: 20,
        marginTop: 65
    },
    profileImage: {
        width: 350,
        height: 250,
        borderRadius: 10,
        borderColor: colors.amareloClaro,
        top: '8%',
        marginBottom: '12%',
        backgroundColor: colors.azulBackground,
        alignContent: 'space-between',
    },
    icondelet: {
        top: '8%',
        marginBottom: '12%',
        backgroundColor: colors.azulBackground,
        alignContent: 'space-between',
    },

    iconUpl: {
        width: 25,
        height: 25,
        borderRadius: 10,
        borderColor: colors.amareloClaro,
        alignContent: 'space-between',
    }
});
export default styles;