import { addCommentToPost } from "./firebase.js";

export function abrirModalComentarios(post, user) {
  const usuarioActual = JSON.parse(localStorage.getItem("infoUsuarioActual"));
  const userLiked = post.likes && post.likes.includes(usuarioActual.id);

  const likesCount = post.likes ? post.likes.length : 0;
  const commentsCount = post.comments ? post.comments.length : 0;

  const comentariosHTML = post.comments
    .map(
      (c) => `
    <p><strong>@${c.username}:</strong> ${c.text}</p>
  `
    )
    .join("");
  document.getElementById("commentsContent").innerHTML = `
    <div class ="contenedor-primero">
      <div class="contenedor-central">
        <section class="lado-post">
          <img src="${post.picture}" alt="Post visual" class="img-post">
        </section>
        <section class="lado-info">
          <div class="user">
            <img src="${user.profile_pic}" alt="Avatar usuario" class="avatar">
            <div class="info-usuario">
              <span class="nombre">${user.name}</span>
              <span class="username">@${user.username}</span>
            </div>
          </div>
          <div class="contenedor-comentarios">
            <div class="Contenedor-comment">
              <p>
                <strong>@${user.username}</strong> ${post.description}
              </p>
              <div class="comentarios">
                ${comentariosHTML}
              </div>
            </div>
          </div>
          
          <div class="acciones">
            <div class="iconos-interaccion">
              <i class="${
                userLiked ? "fa-solid" : "fa-regular"
              } fa-heart icono" style="${
    userLiked ? "color:#fd007a;" : ""
  }"></i>
              <span>${likesCount}</span>
              <i class="fa-regular fa-comment icono" id="closeComments"></i>
              <span>${commentsCount}</span>
            </div>
            <div class="campo-comentario">
              <input type="text" id="nuevoComentario" placeholder="Añade un comentario...">
              <button class="btn-publicar" id="btnPublicar">Publicar</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;

  // Acciones para el modal
  document.getElementById("commentsModal").style.display = "flex";
  document.getElementById("commentsModal").classList.add("active");

  document.getElementById("closeComments").onclick = function () {
    document.getElementById("commentsModal").style.display = "none";
    document.getElementById("commentsModal").classList.remove("active");
  };

  // hace que al tocar el fondo transparente se pueda salir (y no solo tener que ocupar el boton de comentarios)
  const modal = document.getElementById("commentsModal");
  modal.onclick = function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modal.classList.remove("active");
    }
  };

  // Evento para publicar comentario
  const btnPublicar = document.getElementById("btnPublicar");
  if (btnPublicar) {
    btnPublicar.onclick = async function () {
      const input = document.getElementById("nuevoComentario");
      const texto = input.value.trim();
      if (texto.length === 0) return;

      await addCommentToPost({
        postId: post.id,
        username: usuarioActual.username,
        text: texto,
      });

      // Recarga el modal para mostrar el nuevo comentario
      post.comments.push({ username: usuarioActual.username, text: texto });
      abrirModalComentarios(post, user);
    };
  }
}
