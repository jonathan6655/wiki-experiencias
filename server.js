require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const articleRoutes = require("./routes/articles");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", authRoutes);
app.use("/api/articles", articleRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🟢 Mongo conectado"))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Servidor listo");
});