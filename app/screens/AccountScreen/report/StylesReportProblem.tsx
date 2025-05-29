import { StyleSheet } from 'react-native';
import colors from '~/constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.azulBackground,
    flex: 1,
    padding: 24,
  },
  scroll: {
    marginTop: 50
  },
  input: {
    marginBottom: 10,
    color: colors.branco,
    fontSize: 16,
    borderRadius: 5,
    height: 45,
    width: '100%',
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.branco,
  },
  textocampo: {
    color: colors.amareloClaro,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonSave: {
    backgroundColor: colors.amareloClaro,
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 30
  },
});

export default styles