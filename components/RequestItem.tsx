import { View } from "react-native";
import { StatusRequest } from "~/types/StatusRequest";
import { Request } from "~/types/Request";
import { LocacaoFinalizada } from "./LocationFinished";
import { LocacaoRecusada } from "./LocationRefused";
import { LocacaoAceita } from "./LocationAcepted";
import { RequisicaoLocacao } from "./LocationRequest";
import { StyleSheet } from "react-native";
import colors from "~/constants/colors";
import LocationEvalue from "./LocationEvalue";
import LocationConfirmCode from "./LocationConfirmCode";
import LocationConfirmMaps from "./LocationConfirmMaps";
import LocationPGRent from "./LocationPGRent";
import LocationPGCaucao from "./LocationPGCaucao";
import { isAvaliacaoDisabled, isCaucaoDisabled, isDevolucaoDisabled, isEntregaDisabled, isLocacaoFinalizada, isMapsDisabled, isRentDisabled } from "~/utils/validators";

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
      {isLocacaoFinalizada(status) ? (
        <LocacaoFinalizada item={item} />
      ) : item.estado === 'Recusado' ? (
        <LocacaoRecusada item={item} />
      ) : item.estado === 'Aceito' ? (
        <LocacaoAceita item={item} expandedId={expandedId} toggleExpand={toggleExpand} />
      ) : (
        <RequisicaoLocacao item={item} />
      )}

      {item.estado === 'Aceito' && expandedId === item.id && (
        <View>
          {(isLocatario || isLocador) && (
            <>
              <LocationPGCaucao
                item={item}
                isLocador={isLocador}
                isDisabled={isCaucaoDisabled(status, isLocador)}
              />
              <LocationPGRent
                item={item}
                isLocador={isLocador}
                isDisabled={isRentDisabled(status, isLocador)}
              />
              <LocationConfirmMaps
                item={item}
                isDisabled={isMapsDisabled(status, isLocador)}
              />
              <LocationConfirmCode
                item={item}
                descricao="Confirmar entrega do veículo"
                isDisabled={isEntregaDisabled(status, isLocador, isLocatario)}
              />
              <LocationConfirmCode
                item={item}
                descricao="Confirmar devolução do veículo"
                isDisabled={isDevolucaoDisabled(status, isLocador, isLocatario)}
              />
              <LocationEvalue
                item={item}
                isDisabled={isAvaliacaoDisabled(status, isLocador)}
                descricao="Realize a avaliação desta locação"
              />
            </>
          )}
        </View>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
    dateSection: {
        marginBottom: 16,
        color: 'white',
    },
    foco: {
        color: colors.amareloClaro
    },
});


export default SolicitacaoItem;