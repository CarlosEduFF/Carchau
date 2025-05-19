import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#022036',
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        justifyContent: 'space-around',
        marginTop: 10,
    },
    tabButton: {
        width: '45%',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    activeTab: {
        backgroundColor: '#f2a51a',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    dateSection: {
        marginBottom: 16,
        color: 'white',
    },
    dateText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'white',
        marginLeft: 0
    },
    eventContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',

    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    eventName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    eventDescription: {
        fontSize: 14,
        color: '#888',
    },
    eventDate: {
        fontSize: 14,
        color: '#888',
    },
    eventValue: {
        fontSize: 14,
        color: '#f2a51a',
        marginRight: 8
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
    // Modal
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginBottom: 40,
        backgroundColor: '#F2A51A',
        width: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'justify',
    },
    header: {
        color: '#f2a51a',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    date: {
        color: 'orange',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 80,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10,
    },
    description: {
        color: 'white',
        fontSize: 18,
        flex: 1,
        textAlign: 'justify',
    },
    price: {
        color: 'white',
        fontSize: 20,
        textAlign: 'left',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    acceptButton: {
        backgroundColor: '#f2a51a',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    declineButton: {
        backgroundColor: 'red',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    foco: {
        color: '#f2a51a'
    },

    text: {
        fontWeight: 'bold',
        color: '#fff',
    },
    opcao: {
        top: '2%',
        borderBottomWidth: 2,
        borderColor: 'gray',
        width: '100%',
        padding: '4%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#022036',
    },

});

export default styles;