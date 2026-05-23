import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import store from './src/store'; // Asegúrate de que esta sea la ruta a tu store
import MainNavigator from './src/navigation/MainNavigator';
import { initDB, initCartDB } from './src/db/config';
import Loader from './src/components/Loader';

export default function App() {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initAllDBs = async () => {
      try {
        await initDB();      // Inicializa Favoritos
        await initCartDB();  // Inicializa Carrito
        setDbInitialized(true);
      } catch (err) {
        console.error("Error al inicializar las bases de datos:", err);
      }
    };
    initAllDBs();
  }, []);

  // Mientras la DB se prepara, mostramos un cargador para evitar errores de acceso a tablas inexistentes
  if (!dbInitialized) {
    return <Loader />;
  }

  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}