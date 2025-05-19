import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#022036',
    },

    Solicita: {
        width: '100%',
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#022036',
    },
    carlogo: {
        width: 50, // Altere para o tamanho desejado
        height: 50, // Altere para o tamanho desejado
    },
    SolButton: {
        backgroundColor: '#F2A51A',
        width: '55%',
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    myMessageContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginVertical: 5,
    },
    messageContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    myMessageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    messageContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    messageTextContainer: {
        maxWidth: '80%',
        backgroundColor: '#f0f0f0',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10, // Adiciona espaço entre a mensagem e a imagem
    },

    messageText: {
        fontSize: 16,
    },
    messageAndImageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },

    sendButton: {
        backgroundColor: '#f2a51a',
        borderRadius: 10,
        padding: 5,
        marginLeft: 10,
        marginRight: 10,

        alignItems: 'center',
    },

    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        paddingRight: 5,
        borderBottomColor: '#2A4559',
        borderBottomWidth: 2,
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        marginBottom: 25,
    },
    userIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        margin: 10,
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    Topo: {
        marginTop: 28
    },



    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#022036',
        padding: 10,
        borderTopWidth: 1,
        borderColor: '#fff',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#022036',
        color: '#fff',
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fff',
        marginRight: 10,
    },
});

export default styles;