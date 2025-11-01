import validateAddress from "./AddressValidator";
import { validateMessageForm } from "./EmailValidator";
import { isAvaliacaoDisabled, isCaucaoDisabled, isDevolucaoDisabled, isEntregaDisabled, isLocacaoFinalizada, isMapsDisabled, isRentDisabled } from "./RequestValidator";
import { validarCampos } from "./RequiredFieldsValidator";
import { validateUserData } from "./UserValidator";
import { isValidCPF, isValidEmail, isValidPassword, isValidTerms } from "./AuthValidator";

const Validators = {
    validateAddress,
    isValidCPF,
    isValidEmail,
    isValidPassword,
    isValidTerms,
    validateMessageForm,
    isCaucaoDisabled,
    isRentDisabled,
    isMapsDisabled,
    isEntregaDisabled,
    isDevolucaoDisabled,
    isAvaliacaoDisabled,
    isLocacaoFinalizada,
    validarCampos,
    validateUserData,
};
export default Validators;