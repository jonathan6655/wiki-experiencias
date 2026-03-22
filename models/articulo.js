const mongoose = require('mongoose');

const articuloSchema = new mongoose.Schema({
    titulo: String,
    contenido: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Articulo', articuloSchema);