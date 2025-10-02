/* ZONA DE IMPORTACIÓN DE MÉTODOS */
import { getUserById } from "./firebase.js";

/* ZONA DE VARIABLES DECLARADAS */
const friendsContainer = document.getElementById("friends-container");
let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));
let amigosId = usuario.friends;

//MÉTODO QUE MUESTRA LOS AMIGOS EN EL CONTENEDOR DEL ASIDE EN LA VISTA DE COMPUTADORA
const mostrarAmigos = async () => {
  let amigosCards = "";

  //Si hay al menos un amigo, recorre el arreglo y los muestra
  if (amigosId.length > 0) {
    for (const amigoId of amigosId) {
      let amigo = await getUserById(amigoId);

      amigosCards += `
        <article class="card">
          <img
            src="${amigo.bio_pic}"
            alt=""
          />
          <a href="./profile.html?user_id=${amigo.id}" class="profile">
            <picture>
              <img
                src="${amigo.profile_pic}"
              />
            </picture>
            <span class="user-text">
              <span>${amigo.name}</span>
              <span>@${amigo.username}</span>
            </span>
          </a>
        </article>
      `;
    }
  }
  //Sino, un mensaje
  else {
    amigosCards = `<h4>No hay amigos que mostrar</h4>`;
  }

  //Agregamos el HTML
  friendsContainer.innerHTML = amigosCards;
};

//Ejecutamos el método
mostrarAmigos();
