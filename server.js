require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 conectar DB
connectDB();

// 🔥 rutas
app.use("/api", authRoutes);

// ===== MODELO POST =====
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    titulo: String,
    contenido: String,
    imagen: String,
    autor: String,
    fecha: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', PostSchema);

// ===== CREAR ARTICULO =====
app.post('/api/posts', async (req, res) => {
    try{
        const post = new Post(req.body);
        await post.save();
        res.json({ok:true});
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// ===== OBTENER ARTICULOS =====
app.get('/api/posts', async (req, res) => {
    try{
        const posts = await Post.find().sort({fecha:-1});
        res.json(posts);
    }catch(err){
        res.status(500).json({error: err.message});
    }
});

// ================= IA REAL =================
app.post('/api/ia', async (req, res) => {
    try {
        const { pregunta } = req.body;

        if (!pregunta) {
            return res.json({ respuesta: "Escribe algo" });
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres una IA estilo Wikipedia, responde claro, bien estructurado y fácil de entender."
                },
                {
                    role: "user",
                    content: pregunta
                }
            ]
        });

        res.json({
            respuesta: completion.choices[0].message.content
        });

    } catch (error) {
        console.log("ERROR IA:", error);
        res.json({
            respuesta: "Error con la IA (revisa tu API KEY o créditos)"
        });
    }
});

// 🚀 servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en puerto " + PORT);
});