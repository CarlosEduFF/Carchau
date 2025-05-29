import { StyleSheet } from "react-native";
import colors from "~/constants/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.azulBackground,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 10,
    color: colors.branco,
    fontSize: 16,
    borderRadius: 5,
    height: 45,
    width: '90%',
    padding: 10,
    top: 15,
    borderWidth: 1,
    borderColor: colors.branco,
  },
  textocampo: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
    top: 20,
    marginBottom: 5,
  },
  button: {
    backgroundColor: colors.amareloClaro,
    width: '50%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.amareloClaro,
    borderRadius: 10,
    top: 20,
    marginBottom: 50,
  },
  cartaocontainer: {
    width: 350,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 65
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardDetails: {
    padding: 20,
    justifyContent: 'space-between',
  },
  label: {
    color: colors.branco,
    fontSize: 13,
    marginBottom: 5,
  },
  cardNumber: {
    color: colors.branco,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  name: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 20,
  },
  expiry: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
  separacao: {
    fontSize: 16,
    fontWeight: 'bold',
    borderRightWidth: 2,
    borderColor: colors.cinza
  },
  cvv: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logo: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  TextButton: {
    fontWeight: 'bold',
    color: colors.branco,
    fontSize: 18,
  },
  ViewCard: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});
export default styles