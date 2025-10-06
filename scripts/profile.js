import { agregarAmigoAlert, eliminarAmigoAlert } from "./alerts.js";
import {
  addFriend,
  getPostsByUser,
  getUserById,
  likePost,
  removeFriend,
  unlikePost,
} from "./firebase.js";

const mainContainer = document.querySelector("main");
// Obtener parámetros de la URL
const params = new URLSearchParams(window.location.search);

// Capturar el user_id
const userId = params.get("user_id");
let miUsuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));

//Si el usuario se mete a un perfil que sea suyo, pues redirige a su perfil
if (userId == miUsuario.id) {
  window.location.href = "/views/myProfile.html";
}

const cargarUsuario = async () => {
  let usuario = await getUserById(userId);
  let amigos = usuario.friends.length;
  let esAmigo = miUsuario.friends.includes(usuario.id);
  console.log(`Es mi amigo: ${esAmigo}`);
  let perfilUsuarioHTML = `
    <article class="profile-container">
  <section class="photo">
    <picture>
      <img src="${usuario.profile_pic}" />
    </picture>
  </section>
  <section class="profile-data">
    <h2>${usuario.name}</h2>
    <h3>@${usuario.username}</h3>
    <p>${usuario.description}</p>
    <div class="buttons-container">
    <button class="profile-button">
      <i class="fa-solid fa-user-group"></i>
      <span id="span-friends">${amigos}</span>
    </button>
    <button class="profile-button" id="friend-button">
      <i id="icon-friend" class="fa-solid ${esAmigo ? "fa-x" : "fa-plus"}"></i>
      <span id="friend-button-text">${esAmigo ? "Eliminar" : "Agregar"}</span>
    </button>
    </div>
  </section>
</article>
  `;
  mainContainer.innerHTML = perfilUsuarioHTML;

  await cargarPostsUsuario(usuario);

  const friendBtn = document.getElementById("friend-button");

  friendBtn.addEventListener("click", async () => {
    const friendBtnText = document.getElementById("friend-button-text");
    const icon = document.getElementById("icon-friend");
    const span = document.getElementById("span-friends");
    let friendCount = parseInt(span.textContent);
    const alreadyFriend = icon.classList.contains("fa-x");

    if (alreadyFriend) {
      await removeFriend(miUsuario.id, userId);
      await removeFriend(userId, miUsuario.id);
      eliminarAmigoAlert();
      icon.classList.remove("fa-x");
      icon.classList.add("fa-plus");
      friendBtnText.textContent = "Agregar";
      span.textContent = friendCount - 1;

      miUsuario.friends = miUsuario.friends.filter((id) => id !== userId);
    } else {
      await addFriend(miUsuario.id, userId);
      await addFriend(userId, miUsuario.id);
      agregarAmigoAlert();
      icon.classList.remove("fa-plus");
      icon.classList.add("fa-x");
      friendBtnText.textContent = "Eliminar";
      span.textContent = friendCount + 1;

      miUsuario.friends.push(userId);
    }
    localStorage.setItem("infoUsuarioActual", JSON.stringify(miUsuario));
  });
};

//MÉTODO QUE TRAE LOS POST DEL USUARIO DE LA BASE Y LOS IMPRIME EN EL MURO PERSONAL
const cargarPostsUsuario = async (myUser) => {
  let posts = await getPostsByUser(userId);
  let user = myUser;
  let postsUserHTML = "";
  if (posts.length > 0) {
    posts.forEach((post) => {
      let likes = post.likes.length;
      let comments = post.comments.length;
      const userLiked = post.likes.includes(userId);
      postsUserHTML += `
                <article class="post-container">
  <section class="post">
    <img src="${post.picture}" alt="${post.description}" />
    <button class="profile">
      <picture>
        <img src="${user.profile_pic}" />
      </picture>
      <span class="user-text">
        <span>${user.name}</span>
        <span>@${user.username}</span>
      </span>
    </button>
    <div class="actions-post">
      <button class="button-post like-btn" id="${post.id}">
        <i class="${userLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
        <span>${likes}</span>
      </button>
      <button class="button-post comment-btn">
        <i class="fa-regular fa-comment "></i>
        <span>${comments}</span>
      </button>
    </div>
    <div class="blur"></div>
  </section>
  <section class="description-post">
    <p>
      <strong>@${user.username}</strong> ${post.description}
    </p>
  </section>
</article>
            `;
    });

    //Agregamos el html al muro
    mainContainer.innerHTML += postsUserHTML;

    //Pasamos a detectar si el usuario le da al botón de like
    document.querySelectorAll(".like-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const postId = e.currentTarget.id;
        const icon = btn.querySelector("i");
        const span = btn.querySelector("span");
        let likesCount = parseInt(span.textContent);

        // Revisar si el usuario ya dio like (basado en clase del icono)
        const alreadyLiked = icon.classList.contains("fa-solid");

        if (alreadyLiked) {
          // Quitar like
          await unlikePost(postId, miUsuario.id);
          icon.classList.remove("fa-solid", "text-red-500");
          icon.classList.add("fa-regular");
          icon.style = "color:black";
          span.textContent = likesCount - 1;
        } else {
          // Dar like
          await likePost(postId, miUsuario.id);
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style = "color:red";
          span.textContent = likesCount + 1;
        }
      });
    });
  }
};

import { abrirModalComentarios } from "./comments.js";

// Delegación para abrir el modal al hacer click en el botón de comentario
mainContainer.addEventListener("click", async function (e) {
  const commentBtn = e.target.closest(".comment-btn");
  if (commentBtn) {
    const postContainer = commentBtn.closest(".post-container");
    const postContainers = Array.from(mainContainer.querySelectorAll(".post-container"));
    const index = postContainers.indexOf(postContainer);
    let posts = await getPostsByUser(userId);
    let post = posts[index];
    let user = await getUserById(userId);
    abrirModalComentarios(post, user);
  }
});

cargarUsuario();


