
import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
  container: {
    backgroundColor: '#022036',
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 15, // Espaçamento acima da mensagem de erro
    fontSize: 12, // Tamanho da fonte da mensagem de erro
  },
  foco: {
    color: '#f2a51a'
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'justify',
  },
  circuloam: {
    width: 300,
    height: 300,
    marginTop: 10,
    left: 180,
    bottom: 90,
  },
  segundocirculo: {
    width: 300,
    height: 300,
    marginTop: 10,
    top: 200,
    right: 170,
  },
  caixalogin: {
    backgroundColor: '#022036',
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#FFCD1B',
    width: '85%',
    height: '40%',
    bottom: 460,
    alignItems: 'center',
  },
  form: {
    flex: 1,
    width: '80%',
    top: 20,
  },
  input: {
    backgroundColor: '#022036',
    width: '100%',
    marginBottom: 20,
    color: '#fff',
    fontSize: 14,
    borderRadius: 7,
    padding: 5,
    top: 30,
    borderWidth: 2,
    borderColor: '#fff',
    height: 40, // Defina uma altura fixa
  },
  title: {
    color: '#FFCD1B',
    fontSize: 22,
    fontWeight: 'bold',
    top: 10,
    bottom: 20,
  },
  textocampo: {
    color: '#FFCD1B',
    fontSize: 16,
    fontWeight: 'bold',
    top: 20,
  },
  button: {
    backgroundColor: '#F2A51A',
    width: '60%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 15,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
    top: 30,
  },
  inputPassword: {
    backgroundColor: '#022036',
    color: '#fff',
    fontSize: 14,
    borderRadius: 7,
    paddingVertical: 5,
    paddingLeft: 10,
    paddingRight: 40, // espaço para o ícone
    borderWidth: 2,
    borderColor: '#fff',
    height: 40,
  },
  eyeButton: {
    position: 'absolute',
    right: 10,
    top: 8,
    padding: 5,
  },

});

export default Styles;