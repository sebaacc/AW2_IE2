# Proyecto de IE2 de Aplicaciones Web 2

[https://aw2-ie2.onrender.com - URL pública del proyecto en render](https://aw2-ie2.onrender.com)

Parte práctica de la instancia evaluativa 2, de la materia Aplicaciones Web 2.  
Tiene como objetivo evolucionar la API de Jugadores de Fútbol de la IE1 que realizamos anterioremente, integrando una base de datos real y un sistema de autenticación. El proyecto muestra que los datos persisten entre reinicios del servidor y que las rutas de creación y eliminación de jugadores solo son accesibles por usuarios autenticados.

## Instrucciones de ejecución (versión de Node.js, comandos para instalar y correr).

Para instalar las librerías necesarias para correr la API:

```bash
npm install express pg dotenv bcrypt jsonwebtoken
npm install --save-dev nodemon
```

Para ejecutar el proyecto:

```bash
npm run dev
```

Para detener:

```bash
Ctrl + C
```

## Estructura del proyecto.

```bash
api-de-jugadores-de-futbol/
├── app.js
├── package.json
├── package-lock.json
├── .env                    ← DATABASE_URL y JWT_SECRET (NO va a GitHub)
├── .env.example            ← igual que .env pero sí va al repositorio
├── .gitignore              ← node_modules .env
├── db/
│ └── conexion.js           ← Pool de pg con ssl
├── middleware/
│ └── auth.js               ← Verificar JWT
└── routes/
    ├── jugadores.js        ← Rutas del recurso con SQL
    └── auth.js             ← Register y login

```

## Integrantes y rol de cada uno.

Sebastián Alejo, Markoja - Programador Backend y Testing de la API.

## Desafíos encontrados.

```js
module.exports = { verificarToken };
```

- No lo estaba exportando desde el auth de middleware, y tardé un buen rato en darme cuenta.

---

- Dentro de la carpeta `routes/` tenía el login y register dentro de `jugadores.js` para el manejo de usuarios y credenciales, y lo moví a donde correspondía, en `auth.js`.

---

- Antes tenía montado el jugadoresRouter en la ruta raíz `/`, lo cual me llevó a la confusión y choques entre rutas varias veces, así que le agregué el prefijo `api/jugadores`.

---

- El servidor me decía `"error exacto de JWT: jwt is not defined"`.
  El error jwt is not defined significa que dentro de el archivo `middleware/auth.js` estaba intentando usar el objeto jwt (en la línea `jwt.verify(...))`, pero olvidé importarlo arriba de todo. Con ia lo pude identificar y resolver.

---

- Al probar la ruta de creación de jugador con método POST en Thunder Client, tenía un error en nombre del campo "esLeyenda" y no me daba cuenta, ya que lo había escrito como "es_leyenda" en la BD de Neon.

## Conversaciones con IA y herramientas externas

[Chat con Gemini](https://gemini.google.com/share/6a6c4718e51d)
