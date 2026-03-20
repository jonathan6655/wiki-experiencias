const API = "https://wiki-experiencias.onrender.com/api";

// ================= UI =================
function mostrar(vista){
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    document.getElementById(vista).classList.add("active");

    if(vista==="feed") cargarArticulos();
    if(vista==="perfil") cargarPerfil();
}

function logout(){
    localStorage.clear();
    window.location.href="index.html";
}

// ================= PERFIL =================
function cargarPerfil(){
    const user = localStorage.getItem("user");
    document.getElementById("usuarioActual").innerText = user;

    cargarMisPosts();
}

async function cargarMisPosts(){
    const res = await fetch(API+"/articles");
    const data = await res.json();

    const user = localStorage.getItem("user");

    const mis = data.filter(a => a.author === user);

    const div = document.getElementById("misPosts");
    div.innerHTML="";

    mis.forEach(a=>{
        div.innerHTML += `<div class="article">${a.title}</div>`;
    });
}

// ================= CREAR =================
async function crearArticulo(){
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").value;

    await fetch(API+"/articles",{
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": localStorage.getItem("token")
        },
        body:JSON.stringify({
            title,
            content,
            image,
            author: localStorage.getItem("user")
        })
    });

    alert("Publicado 🚀");
    mostrar("feed");
}

// ================= FEED =================
async function cargarArticulos(){
    const res = await fetch(API+"/articles");
    const data = await res.json();

    const cont = document.getElementById("articles");
    cont.innerHTML="";

    data.reverse().forEach(a=>{
        cont.innerHTML += `
        <div class="article">
            <h3>${a.title}</h3>
            <p>${a.content}</p>

            ${a.image ? `<img src="${a.image}" class="post-img">` : ""}

            <div class="actions">
                <span onclick="like('${a._id}')" class="like">❤️ ${a.likes || 0}</span>
            </div>
        </div>
        `;
    });
}

// ================= LIKE =================
async function like(id){
    const res = await fetch(API+"/articles/like/"+id,{
        method:"POST"
    });

    const data = await res.json();
    cargarArticulos();
}

// ================= IA =================
async function preguntarIA(){
    const pregunta = document.getElementById("pregunta").value;

    const chat = document.getElementById("chat");

    chat.innerHTML += `<div class="msg-user">${pregunta}</div>`;

    const res = await fetch(API+"/ia",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({pregunta})
    });

    const data = await res.json();

    chat.innerHTML += `<div class="msg-bot">${data.respuesta}</div>`;
}