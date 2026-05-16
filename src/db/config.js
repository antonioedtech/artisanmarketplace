import * as SQLite from 'expo-sqlite';

// Inicializamos la conexión única con el motor físico del dispositivo
const db = SQLite.openDatabase('artisanmarket.db');

/**
 * Inicializa la tabla general de la aplicación (ej. Favoritos o Configuración).
 * Justificación: Mantiene la compatibilidad con los desarrollos previos.
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS favorites (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          price REAL NOT NULL,
          image TEXT NOT NULL
        );`,
        [],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Inserta un producto o actualiza su cantidad si ya existe (Patrón Upsert).
 */
export const upsertCartItem = (id, title, price, image, quantity) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT OR REPLACE INTO cart (id, title, price, image, quantity) VALUES (?, ?, ?, ?, ?);',
        [id, title, price, image, quantity],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Obtiene todos los productos del carrito guardados en disco.
 */
export const fetchCartItems = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM cart',
        [],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Elimina físicamente un registro de la base de datos por su ID.
 */
export const deleteCartItem = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM cart WHERE id = ?;',
        [id],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};

/**
 * Vacía por completo la tabla del carrito (Post-checkout o Clear).
 */
export const truncateCart = () => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM cart;',
        [],
        (_, result) => resolve(result),
        (_, error) => reject(error)
      );
    });
  });
};