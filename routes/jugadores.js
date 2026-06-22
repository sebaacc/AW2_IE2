const express = require('express');
const router = express.Router();
const pool = require('../db/conexion');

let jugadores = [
  { id: 1, nombre: 'Juan Román Riquelme', club: 'Boca', esLeyenda: true },
  { id: 2, nombre: 'Enzo Francescoli', club: 'River', esLeyenda: true },
  { id: 3, nombre: 'Diego Milito', club: 'Racing', esLeyenda: true },
  { id: 4, nombre: 'Martín Palermo', club: 'Boca', esLeyenda: true },
  { id: 5, nombre: 'Lisandro López', club: 'Racing', esLeyenda: false },
];
let nextId = 6;

// FUNCIONALIDAD: Listar todos los jugadores

router.get('/', async (req, res) => {
  try {
    let query  = 'SELECT * FROM jugadores';
    let params = [];

    if (req.query.buscar) {
      query  = 'SELECT * FROM jugadores WHERE nombre ILIKE $1';
      params = [`%${req.query.buscar}%`];
    }

    const resultado = await pool.query(query, params);
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// FUNCIONALIDAD: Buscar por ID
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const jugador = jugadores.find(j => j.id === id);

  if (!jugador) {
    return res.status(404).json({ error: `Jugador con ID ${id} no encontrado` });
  }
  res.json(jugador);
});

// FUNCIONALIDAD: Crear un nuevo jugador 
router.post('/', (req, res) => {
  const { nombre, club, esLeyenda } = req.body;

  if (!nombre || !club) {
    return res.status(400).json({ error: 'Nombre y club son obligatorios' });
  }

  const nuevo = { id: nextId++, nombre, club, esLeyenda: esLeyenda || false };
  jugadores.push(nuevo);
  res.status(201).json(nuevo);
});

// FUNCIONALIDAD: Eliminar (DELETE)
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const existe = jugadores.some(j => j.id === id);

    //Verificamos si existe antes de intentar borrar
  if (!existe) {
    return res.status(404).json({ error: `Jugador con ID ${id} no encontrado` });
  }

  // Filtramos la lista para quitar al jugador
  jugadores = jugadores.filter(j => j.id !== id);
  
  // 204 indica éxito sin contenido en la respuesta
  res.status(204).send();
});

module.exports = router;