import { StyleSheet } from "react-native";
import colors from "~/constants/colors";


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.azulBackground,
    },
    navigation: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    containerInput: {
      backgroundColor: colors.branco,
      borderRadius: 5,
      width: '85%',
      height: 35,
      flexDirection: 'row',
      paddingLeft: 3,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      paddingLeft: 10,
      height: 50,
    },
    pressable: {
      width: '10%',
      height: 35,
      borderRadius: 5,
    },
  });

  export default styles;