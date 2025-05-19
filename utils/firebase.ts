import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Importa o módulo de Auth
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Importa o módulo de Storage

let firebaseConfig = {
  apiKey: "AIzaSyBSzMMvPgUAIDAr-LfDXz9u833Mk9eyvAM",
  authDomain: "carchauapp.firebaseapp.com",
  projectId: "carchauapp",
  storageBucket: "carchauapp.appspot.com",
  messagingSenderId: "941020505375",
  appId: "1:941020505375:web:1bc19136df32e735f43c2a"
};

if (!firebase.apps.length) {
  console.log(`Conectando... Status:${firebase.apps.length}`);
  firebase.initializeApp(firebaseConfig);
  console.log(`Conectado. Status:${firebase.apps.length}`);
}

// Exporta Firestore, Auth e Storage
export const firestore = firebase.firestore();
export const auth = firebase.auth();       // Exporta o Auth
export const storage = firebase.storage(); // Exporta o Storage

export default firebase;
