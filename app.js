const express = require('express');
const app = express();
const jugadoresRouter = require('./routes/jugadores');

app.use(express.json());

// Registro del router
app.use('/', jugadoresRouter);

// 4. Error 404 global
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', ruta: req.url });
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});