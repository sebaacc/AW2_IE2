# Proyecto de IE2 de Aplicaciones Web 2
Parte práctica de la instancia evaluativa 2, de la materia Aplicaciones Web 2.  
Tiene como objetivo evolucionar la API de Jugadores de fútbol de la IE1 que realizamos anterioremente, integrando una base de datos real y un sistema de autenticación. El proyecto muestra que los datos persisten entre reinicios del servidor y que ciertas rutas solo son pueden ser accesibles por usuarios autenticados.

## Instrucciones de ejecución (versión de Node.js, comandos para instalar y correr).
Para instalar las librerías necesarias para correr la API:  
```bash
npm install express pg dotenv bcrypt jsonwebtoken  
npm install --save-dev nodemon  
```
Para ejecutar el proyecto:  
```bash
npx nodemon app.js  
```
Para detener:  
```bash
Ctrl + C  
```

## Estructura del proyecto.
```bash
mi-api/
├── app.js                  ← Punto de entrada
├── .env                    ← DATABASE_URL y JWT_SECRET (están en .env.example)
├── .gitignore              ← node_modules y .env
├── db/
│   └── conexion.js         ← Pool de pg con ssl para Neon
├── middleware/
│   └── auth.js             ← Verificar JWT
└── routes/
    ├── jugadores.js        ← CRUD con SQL
    └── auth.js             ← Register y login
```
## Integrantes y rol de cada uno.
Sebastián Alejo, Markoja - Programador Backend y Testing de la API. 

## Desafíos encontrados.


## Conversaciones con IA y herramientas externas
[Chat con Gemini](https://gemini.google.com/share/6a6c4718e51d)