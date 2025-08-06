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
});

export default styles;