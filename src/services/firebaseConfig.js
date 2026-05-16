import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Reemplaza estos valores con los de tu consola de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApeuN_g43wDAkbN-4ae_FGlbukx2egXrw",
  authDomain: "artisanmarket-coderhouse.firebaseapp.com",
  databaseURL: "https://artisanmarket-coderhouse-default-rtdb.firebaseio.com",
  projectId: "artisanmarket-coderhouse",
  storageBucket: "artisanmarket-coderhouse.firebasestorage.app",
  messagingSenderId: "862015118393",
  appId: "1:862015118393:web:c85c8470214a16cd9dc1e8",
  measurementId: "G-MYTSJ0YFTN"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Realtime Database y la exportamos para su uso
export const db = getDatabase(app);