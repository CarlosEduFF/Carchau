import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#022036',
        padding: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 8,
        marginHorizontal: 10,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    text: {
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
});
export default styles;