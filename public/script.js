const API = "/api";

/* ================= REGISTER ================= */
async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("passReg").value;

    if (!email || !password) {
        alert("Llena todos los campos");
        return;
    }

    await fetch(API + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    alert("📧 Código enviado a tu correo");
}

/* ================= VERIFY ================= */
async function verify() {
    const email = document.getElementById("email").value;
    const codigo = document.getElementById("codigo").value;

    if (!codigo) {
        alert("Ingresa el código");
        return;
    }

    const res = await fetch(API + "/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, codigo })
    });

    const data = await res.json();

    if (data.ok) {
        alert("✅ Cuenta verificada");
    } else {
        alert("❌ Código incorrecto");
    }
}

/* ================= LOGIN ================= */
async function login() {
    const email = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.ok) {
        window.location.href = "app.html";
    } else {
        alert("❌ Error al iniciar sesión");
    }
}