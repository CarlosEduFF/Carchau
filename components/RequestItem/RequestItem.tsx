import { View } from "react-native";
import { StatusRequest, Request } from "~/types/index";

import styles from "./styles";
import Validators from "~/utils/Validators/index";
import LocationPYCaucao from "../LocationPYCaucao/LocationPYCaucao";
import LocationPYRent from "../LocationPYRent/LocationPYRent";
import LocationConfirmMaps from "../LocationConfirmMaps/LocationConfirmMaps";
import LocationConfirmCode from "../LocationConfirmCode/LocationConfirmCode";
import LocationEvalue from "../LocationEvalue/LocationEvalue";
import LocationRequest from "../LocationRequest/LocationRequest";
import LocationAcepted from "../LocationAcepted/LocationAcepted";
import LocationRefused from "../LocationRefused/LocationRefused";
import LocationFinished from "../LocationFinished/LocationFinished";


type SolicitacaoItemProps = {
  item: Request & { status: StatusRequest };
  expandedId: string | null;
  toggleExpand: (id: string) => void;
  userId: string | null;
};

const SolicitacaoItem: React.FC<SolicitacaoItemProps> = ({
  item,
  expandedId,
  toggleExpand,
  userId,
}) => {
  const status = item.status;
  const isLocador = userId === item.locadorId;
  const isLocatario = userId === item.locatarioId;

  return (
    <View style={styles.dateSection}>
      {Validators.isLocacaoFinalizada(status) ? (
        <LocationFinished item={item} />
      ) : item.estado === 'Recusado' ? (
        <LocationRefused item={item} />
      ) : item.estado === 'Aceito' ? (
        <LocationAcepted item={item} expandedId={expandedId} toggleExpand={toggleExpand} />
      ) : (
        <LocationRequest item={item} />
      )}

      {item.estado === 'Aceito' && expandedId === item.id && (
        <View>
          {(isLocatario || isLocador) && (
            <>
              <LocationPYCaucao
                item={item}
                isLocador={isLocador}
                isDisabled={Validators.isCaucaoDisabled(status, isLocador)}
              />
              <LocationPYRent
                item={item}
                isLocador={isLocador}
                isDisabled={Validators.isRentDisabled(status, isLocador)}
              />
              <LocationConfirmMaps
                item={item}
                isDisabled={Validators.isMapsDisabled(status, isLocador)}
              />
              <LocationConfirmCode
                item={item}
                descricao="Confirmar entrega do veículo"
                isDisabled={Validators.isEntregaDisabled(status, isLocador, isLocatario)}
              />
              <LocationConfirmCode
                item={item}
                descricao="Confirmar devolução do veículo"
                isDisabled={Validators.isDevolucaoDisabled(status, isLocador, isLocatario)}
              />
              <LocationEvalue
                item={item}
                isDisabled={Validators.isAvaliacaoDisabled(status, isLocador)}
                descricao="Realize a avaliação desta locação"
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default SolicitacaoItem;