export const routes = {
    //Tabs
    home: '/(tabs)/home',
    activity: '/(tabs)/activity',
    account: '/(tabs)/account',
    contact: '/(tabs)/contact',

    //Account Screen
    termos: '/screens/AccountScreen/terms/acept-terms',
    editProfile: '/screens/AccountScreen/profile/EditProfile/editprofile',
    viewProfile: '/screens/AccountScreen/profile/ViewProfile/profile',
    viewCard: '/screens/AccountScreen/payment/ViewCardList/card-list',
    addCard: '/screens/AccountScreen/payment/AddCard/addcard',
    deleteCard: '/screens/AccountScreen/payment/DeleteCard/deletecard',
    viewLocation: '/screens/AccountScreen/location/LocationList/location-list',
    addLocation: '/screens/AccountScreen/location/AddLocation/add-location',
    editLocation: '/screens/AccountScreen/location/EditLocation/edit-location',
    report: '/screens/AccountScreen/report/reportProblem',
    viewAddress: '/screens/AccountScreen/address/ViewAddress/address',
    editAddress: '/screens/AccountScreen/address/EditAddress/editaddress',
    viewCnh: '/screens/AccountScreen/cnh/ViewCnh/cnh',
    editCnh: '/screens/AccountScreen/cnh/EditCnh/editcnh',
    config: '/screens/AccountScreen/config/config-screen',

    //Activity Screen
    viewAds: '/screens/ActivityScreen/adsScreen/ads',
    viewSchedule: '/screens/ActivityScreen/scheduleScreen/schedule',
    viewOtherProfile: '/screens/ActivityScreen/viewProfile/profile',
    viewLessorRequest: '/screens/ActivityScreen/lessorRequiScreen/lessorrequi',
    viewLesseeRequest: '/screens/ActivityScreen/lesseeRequiScreen/lesseerequi',
    payCaucao: '/screens/ActivityScreen/pyCaucao/caucao',
    payRent: '/screens/ActivityScreen/pyRent/rent',
    verfLessor: '/screens/ActivityScreen/verfLessor/verflessor',
    verfLessee: '/screens/ActivityScreen/verfLessee/verflessee',
    evaluateLessor: '/screens/ActivityScreen/evaluateLessor/evaluate',
    evaluateLessee: '/screens/ActivityScreen/evaluateLessee/evaluate',
    mapsLessor: '/screens/ActivityScreen/verfMapsLessor/verfMapsLessorScreen',
    mapsLessee: '/screens/ActivityScreen/verfMapsLessee/verfMapsLesseeScreen',
    confirmScreen: '/screens/ActivityScreen/soliciConfirmScreen/solici-confirm',

    //Auth
    viewLogin: '/screens/auth/login/loginScreen',
    viewRegister: '/screens/auth/record/registerScreen',

    //chat
    ViewMenssage: '/screens/chat/messages/message',

} as const;

export type RouteKeys = keyof typeof routes;
export type RoutePaths = (typeof routes)[RouteKeys];
