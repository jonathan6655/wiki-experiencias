const express = require('express');
const router = express.Router();
const Articulo = require('../models/articulo');

// 🔹 GET - Obtener todos los artículos
router.get('/', async (req, res) => {
    try {
        const articulos = await Articulo.find().sort({ fecha: -1 });
        res.json(articulos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener artículos' });
    }
});

// 🔹 POST - Crear artículo
router.post('/', async (req, res) => {
    try {
        const { titulo, contenido } = req.body;

        if (!titulo || !contenido) {
            return res.status(400).json({ error: 'Faltan datos' });
        }

        const nuevo = new Articulo({ titulo, contenido });
        await nuevo.save();

        res.json(nuevo);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar artículo' });
    }
});

module.exports = router;