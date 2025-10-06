
export function abrirModalComentarios(post, user) {
  const comentariosHTML = post.comments
    .map(
      (c) => `
    <p><strong>${c.username}:</strong> ${c.text}</p>
  `
    )
    .join("");

  document.getElementById("commentsContent").innerHTML = `
    <div>
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
              <i class="fa-regular fa-heart icono"></i>
              <i class="fa-regular fa-comment icono" id="closeComments"></i>
            </div>
            <div class="campo-comentario">
              <input type="text" placeholder="Añade un comentario...">
              <button class="btn-publicar">Publicar</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `;
  document.getElementById("commentsModal").style.display = "flex";
  document.getElementById("commentsModal").classList.add("active");

  document.getElementById("closeComments").onclick = function () {
    document.getElementById("commentsModal").style.display = "none";
    document.getElementById("commentsModal").classList.remove("active");
  };
}

