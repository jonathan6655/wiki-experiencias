const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const transporter = require("../config/mail");

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, 10);
        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        let user = await User.findOne({ email });

        if (user) {
            user.password = hash;
            user.codigo = codigo;
            user.verified = false;
        } else {
            user = new User({
                email,
                password: hash,
                codigo
            });
        }

        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Código de verificación",
            text: `Tu código es: ${codigo}`
        });

        console.log("Código:", codigo);

        res.send({ ok: true });

    } catch (error) {
        console.log("ERROR REGISTER:", error);
        res.status(500).send("error");
    }
});

/* ================= VERIFY ================= */
router.post("/verify", async (req, res) => {
    const { email, codigo } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.send({ ok: false });

    if (user.codigo === codigo) {
        user.verified = true;
        user.codigo = null;
        await user.save();

        return res.send({ ok: true });
    }

    res.send({ ok: false });
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.send({ ok: false });

    if (!user.verified) {
        return res.send({ ok: false, msg: "Verifica tu cuenta" });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (valid) return res.send({ ok: true });

    res.send({ ok: false });
});

module.exports = router;