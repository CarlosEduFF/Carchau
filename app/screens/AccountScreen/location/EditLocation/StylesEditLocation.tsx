import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    titlePT: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        top: 2,
        bottom: 20,
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#022036', // Altere para a cor de fundo desejada
    },
    carlogo: {
        width: 50, // Altere para o tamanho desejado
        height: 50, // Altere para o tamanho desejado
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    foco: {
        color: '#f2a51a',
        fontSize: 15
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'justify',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#f2a51a',
        width: 75,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F2A51A',
        borderRadius: 10,
        top: 20,
        marginBottom: 50,
    },
    container: {
        flex: 1,
        backgroundColor: '#022036',
        padding: 20,
    },
    pdfContainer: {
        flexDirection: 'column', // Mudar para "column" para colocar os itens em linha vertical
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    pdfInfoContainer: {
        flexDirection: 'row', // Coloca o texto do PDF e o botão de cancelar lado a lado
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    pdfButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    viewPdfButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    cancelButton: {
        backgroundColor: 'red',
        color: 'white',
        padding: 10,
        borderRadius: 5,
        marginLeft: 10,
        marginBottom: 10,

    },
    cancelarText: {
        color: 'white',
    },
    pdfText: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: '#333',
        padding: 5,
        borderRadius: 5,
    },

    vehicleImage: {
        width: 250,
        height: 200,
        borderRadius: 20,
        marginBottom: 10,
    },
    uploadButton: {
        backgroundColor: '#F2A51A',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 10,
    },
    saveButton: {
        backgroundColor: '#1B73FF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    page: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textobox: {
        color: '#fff',
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
        color: '#F2A51A',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        borderRadius: 5,
        height: 45,
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textocampo: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 5
    },
    button: {
        backgroundColor: '#F2A51A',
        width: '75%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F2A51A',
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 20
    },
    pickerContainer: {
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#ffffff',
        overflow: 'hidden',
        borderRadius: 5,
        width: '100%',
        height: 45,
        top: 5,
    },
    picker: {
        color: '#F2A51A',
    },
    pdfTex: {
        fontSize: 14,
        color: '#fff',
        padding: 6,
        backgroundColor: '#000',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'white',
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
        borderColor: '#F2A51A',
        alignContent: 'space-between',
    }

});

export default styles;