import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { routes } from "~/constants/routes";
import { RequestNavigationParams } from "~/types";

export async function RequestNav({
  SolicitacaoId,
  LocadorId,
  LocatarioId,
  CarroID,
  SelectedModalidade,
  DataInicio,
  DataTermino,
  TotalValor,
  TotalDias,
  Dia,
  Estado,
  Descricao,
}: RequestNavigationParams) {
  try {
    const userId = await AsyncStorage.getItem("userId");

    const params = {
      soliciId: SolicitacaoId,
      locadorId: LocadorId,
      locatarioId: LocatarioId,
      carroId: CarroID,
      Modalidade: SelectedModalidade,
      DataInicio,
      DataTermino,
      TotalValor,
      TotalDias,
      Dia,
      Estado,
      Descricao,
    };

    if (userId === LocadorId) {
      router.push({ pathname: routes.viewLessorRequest, params });
    } else if (userId === LocatarioId) {
      router.push({ pathname: routes.viewLesseeRequest, params });
    }
  } catch (error) {
    console.error("Erro ao obter o ID do usuário: ", error);
  }
}
