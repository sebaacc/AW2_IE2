const express = require("express");
const router = express.Router();
const pool = require("../db/conexion");
const { verificarToken } = require("../middleware/auth");


/*
let jugadores = [
  { id: 1, nombre: "Juan Román Riquelme", club: "Boca", esLeyenda: true },
  { id: 2, nombre: "Enzo Francescoli", club: "River", esLeyenda: true },
  { id: 3, nombre: "Diego Milito", club: "Racing", esLeyenda: true },
  { id: 4, nombre: "Martín Palermo", club: "Boca", esLeyenda: true },
  { id: 5, nombre: "Lisandro López", club: "Racing", esLeyenda: false },
];
let nextId = 6;
*/
// FUNCIONALIDAD: Listar todos los jugadores

router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM jugadores";
    let params = [];

    if (req.query.buscar) {
      query = "SELECT * FROM jugadores WHERE nombre ILIKE $1";
      params = [`%${req.query.buscar}%`];
    }

    const resultado = await pool.query(query, params);
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FUNCIONALIDAD: Buscar por ID
router.get("/:id", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM jugadores WHERE id = $1",
      [req.params.id],
    );
    if (resultado.rows.length === 0)
      return res.status(404).json({ error: "Jugador no encontrado" });
    res.json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FUNCIONALIDAD: Crear un nuevo jugador

router.post("/", verificarToken, async (req, res) => {
  try {
    const { nombre, club, esLeyenda } = req.body;
    if (!nombre || !club)
      return res.status(400).json({ error: "Faltan campos" });
    const resultado = await pool.query(
      "INSERT INTO jugadores (nombre, club, esLeyenda) VALUES ($1,$2,$3) RETURNING *",
      [nombre, club, esLeyenda || false],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FUNCIONALIDAD: Eliminar (DELETE)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const existe = await pool.query("SELECT * FROM jugadores WHERE id = $1", [
      req.params.id,
    ]);
    if (existe.rows.length === 0)
      return res.status(404).json({ error: "Jugador no encontrado" });
    res.json(resultado.rows[0]);
    if (existe.rows.length > 0) {
      await pool.query("DELETE FROM jugadores WHERE id = $1", [req.params.id]);
      res.json({ message: "Jugador eliminado" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
