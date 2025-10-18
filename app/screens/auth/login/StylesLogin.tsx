
import { StyleSheet } from 'react-native';

const Styles = StyleSheet.create({
   scrollContainer: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#022036',
    justifyContent: 'center', // centraliza verticalmente quando conteúdo é menor que a tela
    alignItems: 'center',
  },

  // container não ocupa 100% da altura por padrão (evita conflitos com ScrollView)
  container: {
    width: '100%',
    alignItems: 'center',
  },

  // wrapper para imagens decorativas (absolute)
  decorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 260, // ajuste conforme necessário
    zIndex: 0,
  },
  circuloam: {
    position: 'absolute',
    width: 220,
    height: 220,
    right: -40,
    top: -40,
    opacity: 0.9,
  },
  segundocirculo: {
    position: 'absolute',
    width: 200,
    height: 200,
    left: -50,
    top: 160,
    opacity: 0.9,
  },

  // caixa principal - sem height % nem bottom/top absolutos
  caixalogin: {
    backgroundColor: '#022036',
    borderRadius: 15,
    borderWidth: 5,
    borderColor: '#FFCD1B',
    width: '85%',
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: 'center',
    zIndex: 1, // garante que fique sobre as imagens decorativas
    // opcional: sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  form: {
    width: '100%',
    marginTop: 8,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  showHideButton: {
    marginLeft: 10,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  input: {
    backgroundColor: '#022036',
    width: '100%',
    color: '#fff',
    fontSize: 14,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#fff',
    height: 44,
    marginTop: 6,
    marginBottom: 10,
  },

  title: {
    color: '#FFCD1B',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  textocampo: {
    color: '#FFCD1B',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },

  errorText: {
    color: 'red',
    marginTop: 6,
    fontSize: 12,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },

  forgotText: {
    color: 'white',
    textDecorationLine: 'underline',
  },

  button: {
    backgroundColor: '#F2A51A',
    width: '60%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 16,
  },
  
});

export default Styles;