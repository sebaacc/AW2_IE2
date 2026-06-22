const express = require("express");
const router = express.Router();
const pool = require("../db/conexion");
const { verificarToken } = require("../middleware/auth");

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
    const { nombre, club, es_leyenda } = req.body;
    if (!nombre || !club)
      return res.status(400).json({ error: "Faltan campos" });
    const resultado = await pool.query(
      "INSERT INTO jugadores (nombre, club, es_leyenda) VALUES ($1,$2,$3) RETURNING *",
      [nombre, club, es_leyenda || false],
    );
    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FUNCIONALIDAD: Eliminar (DELETE)
router.delete("/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const existe = await pool.query("SELECT * FROM jugadores WHERE id = $1", [
      id,
    ]);

    if (existe.rows.length === 0) {
      return res.status(404).json({ error: "Jugador no encontrado" });
    }

    const jugadorEliminado = existe.rows[0]; // guardamos el jugador eliminado para devolverlo en la respuesta

    // Si existe, lo borramos
    await pool.query("DELETE FROM jugadores WHERE id = $1", [id]);

    res.json({
      message: "Jugador eliminado con éxito",
      jugador: jugadorEliminado,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
