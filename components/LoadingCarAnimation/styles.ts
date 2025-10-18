import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999, // Garante que estará acima dos outros elementos
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#022036', // cor azul escura, totalmente opaca
  },
  carlogo: {
    width: 50, 
    height: 50, 
  },
});

export default styles;