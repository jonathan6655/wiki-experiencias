const email = localStorage.getItem("email") || "demo@gmail.com";

// CAMBIO DE VISTAS
function showView(view){
    document.querySelectorAll(".view").forEach(v => v.style.display="none");
    document.getElementById(view).style.display="block";

    if(view==="inicio") cargarPosts();
    if(view==="perfil") cargarPerfil();
}

// PERFIL
function cargarPerfil(){
    document.getElementById("email").innerText = "Email: " + email;
}

// CREAR POST
async function crearPost(){

    const post = {
        titulo: document.getElementById("titulo").value,
        contenido: document.getElementById("contenido").value,
        imagen: document.getElementById("imagen").value,
        autor: email
    };

     const res = await fetch('https://TU-BACKEND.fly.dev/api/...',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(post)
    });

    alert("Artículo publicado 🚀");
    showView("inicio");
}

// CARGAR POSTS
async function cargarPosts(){

    const res = await fetch('https://TU-BACKEND.fly.dev/api/...');
    const posts = await res.json();

    const contenedor = document.getElementById("posts");
    contenedor.innerHTML="";

    posts.forEach(p=>{
        contenedor.innerHTML += `
        <div class="post">
            <h2>${p.titulo}</h2>
            <p>${p.contenido}</p>
            ${p.imagen ? `<img src="${p.imagen}">` : ""}
            <small>${p.autor}</small>
        </div>
        `;
    });
}

// IA (simple simulada)
async function usarIA(){

    const pregunta = document.getElementById("pregunta").value;
    const respuestaHTML = document.getElementById("respuesta");

    respuestaHTML.innerText = "Pensando... 🤖";

    try{
        const res = await fetch('https://TU-BACKEND.fly.dev/api/ia', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ pregunta })
        });

        const data = await res.json();

        respuestaHTML.innerText = data.respuesta;

    }catch(err){
        respuestaHTML.innerText = "Error conectando con la IA";
    }
}

// LOGOUT
function logout(){
    localStorage.clear();
    location.href="index.html";
}

// INICIO
showView("inicio");