const dotenv = require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const pool = require('../db/conexion'); 
const bcrypt = require('bcrypt');


//login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario por email
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1', [email]
    );

    // No revelar si el email existe o no — siempre el mismo mensaje
    if (resultado.rows.length === 0)
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    const usuario = resultado.rows[0];

    // Comparar el password con el hash guardado
    const valido = await bcrypt.compare(password, usuario.password);
    if (!valido)
      return res.status(401).json({ error: 'Credenciales incorrectas' });

    // Generar el JWT y devolverlo al cliente
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// registro
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Faltan campos' });

    // Hashear la contraseña ANTES de guardarla
    const hash = await bcrypt.hash(password, 10);

    // Guardar el hash, nunca el password original
    const resultado = await pool.query(
      'INSERT INTO usuarios (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hash]
    );

    res.status(201).json({ usuario: resultado.rows[0] });

  } catch (err) {
    if (err.code === '23505') // email duplicado
      return res.status(409).json({ error: 'El email ya está registrado' });
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

// HASHEAR — al registrar el usuario
// saltRounds = 10 es el estándar — cuántas veces se aplica el algoritmo
// const hash = await bcrypt.hash(password, 10);
// guardar 'hash' en la BD, nunca 'password'

// COMPARAR — al hacer login
// const coincide = await bcrypt.compare(passwordRecibido, hashGuardado);
// coincide = true si la contraseña es correcta, false si no

// VERIFICAR — en el middleware de rutas protegidas
// Si el token es válido devuelve el payload
// Si es inválido o expiró lanza un error
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
// payload = { id: 1, email: 'ana@ej.com', iat: ..., exp: ... }
