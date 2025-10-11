/* ZONA DE IMPORTACIONES */
import {
  getPosts,
  getPostsByDate,
  getUserById,
  likePost,
  unlikePost,
} from "./firebase.js";

//Consiguiendo cosas del html...
const mainContainer = document.querySelector("#publicaciones");

//Traemos al usuario del localhost...
let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));

//MÉTODO QUE SE ENCARGA DE LLENAR EL FEED CON LAS PUBLICACIONES DE TODOS
const cargarPosts = async () => {
  let posts = await getPostsByDate();
  let postsUserHTML = "";
  if (posts.length > 0) {
    for (const post of posts) {
      let user = await getUserById(post.user_id);
      let likes = post.likes.length;
      let comments = post.comments.length;
      const userLiked = post.likes.includes(usuario.id);

      postsUserHTML += `
      <article class="post-container">
        <section class="post">
          <img src="${post.picture}" alt="${post.description}" />
          <a href="./profile.html?user_id=${post.user_id}" class="profile">
            <picture>
              <img src="${user.profile_pic}" />
            </picture>
            <span class="user-text">
              <span>${user.name}</span>
              <span>@${user.username}</span>
            </span>
          </a>
          <div class="actions-post">
            <button class="button-post like-btn" id="${post.id}">
              <i class="${userLiked ? "fa-solid" : "fa-regular"} fa-heart"></i>
              <span>${likes}</span>
            </button>
            <button class="button-post comment-btn">
              <i class="fa-regular fa-comment"></i>
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
      </article>`;
    }

    //Agregamos el html al muro
    mainContainer.innerHTML = postsUserHTML;

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
          await unlikePost(postId, usuario.id);
          icon.classList.remove("fa-solid", "text-red-500");
          icon.classList.add("fa-regular");
          icon.style = "color:black";
          span.textContent = likesCount - 1;
        } else {
          // Dar like
          await likePost(postId, usuario.id);
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
    const index = Array.from(mainContainer.children).indexOf(postContainer);
    let posts = await getPostsByDate();
    let post = posts[index];
    let user = await getUserById(post.user_id);
    abrirModalComentarios(post, user);
  }
});

cargarPosts();
