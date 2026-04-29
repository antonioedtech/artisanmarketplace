import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('artisan_market.db');

export const initDB = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, price REAL NOT NULL, imageUri TEXT NOT NULL);',
        [],
        () => resolve(),
        (_, err) => reject(err)
      );
    });
  });
};