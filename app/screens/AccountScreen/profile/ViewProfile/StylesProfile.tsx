import { StyleSheet } from 'react-native';
import colors from '~/constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.azulBackground,
    flex: 1,
    padding: 24,
  },
  textoexi: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 20
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  EditImage: {
    width: 45,
    height: 45,
    marginBottom: 5,
    marginTop: 30
  },
  EditButton: {
    marginTop: 30,
    width: 45,
    height: 45
  },
  EditView: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
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
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.amareloClaro,
  },
  textobox: {
    color: colors.branco,
    fontSize: 16,
    fontWeight: 'bold',
  },
  Dataarea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  CheckBoxSexo: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginRight: 8,
    padding: 0,
    alignItems: 'center',
  },
  AvalicoesView:{
    display: 'flex', 
    alignItems: 'center', 
    width: '100%', 
    height: '5%'
  },
  AvalicoesText:{ 
    color: colors.amareloClaro, 
    justifyContent: 'center', 
    fontSize: 20, 
    fontWeight: 'bold' 
  }



});
export default styles