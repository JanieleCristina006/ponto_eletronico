import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 👈 aqui

const firebaseConfig = {
  apiKey: "AIzaSyDGOvfjcDtnqZrwvEPRaPIDYlUmU-R6Azk",
  authDomain: "ponto-eletronico-79bd7.firebaseapp.com",
  projectId: "ponto-eletronico-79bd7",
  storageBucket: "ponto-eletronico-79bd7.firebasestorage.app",
  messagingSenderId: "1072208960533",
  appId: "1:1072208960533:web:adaae7627c1206afe0c21c"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
