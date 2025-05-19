import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#022036',
    },
    carlogo: {
        width: 50, // Altere para o tamanho desejado
        height: 50, // Altere para o tamanho desejado
    },
    picker: {
        color: '#F2A51A',

    },
    button: {
        backgroundColor: '#F2A51A',
        width: '40%',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 60,
    },
    input: {
        color: '#fff',
        fontSize: 16,
        borderRadius: 5,
        height: 45,
        width: '90%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerContainer: {
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: '#f2a51a',
        overflow: 'hidden',
        borderRadius: 5,
        width: '100%',
        height: 45,
        top: 5,
        marginBottom: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#022036',
    },
    textocampo: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
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
    Topo: {
        marginTop: 60
    },
});
export default styles;