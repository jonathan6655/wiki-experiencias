const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const transporter = require("../config/mail");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);
  const codigo = Math.floor(100000 + Math.random() * 900000);

  let user = await User.findOne({ email });

  if (user) {
    user.password = hash;
    user.codigo = codigo;
    user.verified = false;
  } else {
    user = new User({ email, password: hash, codigo });
  }

  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verificación",
    text: `Tu código es: ${codigo}`
  });

  res.json({ msg: "Código enviado 📧" });
});

// ================= VERIFY =================
router.post("/verify", async (req, res) => {
  const { email, codigo } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ error: "No existe" });

  if (user.codigo == codigo) {
    user.verified = true;
    user.codigo = null;
    await user.save();

    res.json({ ok: true });
  } else {
    res.json({ error: "Código incorrecto" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.json({ error: "No existe" });
  if (!user.verified) return res.json({ error: "Verifica tu correo" });

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) return res.json({ error: "Password incorrecto" });

  res.json({ ok: true });
});

module.exports = router;