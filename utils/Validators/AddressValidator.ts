
const validateAddress = (dados: {
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
}, setSitu: (msg: string) => void, setModalVisible2: (visible: boolean) => void) => {

  if (!dados.cep || dados.cep.length !== 9) {
    setSitu('Preencha corretamente o seu CEP!');
    setModalVisible2(true);
    return false;
  }
  if (!dados.endereco) {
    setSitu('Preencha corretamente o seu endereço!');
    setModalVisible2(true);
    return false;
  }
  if (!dados.numero) {
    setSitu('Preencha corretamente o número da sua residência');
    setModalVisible2(true);
    return false;
  }
  if (!dados.bairro) {
    setSitu('Preencha corretamente o seu bairro');
    setModalVisible2(true);
    return false;
  }
  if (!dados.cidade) {
    setSitu('Preencha corretamente a sua cidade.');
    setModalVisible2(true);
    return false;
  }
  if (!dados.estado) {
    setSitu('Preencha corretamente o seu estado.');
    setModalVisible2(true);
    return false;
  }

  return true;
};
export default validateAddress;