const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// conectar DB
connectDB();

// middlewares
const cors = require('cors');
app.use(cors());
app.use(express.json());

// rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/articulos', require('./routes/articulos'));

// 🔥 IA GRATIS (Hugging Face)
app.post('/api/ia', async (req, res) => {
    try {
        const { pregunta } = req.body;

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + process.env.HF_TOKEN,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs: pregunta
                })
            }
        );

        const data = await response.json();

        res.json({
            respuesta: data[0]?.generated_text || "Sin respuesta"
        });

    } catch (error) {
        console.log(error);
        res.json({ respuesta: "Error IA" });
    }
});

// servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log("Servidor corriendo en puerto " + PORT);
});