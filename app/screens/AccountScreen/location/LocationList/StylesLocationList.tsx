import { StyleSheet } from "react-native";
import colors from "~/constants/colors";

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.azulBackground,
        flex: 1,
        paddingTop: 20,
    },
    text: {
        color: colors.branco,
        fontSize: 18,
        fontWeight: 'bold',
        left: 10,
        paddingBottom: 10,
    },
    Addbutton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 65
    }
});

export default styles;