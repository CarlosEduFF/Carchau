export const routes = {
    //Tabs
    home: '/(tabs)/home',
    activity: '/(tabs)/activity',
    account: '/(tabs)/account',

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
    viewOtherProfile:'/screens/ActivityScreen/viewProfile/profile',
    
    //Auth
    viewLogin: '/screens/auth/login/loginScreen',
    viewRegister: '/screens/auth/record/register',
    
    //chat
    ViewMenssage: '/screens/chat/messages/message',
} as const;

export type RouteKeys = keyof typeof routes;
export type RoutePaths = (typeof routes)[RouteKeys];
