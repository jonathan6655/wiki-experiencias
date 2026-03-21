require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// 🔥 conectar DB
connectDB();

// 🔥 rutas
app.use("/api", authRoutes);

// 🚀 servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en puerto " + PORT);
});