import { StyleSheet } from 'react-native';
import colors from '~/constants/colors';

const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.azulBackground,
      flex: 1,
      paddingTop: 20,
      alignItems: 'center',
    },
    image: {
      width: 320,
      height: 240,
    },
    icon: {
      marginBottom: 20,
    },
    button: {
      backgroundColor: colors.amareloClaro,
      width: 230,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.amareloClaro,
      borderRadius: 10,
      marginBottom: 20,
    },
    textocampo: {
      fontWeight: 'bold',
      color: colors.branco,
      fontSize: 16,
      width: '90%',
      textAlign: 'justify'
    },
    text: {
      alignSelf: 'baseline',
      color: colors.amareloClaro,
      fontSize: 18,
      fontWeight: 'bold',
      paddingBottom: 10,
      paddingLeft: 20,
      marginTop: 65
    },
    
    containerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  dotBadge: {
    width: 12,
    height: 12,
    borderRadius: 12,
    marginRight: 8,
  },
  textBadge: {
    fontSize: 14,
    fontWeight: '600',
  },
  });
  export default styles;