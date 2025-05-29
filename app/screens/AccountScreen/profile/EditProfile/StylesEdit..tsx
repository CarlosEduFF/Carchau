import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#022036',
    flex: 1,
    padding: 24,
  },
  scroll: {
    marginTop: 50
  },
  
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    color: '#fff',
    fontSize: 16,
    borderRadius: 5,
    height: 45,
    width: '100%',
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#fff',
  },
  button: {
    marginBottom: 10,
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    height: 45,
    width: '75%',
    padding: 10,
    borderWidth: 1,
    backgroundColor: '#F2A51A', // Certifique-se da cor desejada
    display: 'flex',
    alignItems: 'center', // Centraliza horizontalmente
    justifyContent: 'center', // Centraliza verticalmente
  },
  textocampo: {
    color: '#F2A51A',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  textobox: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    top: 15,
  },
  buttonSave: {
    backgroundColor: '#F2A51A',
    width: '40%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 30
  },
  iconUpl: {
    width: 25,
    height: 25,
    borderRadius: 10,
    borderColor: '#F2A51A',
    alignContent: 'space-between',
  },
  ChechboxSexo: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingRight: 0
  },
  ViewButtonPerfil:{ 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  TextButtonPerfil:{ 
    fontWeight: 'bold',
     color: 'white', 
     marginRight: 8 
    }
});

export default styles