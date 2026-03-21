require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
.then(()=>.log("🟢 Mongo conectado"))
.catch(err=>console.log(err));

// ================= MODELO =================
const User = mongoose.model("User", {
    username: String,
    password: String,
    codigo: String,
    verified: Boolean
});

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ================= REGISTER =================
app.post("/register", async (req, res) => {
    try{
        const { username, password } = req.body;

        const hash = await bcrypt.hash(password, 10);
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await User.findOne({ username });

        if(user){
            user.password = hash;
            user.codigo = codigo;
            user.verified = false;
        } else {
            user = new User({
                username,
                password: hash,
                codigo,
                verified: false
            });
        }

        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: username,
            subject: "Código de verificación",
            text: `Tu código es: ${codigo}`
        });

        console.log("Código:", codigo);

        res.send({ ok: true });

    }catch(e){
        console.log(e);
        res.status(500).send("error");
    }
});

// ================= VERIFY =================
app.post("/verify", async (req, res) => {
    const { username, codigo } = req.body;

    const user = await User.findOne({ username });

    if(!user) return res.send({ ok:false });

    if(user.codigo === codigo){
        user.verified = true;
        user.codigo = null;
        await user.save();

        return res.send({ ok:true });
    }

    res.send({ ok:false });
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if(!user) return res.send({ ok:false });

    if(!user.verified){
        return res.send({ ok:false, msg:"Verifica tu cuenta" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if(valid) return res.send({ ok:true });

    res.send({ ok:false });
});

// ================= SERVER =================
app.listen(process.env.PORT || 3000, ()=>{
    console.log("🚀 Servidor corriendo");
});