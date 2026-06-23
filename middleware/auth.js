const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1]; // quitar 'Bearer '

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // disponible en el handler
    next();
  } catch (err) {
    console.error("Error exacto de JWT:", err.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
module.exports = { verificarToken };
