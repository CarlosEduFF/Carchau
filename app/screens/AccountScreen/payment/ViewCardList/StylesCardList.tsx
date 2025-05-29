import { StyleSheet } from 'react-native';
import colors from '~/constants/colors';
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.azulBackground,
    flex: 1,
    paddingTop: 20,
    alignItems: 'center',
  },
  textocampo: {
    fontWeight: 'bold',
    color: colors.branco,
    fontSize: 16,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    left: 10,
    paddingBottom: 10,
  },
  opcao: {
    top: '2%',
    borderBottomWidth: 2,
    borderColor: 'gray',
    width: '80%',
    padding: '4%',
    backgroundColor: colors.azulBackground,
    tintColor: colors.branco,
    alignContent: 'space-between',
  },
  Button: {
    flexDirection: 'row',
    paddingTop: 20,
    marginTop: 60
  },
});
export default styles;