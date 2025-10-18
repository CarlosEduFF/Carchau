// services/index.ts
// Agrupamento e re-export centralizado dos serviços da aplicação

/* ======================
   ADS / CAR
   ====================== */
import { fetchLocatariosDetails } from "./AdsService/LesseeAllService";
import { fetchCarrosByLocatario } from "./AdsService/CarAllService";
import { listenRealTimeCars } from "./AdsService/AdsService";
import { fetchCarById } from "./CarService/FetchCarByIdService";

/* ======================
   AUTH
   ====================== */
import { Duplicity } from "./AuthService/DuplicityService";
import { RegisterUserAuth } from "./AuthService/RegisterService";
import { loginUser } from "./AuthService/LoginService";
import { ResetPassword } from "./AuthService/ResetPasswordService";
import { StorageService } from "./AuthService/StorageService";

/* ======================
   ADDRESS
   ====================== */
import { fetchAddress } from "./AddressService/AddressService";
import { saveOrUpdateAddress } from "./AddressService/AddressUpdateService";

/* ======================
   CNH
   ====================== */
import { fetchCnhData } from "./CnhService/CnhService";

/* ======================
   NOTIFICATIONS / TERMS
   ====================== */
import { requestPermissions } from "./NotificationsService/NotificationsService";
import { TermsAcepted } from "./TermsService/TermsAceptedService";

/* ======================
   REQUESTS / CHANGE VALUE
   ====================== */
import { listenRequestLessor } from "./RequestService/requestsLessorService";
import { listenRequestLesse } from "./RequestService/requestsLesseeService";
import { UpdateRequestValue } from "./ChangeValueService/UpdateRequestService";
import { getRequestByLessor } from "./ChangeValueService/GetRequestByLessorService";

/* ======================
   CHAT / CONTACTS / MESSAGES
   ====================== */
import { createOrSearchChat } from "./ChatService/CreateorSearchChatService";
import { createOrUpdateContact } from "./ChatService/CreateOrUpdateContactService";
import { GetAceptedRequest } from "./ChatService/GetAceptedRequest";
import { verifyOrCreateContact } from "./ChatService/VerifyOrCreateContactService";
import { GetContacts } from "./ChatService/GetContactsService";

import { GetMessage } from "./MessageService/GetMessageService";
import { loadChatUserData } from "./MessageService/LoadChatUserData";
import { sendMessageToChat } from "./MessageService/SendMessageToChatService";

/* ======================
   AVALIAÇÕES / EVALUES
   ====================== */
import { fetchEvalueByCar } from "./EvalueService/FetchEvalueCarService";

import { fetchUserData } from "./UserService/GetUserService";

/* ======================
   Export centralizado
   ====================== */
export const Services = {
  // Ads / Car
  listenRealTimeCars,
  fetchCarrosByLocatario,
  fetchLocatariosDetails,
  fetchCarById,

  // Auth
  Duplicity,
  RegisterUserAuth,
  loginUser,
  ResetPassword,
  StorageService,

  // Address
  fetchAddress,
  saveOrUpdateAddress,

  // CNH
  fetchCnhData,

  // Notifications / Terms
  requestPermissions,
  TermsAcepted,

  // Requests / Change value
  listenRequestLessor,
  listenRequestLesse,
  UpdateRequestValue,
  getRequestByLessor,

  // Chat / Contacts / Messages
  createOrSearchChat,
  createOrUpdateContact,
  GetAceptedRequest,
  verifyOrCreateContact,
  GetContacts,
  GetMessage,
  loadChatUserData,
  sendMessageToChat,

  // Evalues
  fetchEvalueByCar,

  fetchUserData
};

/* Re-export named functions so você também pode:
   import { fetchCarById } from '~/services'
*/
export {
  // Ads / Car
  listenRealTimeCars,
  fetchCarrosByLocatario,
  fetchLocatariosDetails,
  fetchCarById,

  // Auth
  Duplicity,
  RegisterUserAuth,
  loginUser,
  ResetPassword,
  StorageService,

  // Address
  fetchAddress,
  saveOrUpdateAddress,

  // CNH
  fetchCnhData,

  // Notifications / Terms
  requestPermissions,
  TermsAcepted,

  // Requests / Change value
  listenRequestLessor,
  listenRequestLesse,
  UpdateRequestValue,
  getRequestByLessor,

  // Chat / Contacts / Messages
  createOrSearchChat,
  createOrUpdateContact,
  GetAceptedRequest,
  verifyOrCreateContact,
  GetContacts,
  GetMessage,
  loadChatUserData,
  sendMessageToChat,

  // Evalues
  fetchEvalueByCar,

  fetchUserData
};
