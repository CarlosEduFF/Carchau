import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
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
        backgroundColor: '#022036',
        flex: 1,
        paddingTop: 20,
        alignItems: 'center',
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
    input: {
        marginBottom: 10,
        color: '#fff',
        fontSize: 16,
        borderRadius: 10,
        height: 45,
        width: '75%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: '#F2A51A', // Certifique-se da cor desejada
        display: 'flex',
        alignItems: 'center', // Centraliza horizontalmente
        justifyContent: 'center', // Centraliza verticalmente
    },

    button: {
        backgroundColor: '#F2A51A',
        width: 180,
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
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
        width: '90%',
        textAlign: 'justify'
    },

    text: {
        alignSelf: 'baseline',
        color: '#f2a51a',
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
        borderColor: '#F2A51A',
        top: '8%',
        marginBottom: '12%',
        backgroundColor: '#022036',
        alignContent: 'space-between',
    },
    icondelet: {
        top: '8%',
        marginBottom: '12%',
        backgroundColor: '#022036',
        alignContent: 'space-between',
    },

    header: {
        backgroundColor: '#022036',
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