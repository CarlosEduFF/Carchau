import { StyleSheet } from "react-native";
import colors from "~/constants/colors";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.azulBackground,
      alignItems: 'center',
    },
    text: {
      fontWeight: 'bold',
      color: colors.branco,
    },
    opcao: {
      top: '2%',
      borderBottomWidth: 2,
      borderColor: 'gray',
      width: '100%',
      padding: '4%',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.azulBackground,
    },
    imageRight: {
      position: 'absolute',
      right: 10, 
      width: 30,
      height: 30,
    },    
  
  });
  
export default styles;  