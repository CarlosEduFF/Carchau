import { StyleSheet } from "react-native";
import colors from "~/constants/colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.azulBackground,
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
        backgroundColor: colors.amareloClaro,
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
    foco: {
        color: colors.amareloClaro
    },
});

export default styles;