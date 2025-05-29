import { StyleSheet } from "react-native";
import colors from "~/constants/colors";

const styles = StyleSheet.create({
  containerPriva: {
    backgroundColor: colors.azulBackground,
    flex: 1,
    padding: 16,
    alignItems: 'center',
    marginTop: 30
  },
  buttonPriva: {
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 50,
    borderWidth: 2,
  },
  Topo: {
    marginTop: 40
  },
  TextAceitacao: {
    color: colors.branco, 
    fontSize: 13, 
    marginVertical: 10, 
    paddingLeft: 10
  }, 
  CheckAceitacao:{
     backgroundColor: 'transparent', 
     width: 0, 
     paddingRight: 0, 
     left: -20 
  },
  ViewAceitacao:{
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingLeft:10 
  }
});

export default styles;