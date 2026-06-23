require("dotenv").config();
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");
const jugadoresRouter = require("./routes/jugadores");

// 1. Middlewares globales indispensables primero.
app.use(express.json());

// 2. Rutas de autenticación.
app.use("/api/auth", authRoutes);

// 3. Rutas de jugadores.
app.use("/api/jugadores", jugadoresRouter);

// 4. Error 404 global al final.
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada", ruta: req.url });
});

// 5. Servidor escuchando en el puerto 3000.
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
