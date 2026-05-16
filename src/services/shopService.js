import { ref, get, child } from "firebase/database";
import { db } from "./firebaseConfig";

/**
 * Servicio para obtener el catálogo completo desde Firebase.
 * Justificación: Usar una función asíncrona fuera de Redux facilita el testing 
 * y la reutilización en diferentes Slices si fuera necesario.
 */
export const fetchShopData = async () => {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'products'));
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No hay datos disponibles en Firebase");
      return [];
    }
  } catch (error) {
    console.error("Error al obtener datos de Firebase:", error);
    throw error;
  }
};