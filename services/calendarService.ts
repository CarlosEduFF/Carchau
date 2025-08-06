// services/calendarService.ts

import firebase from '~/config/firebase';
import moment from 'moment';
import { CustomMarkedDate } from '~/types/MarkedDate'; // ajuste o caminho conforme sua estrutura

export const fetchOccupiedDates = async (
  carroId: string
): Promise<Record<string, CustomMarkedDate>> => {
  const occupiedDates: Record<string, CustomMarkedDate> = {};

  try {
    const usuariosSnapshot = await firebase.firestore().collection('Locatarios').get();

    const promises = usuariosSnapshot.docs.map(usuarioDoc =>
      usuarioDoc.ref.collection('solicitacoes')
        .where('estado', '==', 'Aceito')
        .where('carroId', '==', carroId)
        .get()
    );

    const resultados = await Promise.all(promises);

    resultados.forEach(solicitacoesSnapshot => {
      solicitacoesSnapshot.forEach(doc => {
        const data = doc.data();
        const inicio = moment(data.dataInicio, 'DD-MM-YYYY');
        const termino = moment(data.dataTermino, 'DD-MM-YYYY');

        if (!inicio.isValid() || !termino.isValid()) {
          console.error("Data inválida encontrada:", {
            inicio: data.dataInicio,
            termino: data.dataTermino,
          });
          return;
        }

        let currentDate = moment(inicio);
        while (currentDate.isSameOrBefore(termino)) {
          const dateStr = currentDate.format('YYYY-MM-DD');
          occupiedDates[dateStr] = {
            selected: true,
            color: '#ff0000',
            textColor: '#fff',
            disableTouchEvent: true,
          };
          currentDate.add(1, 'day');
        }
      });
    });

    return occupiedDates;

  } catch (error) {
    console.error('Erro ao buscar solicitações: ', error);
    return {};
  }
};

interface MarcarIntervaloParams {
  inicio: string | null;
  termino: string | null;
  markedDates: Record<string, CustomMarkedDate>;
}

interface MarcarIntervaloResult {
  error?: string;
  updatedMarkedDates?: Record<string, CustomMarkedDate>;
  inicioFormatado?: string;
  terminoFormatado?: string;
}

export const marcarIntervalo = (
  dataInicio: string | null,
  formattedDate: string,
  { inicio, termino, markedDates }: MarcarIntervaloParams
): MarcarIntervaloResult => {
  if (!inicio) return { error: 'Data de início inválida.' };

  if (moment(termino).isBefore(inicio)) {
    return {
      error: 'A data de término é anterior à data de início.',
    };
  }

  const interval: Record<string, CustomMarkedDate> = {};
  const currentDate = moment(inicio);
  const lastDate = moment(termino);

  const inicioFormatado = moment(inicio).format('DD-MM-YYYY');
  const terminoFormatado = moment(termino).format('DD-MM-YYYY');

  const occupiedOnly: Record<string, CustomMarkedDate> = {};
  for (const [date, value] of Object.entries(markedDates)) {
    if (value.disableTouchEvent) {
      occupiedOnly[date] = value;
    }
  }

  let pointer = moment(currentDate);
  while (pointer.isSameOrBefore(lastDate)) {
    const dateStr = pointer.format('YYYY-MM-DD');

    if (occupiedOnly[dateStr]) {
      return {
        error: `A data ${dateStr} está ocupada.`,
      };
    }

    interval[dateStr] = {
      startingDay: pointer.isSame(inicio, 'day'),
      endingDay: pointer.isSame(termino, 'day'),
      selected: true,
      color: '#f2a51a',
      textColor: '#fff',
    };

    pointer.add(1, 'days');
  }

  return {
    updatedMarkedDates: {
      ...occupiedOnly,
      ...interval,
    },
    inicioFormatado,
    terminoFormatado,
  };
};


