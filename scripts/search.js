/* ZONA DE IMPORTACIÓN DE MÉTODOS */
import { getUsers } from "./firebase.js";

/* ZONA DE DECLARACIÓN DE VARIABLES */
let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));
const inputBuscar = document.getElementById("search-input");
const friendsContainer = document.getElementById("search-friends-container");

let usuarios = [];

//Busca todos los usuarios de la base de datos
const buscarUsuarios = async () => {
  usuarios = await getUsers();
  // console.log(usuarios);
};

//Filtramos los usuarios por lo que vayan escribiendo en el input
const filtrarUsuarios = (texto) => {
  const filtro = texto.toLowerCase();

  return usuarios.filter(
    (u) =>
      u.name.toLowerCase().includes(filtro) ||
      u.username.toLowerCase().includes(filtro)
  );
};

//Mostramos el resultado del filtrado
const mostrarResultados = (lista) => {
  friendsContainer.innerHTML = "";

  if (lista.length === 0) {
    friendsContainer.innerHTML = "<h3>No se encontraron usuarios</h3>";
    return;
  }

  lista.forEach((u) => {
    const userHTML = `
        <article class="card">
          <img
            src="${u.bio_pic}"
            alt=""
          />
          <a href="./profile.html?user_id=${u.id}" class="profile">
            <picture>
              <img
                src="${u.profile_pic}"
              />
            </picture>
            <span class="user-text">
              <span>${u.name}</span>
              <span>@${u.username}</span>
            </span>
          </a>
        </article>
    `;
    friendsContainer.innerHTML += userHTML;
  });
};

/* ZONA DE EJECUCIÓN DE MÉTODOS */
buscarUsuarios();
inputBuscar.addEventListener("input", (e) => {
  const texto = e.target.value.trim();
  const resultados = filtrarUsuarios(texto);

  mostrarResultados(resultados);
});
