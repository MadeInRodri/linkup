import { getUserById } from "./firebase.js";

const friendsContainer = document.getElementById("friends-container");
let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));
let amigosId = usuario.friends;

const mostrarAmigos = async () => {
  let amigosCards = "";
  if (amigosId.length > 0) {
    for (const amigoId of amigosId) {
      let amigo = await getUserById(amigoId);
      console.log(amigo);

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

  friendsContainer.innerHTML = amigosCards;
};

mostrarAmigos();
