import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

export const API_KEY = 'AIzaSyApeuN_g43wDAkbN-4ae_FGlbukx2egXrw';

/**
 * Configuración oficial de Firebase. 
 * Completar estos campos con la información de tu consola de Firebase:
 * Configuración del proyecto -> General -> Tus apps
 */
export const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "artisanmarket-coderhouse.firebaseapp.com",
  databaseURL: "https://artisanmarket-coderhouse-default-rtdb.firebaseio.com",
  projectId: "artisanmarket-coderhouse",
  storageBucket: "artisanmarket-coderhouse.firebasestorage.app",
  messagingSenderId: "862015118393",
  appId: "1:862015118393:web:c85c8470214a16cd9dc1e8",
  measurementId: "G-MYTSJ0YFTN"
};

// Inicializamos la App de Firebase y la base de datos Realtime
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);