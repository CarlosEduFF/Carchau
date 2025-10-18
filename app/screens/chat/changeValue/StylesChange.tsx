import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#022036',
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
    updateButtonText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 18,
    },
    viewUpdateButton: {
        alignItems: 'center',
        marginBottom: 30
    },
    textocampo: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 20,
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
    ViewInput: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%'
    },
    ViewInputText: { 
        fontSize: 20, 
        color: '#fff', 
        marginRight: 5 
    },
    picker: {
        color: '#F2A51A'
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
    Topo: {
        marginTop: 60
    },
});
export default styles;