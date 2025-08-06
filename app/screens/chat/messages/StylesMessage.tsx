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

    SolButton: {
        backgroundColor: '#F2A51A',
        width: '55%',
        height: 45,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
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