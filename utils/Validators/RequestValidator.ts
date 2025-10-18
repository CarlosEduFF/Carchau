import { StatusRequest } from "~/types";

/**
 * LocationPGCaucao:
 * - Renderiza para ambos, mas:
 *   • sempre desabilitado para locador
 *   • desabilita após “Caução pago”
 */
export const isCaucaoDisabled = (
  status: StatusRequest,
  isLocador: boolean
): boolean =>
  // locador nunca pode pagar caução
  isLocador ||
  // assim que estiver “Caução pago” bloqueia o botão
  status.estadoPGCaucao === 'Caução pago';

/**
 * LocationPGRent:
 * - Renderiza para ambos, mas:
 *   • só habilita para locatário quando “Caução pago”
 *   • desabilita após “Aluguel pago”
 */
export const isRentDisabled = (
  status: StatusRequest,
  isLocador: boolean
): boolean =>
  // locador nunca pode pagar aluguel
  isLocador ||
  // só libera se caução já estiver paga
  status.estadoPGCaucao !== 'Caução pago' ||
  // bloqueia de novo após aluguel pago
  status.estadoPGAluguel === 'Aluguel pago';

export const isMapsDisabled = (
  status: StatusRequest,
  isLocador: boolean
): boolean =>
  // Só deve estar habilitado para ambos os usuários após caução e aluguel pagos
  status.estadoPGCaucao !== 'Caução pago' ||
  status.estadoPGAluguel !== 'Aluguel pago' ||
  // Desabilita se ambos já aprovaram a localização
  (
    status.confirlocationlocador === 'Localização aprovada' &&
    status.confirlocationlocatario === 'Localização aprovada'
  );

export const isEntregaDisabled = (
  status: StatusRequest,
  _isLocador: boolean,
  _isLocatario: boolean
): boolean =>
  // Só habilita se ambas localizações forem aprovadas
  status.confirlocationlocador !== 'Localização aprovada' ||
  status.confirlocationlocatario !== 'Localização aprovada' ||
  // Desabilita quando os dois confirmam a entrega e o recebimento do veículo
  (
    status.confirEntregaLocador === 'Veículo entregue' &&
    status.confirRecepLocata === 'Veículo recebido'
  );


export const isDevolucaoDisabled = (
  status: StatusRequest,
  _isLocador: boolean,
  _isLocatario: boolean
): boolean =>
  // Só habilita se entrega e recebimento foram confirmados
  status.confirEntregaLocador !== 'Veículo entregue' ||
  status.confirRecepLocata !== 'Veículo recebido' ||
  // Desabilita se devolução e recebimento final forem confirmados
  (
    status.confirDevoLocata === 'Veículo devolvido' &&
    status.confirRecepLocador === 'Veículo recebido'
  );


export const isAvaliacaoDisabled = (status: StatusRequest, isLocador: boolean): boolean =>
  (isLocador
    ? status.estadoavaliLD === 'Avaliado'
    : status.estadoavaliLT === 'Avaliado') ||
  !(
    status.confirRecepLocador === 'Veículo recebido' &&
    status.confirDevoLocata === 'Veículo devolvido'
  );

  
  export const isLocacaoFinalizada = (item: StatusRequest) =>
    item.estadoPGCaucao === 'Caução pago' &&
    item.estadoPGAluguel === 'Aluguel pago' &&
    item.confirRecepLocata === 'Veículo recebido' &&
    item.confirEntregaLocador === 'Veículo entregue' &&
    item.confirDevoLocata === 'Veículo devolvido' &&
    item.confirRecepLocador === 'Veículo recebido' &&
    item.estadoavaliLD === 'Avaliado' &&
    item.estadoavaliLT === 'Avaliado';

