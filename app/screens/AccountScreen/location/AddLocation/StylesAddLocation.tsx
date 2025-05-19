import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#022036',
        padding: 20,
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
    pdfThumbnail: {
        width: 200,
        height: 200,
        resizeMode: 'contain',
        marginTop: 10,
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

    cancelarText: {
        color: 'white',
    },


    uploadButton: {
        backgroundColor: '#F2A51A',
        padding: 10,
        borderRadius: 5, alignItems: 'center',
        marginVertical: 10
    },
    saveButton: {
        backgroundColor: '#1B73FF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center'
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold'
    },
    pdfText: {
        fontSize: 14,
        color: '#fff',
        padding: 6,
        backgroundColor: '#000',
        borderWidth: 0.5,
        borderRadius: 5,
        borderColor: 'white',
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
    header: {
        backgroundColor: '#022036',
    },

    imagePreview: {
        width: 100,
        height: 100,
        marginTop: 10,
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
    photosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    title: {
        color: '#F2A51A',
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
        color: '#fff',
        fontSize: 16,
        borderRadius: 5,
        height: 45,
        width: '100%',
        padding: 10,
        top: 5,
        borderWidth: 1,
        borderColor: '#fff',
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
        marginBottom: 20,
        marginTop: 20
    },
    textocampo: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        top: 20,
        marginBottom: 20,
    },
    textodescri: {
        color: '#f2a51a',
        fontSize: 15,
        fontWeight: 'bold',
        top: 20,
        marginBottom: 20,
        textAlign: 'justify',
    },
    textobox: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        top: 15,
        justifyContent: 'center',
    },
    buttonSave: {
        backgroundColor: '#F2A51A',
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#F2A51A',
        borderRadius: 10,
        top: 20,
        marginBottom: 50,
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
        color: '#000',
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