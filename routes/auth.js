const dotenv = require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const pool = require("../db/conexion");
const bcrypt = require("bcrypt");

// Funcionalidad: Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email],
    );

    // No revelar si el email existe o no — siempre el mismo mensaje
    if (resultado.rows.length === 0)
      return res.status(401).json({ error: "Credenciales incorrectas" });
    const usuario = resultado.rows[0];

    // Comparar el password con el hash guardado
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido)
      return res.status(401).json({ error: "Credenciales incorrectas" });

    // Generar el JWT y devolverlo al cliente
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Funcionalidad: Registro
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Faltan campos" });

    // Hashear la contraseña ANTES de guardarla
    const hash = await bcrypt.hash(password, 10);

    // Guardar el hash, nunca el password original
    const resultado = await pool.query(
      "INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email",
      [email, hash],
    );

    res.status(201).json({ usuario: resultado.rows[0] });
  } catch (err) {
    if (err.code === "23505")
      // email duplicado
      return res.status(409).json({ error: "El email ya está registrado" });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
