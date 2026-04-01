import firebase from '~/config/firebase';// Função para obter UID do AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isValidCardName, isValidCardNumber, isValidCVV, isValidExpiryDate } from '~/utils/validators';

const getUserId = async (): Promise<string> => {
  const uid = await AsyncStorage.getItem('userId');
  if (!uid) throw new Error('Erro ao obter ID do usuário.');
  return uid;
};

// Função para validar dados do cartão, retorna mensagem de erro ou undefined se válido
const validateCardData = (
  expiryDate: string,
  cardNumber: string,
  cardName: string,
  cvv: string
): string | undefined => {
  if (!isValidExpiryDate(expiryDate)) return 'Data de validade inválida!';
  if (!isValidCardNumber(cardNumber)) return 'Número do cartão inválido!';
  if (!isValidCardName(cardName)) return 'Digite o nome do titular do cartão!';
  if (!isValidCVV(cvv)) return 'CVV inválido!';
  return undefined;
};

// Função para salvar dados no Firestore
const saveCardData = async (
  uid: string,
  cardNumber: string,
  cardName: string,
  expiryDate: string,
  cvv: string
) => {
  // Validação
  const error = validateCardData(expiryDate, cardNumber, cardName, cvv);
  if (error) throw new Error(error);

  const cardsRef = firebase.firestore()
    .collection('Locatarios')
    .doc(uid)
    .collection('cartoes');

  await cardsRef.add({
    cartaoNumero: cardNumber,
    cartaoNome: cardName.toUpperCase(),
    cartaoData: expiryDate,
    cvv: cvv,
  });
};
export default saveCardData;