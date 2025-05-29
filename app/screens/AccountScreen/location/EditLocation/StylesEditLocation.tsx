import { StyleSheet } from "react-native";
import colors from "~/constants/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.azulBackground,
        padding: 20,
    },
    pdfContainer: {
        flexDirection: 'column', // Mudar para "column" para colocar os itens em linha vertical
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
        color: colors.branco,
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 10,

    },
    cancelarText: {
        color: colors.branco,
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
    textobox: {
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
        top: 15,
    },
    pageview: {
        width: 250,
        height: 250,
        borderRadius: 20,
    },
    laudImage: {
        width: 250,
        height: 200,
        borderRadius: 20,
        marginBottom: 10,
    },
    title: {
        color: colors.amareloClaro,
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'justify'
    },
    caracteristicasTitle: {
        color: colors.amareloClaro,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        alignSelf: 'center',
    },
    textocampo: {
        color: colors.branco,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5
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
        marginBottom: 5,
        marginTop: 20
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
    pdfTex: {
        fontSize: 14,
        color: colors.branco,
        padding: 6,
        backgroundColor: colors.black,
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: colors.branco,
        width: '100%',
        marginBottom: 10,
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
    },
    modeloCarro: {
        color: colors.branco,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,

    }, pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    },
    dot: {
        height: 7,
        width: 7,
        borderRadius: 4,
        marginHorizontal: 4
    },
    caracteristicaBloco: {
        marginBottom: 20,
        width: 160,
    },
    caracteristicaLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    caracteristicaTexto: {
        color: colors.branco,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: colors.branco,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: 5,
        height: 40,
        color: 'black',
    },
});

export default styles;