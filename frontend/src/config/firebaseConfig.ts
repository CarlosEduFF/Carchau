
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDas1Pxsb24b_7h-btBjYFrF1NXRtMb-t8",
  authDomain: "carchauapp.firebaseapp.com",
  projectId: "carchauapp",
  storageBucket: "carchauapp.appspot.com",
  messagingSenderId: "941020505375",
  appId: "1:941020505375:web:623c3de64e8eedb2f43c2a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
