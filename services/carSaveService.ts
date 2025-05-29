import AsyncStorage from "@react-native-async-storage/async-storage";
import { Carro } from "~/types/Cars";
import { validateCarData } from "~/utils/validators";
import firebase from "~/config/firebase";
import { uploadFile } from "~/utils/handleMediaManager";

export const saveCar = async (data: Carro) => {
  const uid = await AsyncStorage.getItem('userId');
  if (!uid) throw new Error('ID do usuário não encontrado.');

  // Validação
  const error = validateCarData(data);
  if (error) throw new Error(error);

  // Upload de foto do laudo
  const fotoLaudoUrl = await uploadFile(data.fotoLaud, `laudoCarro/${uid}_${Date.now()}`);

  // Upload do PDF
  const pdfUrl = await uploadFile(data.pdfDocumento, `documentos/${uid}/${Date.now()}_doc.pdf`);

  // Upload das fotos do carro
  const fotosUrls = await Promise.all(
    data.fotosCarro.map((fotoUri) =>
      uploadFile(
        fotoUri,
        `carros/${uid}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      )
    )
  );

  // Gravar dados no Firestore
  const carrosRef = firebase.firestore()
    .collection('Locatarios')
    .doc(uid)
    .collection('carros');

  await carrosRef.add({
    modelo: data.modelo,
    marca: data.marca,
    ano: data.ano,
    placa: data.placa,
    combustivel: data.combustivel,
    quantidadeLugares: data.quantidadeLugares,
    arCondicionado: data.arCondicionado,
    step: data.step,
    cambio: data.cambio,
    airbags: data.airbags,
    caucao: data.caucao,
    modalidadesAluguel: data.modalidadesAluguel,
    precoDia: data.modalidadesAluguel.includes(0) ? data.precoDia : null,
    precoSemana: data.modalidadesAluguel.includes(1) ? data.precoSemana : null,
    precoMes: data.modalidadesAluguel.includes(2) ? data.precoMes : null,
    pontoencontro: data.pontoencontro,
    fotoLaud: fotoLaudoUrl,
    pdfDocumento: pdfUrl,
    pdfNome: data.pdfNome,
    fotosCarro: fotosUrls,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
};
