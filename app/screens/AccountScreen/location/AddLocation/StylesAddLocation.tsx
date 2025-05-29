import { StyleSheet } from "react-native";
import colors from "~/constants/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.azulBackground,
        padding: 20,
    },
    pdfContainer: {
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    cancelarText: {
        color: colors.branco,
    },
    pdfText: {
        fontSize: 14,
        color: colors.branco,
        padding: 6,
        backgroundColor: '#000',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: colors.branco,
        width: '100%',
    },
    cancelButton: {
        backgroundColor: 'red',
        fontSize: 14,
        marginTop: 5,
        color: 'white',
        width: 100,
        height: 40,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    vehicleImage: {
        width: 250,
        height: 200,
        borderRadius: 20,
        marginBottom: 10,
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageview: {
        width: 250,
        height: 250,
        borderRadius: 20,
        marginBottom: 10,

    },
    laudImage: {
        width: 200,
        height: 200,
        borderRadius: 20,
        marginBottom: 20,
        marginTop: 20,
        alignContent: 'center',
    },
    title: {
        color: colors.amareloClaro,
        fontSize: 16,
        fontWeight: 'bold',
        top: 2,
        marginBottom: 10,
        justifyContent: 'center',

    },
    titlePT: {
        color: 'red',
        fontSize: 15,
        fontWeight: 'bold',
        top: 2,
        bottom: 20,
        justifyContent: 'center',
    },
    input: {
        marginBottom: 10,
        color: colors.branco,
        fontSize: 16,
        borderRadius: 5,
        height: 45,
        width: '100%',
        padding: 10,
        top: 5,
        borderWidth: 1,
        borderColor: colors.branco,
    },
    button: {
        backgroundColor: colors.amareloClaro,
        width: '75%',
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
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
        top: 20,
        marginBottom: 20,
    },
    textodescri: {
        color: colors.amareloClaro,
        fontSize: 15,
        fontWeight: 'bold',
        top: 20,
        marginBottom: 20,
        textAlign: 'justify',
    },
    textobox: {
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
        top: 15,
        justifyContent: 'center',
    },
    buttonSave: {
        backgroundColor: colors.amareloClaro,
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.amareloClaro,
        borderRadius: 10,
        top: 20,
        marginBottom: 50,
    },
    pickerContainer: {
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: colors.branco,
        overflow: 'hidden',
        borderRadius: 5,
        width: '100%',
        height: 45,
        top: 5,
    },
    picker: {
        color: '#000',
    },
    Topo: {
        marginTop: 65
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