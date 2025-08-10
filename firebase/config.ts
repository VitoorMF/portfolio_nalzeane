// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// se for usar Analytics, mantenha também o getAnalytics
import { getAnalytics } from "firebase/analytics";

// credenciais geradas no console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOr88QMgFIDEHqeUfQ4y7cvc_l-h90iUA",
  authDomain: "nalzeane-normanha.firebaseapp.com",
  projectId: "nalzeane-normanha",
  storageBucket: "nalzeane-normanha.firebasestorage.app",
  messagingSenderId: "237807156618",
  appId: "1:237807156618:web:451963b55212a8a979dc73",
  measurementId: "G-DGXYW8Y8ZE"
};

// inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// instâncias que você vai usar no seu código
export const auth = getAuth(app);
export const db   = getFirestore(app);

// se você for usar Analytics, exporte também:
export const analytics = getAnalytics(app);
