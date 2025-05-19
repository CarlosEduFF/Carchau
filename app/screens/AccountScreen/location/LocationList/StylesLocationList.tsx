import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#022036',
        flex: 1,
        paddingTop: 20,

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
    textocampo: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
        paddingHorizontal: 10,
    },

    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        left: 10,
        paddingBottom: 10,
    },

    userIcon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        borderRadius: 20,
        marginRight: 10,
    },

    opcao: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#022036',
        padding: 10,
        flex: 1,
    },

    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    iconButton: {
        marginHorizontal: 10,
    },

    carContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: 'gray',
        paddingVertical: 10,
        width: '100%',
    },
    Addbutton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 65
    }
});

export default styles;