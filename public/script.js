const API = "/api"; // 🔥 importante

async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("passReg").value;

    await fetch(API + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    alert("Código enviado 📧");
}

async function verify() {
    const email = document.getElementById("email").value;
    const codigo = document.getElementById("codigo").value;

    const res = await fetch(API + "/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, codigo })
    });

    const data = await res.json();

    if (data.ok) alert("Verificado ✅");
    else alert("Código incorrecto ❌");
}

async function login() {
    const email = document.getElementById("user").value;
    const password = document.getElementById("pass").value;

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.ok) window.location.href = "app.html";
    else alert("Error ❌");
}