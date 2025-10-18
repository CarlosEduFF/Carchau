import { StyleSheet } from "react-native";
import colors from "~/constants/colors";
const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    backgroundColor: colors.azulBackground, // Aqui deixa a tela toda azul
  },
  foco: {
    color: colors.amareloClaro
  },
  EmptyMessage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: 20,
  }
});

export default styles;