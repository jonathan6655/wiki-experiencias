const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 🔥 IMPORTANTE
app.use(cors());
app.use(express.json());

// 🔹 rutas existentes
app.use('/api/auth', require('./routes/auth'));

// 🔥 ESTA LÍNEA ES LA CLAVE
app.use('/api/articulos', require('./routes/articulos'));

// 🔹 prueba
app.get('/', (req, res) => {
    res.send("Servidor funcionando 🚀");
});

module.exports = app;