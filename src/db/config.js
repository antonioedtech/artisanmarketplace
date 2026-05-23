import * as SQLite from 'expo-sqlite';

// Inicializamos la conexión única con el motor físico del dispositivo
const db = SQLite.openDatabaseSync('artisan_market.db');

/**
 * Inicializa la tabla general de la aplicación (ej. Favoritos o Configuración).
 */
export const initDB = async () => {
  return await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL
    );
  `);
};

/**
 * Inicializa la tabla del carrito para persistencia local.
 */
export const initCartDB = async () => {
  return await db.execAsync(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);
};

/**
 * Inserta un producto o actualiza su cantidad si ya existe (Patrón Upsert).
 */
export const upsertCartItem = async (id, title, price, image, quantity) => {
  return await db.runAsync(
    'INSERT OR REPLACE INTO cart (id, title, price, image, quantity) VALUES (?, ?, ?, ?, ?);',
    [id, title, price, image, quantity]
  );
};

/**
 * Obtiene todos los productos del carrito guardados en disco.
 */
export const fetchCartItems = async () => {
  return await db.getAllAsync('SELECT * FROM cart');
};

/**
 * Elimina físicamente un registro de la base de datos por su ID.
 */
export const deleteCartItem = async (id) => {
  return await db.runAsync('DELETE FROM cart WHERE id = ?;', [id]);
};

/**
 * Vacía por completo la tabla del carrito (Post-checkout o Clear).
 */
export const truncateCart = async () => {
  return await db.runAsync('DELETE FROM cart;');
};