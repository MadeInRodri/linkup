/* ZONA DE IMPORTACIONES */
import { eliminarPostAlert } from "./alerts.js";
import {
  deletePost,
  getPostsByUser,
  likePost,
  unlikePost,
} from "./firebase.js";

//Consiguiendo cosas del html...
const mainContainer = document.querySelector("main");
const userId = localStorage.getItem("idUsuario");

//MÉTODO QUE CARGA LA INFO DEL USUARIO DEL LOCALSTORAGE Y LA COLOCA EN EL ENCABEZADO
const cargarUsuario = async () => {
  let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));
  let amigos = usuario.friends.length;

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
      <span>${amigos}</span>
    </button>

    <a href="./myProfileInfo.html" class="profile-button">
        <i class="fa-solid fa-pen"></i>
      <span>Modificar Perfil</span>
    </a>
    </div>
  </section>
</article>
  `;
  mainContainer.innerHTML += perfilUsuarioHTML;

  cargarPostsUsuario(usuario);
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
        <i class="fa-regular fa-comment"></i>
        <span>${comments}</span>
      </button>
      <button class="button-post delete-btn" id="${post.id}">
        <i class="fa-solid fa-xmark"></i>
        <span>Eliminar</span>
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
          await unlikePost(postId, userId);
          icon.classList.remove("fa-solid", "text-red-500");
          icon.classList.add("fa-regular");
          icon.style = "color:black";
          span.textContent = likesCount - 1;
        } else {
          // Dar like
          await likePost(postId, userId);
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
          icon.style = "color:red";
          span.textContent = likesCount + 1;
        }
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const postElement = e.target.closest(".post-container");
        const postId = e.currentTarget.id;
        let deleted = await deletePost(postId);
        if (deleted) {
          eliminarPostAlert();
          postElement.remove();
        }
      });
    });
  } else {
    postsUserHTML = "<h3>No has hecho ninguna publicación</h3>";

    mainContainer.innerHTML += postsUserHTML;
  }
};

import { abrirModalComentarios } from "./comments.js";
import { getUserById } from "./firebase.js";

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

/* ZONA DE EJECUCIÓN DE MÉTODOS */
document.addEventListener("DOMContentLoaded", cargarUsuario);
