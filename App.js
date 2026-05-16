export const initAllDBs = async () => {
  await initDB();      // La de favoritos/general
  await initCartDB();  // La del carrito
};

// En App.js:
useEffect(() => {
  initAllDBs()
    .then(() => setDbInitialized(true))
    .catch(err => console.error(err));
}, []);