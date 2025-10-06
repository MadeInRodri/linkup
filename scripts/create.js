/* ZONA DE IMPORTACIÓN DE MÉTODOS */
import {
  publicacionAlert,
  seleccionarImagenAlert,
  textoVacioAlert,
} from "./alerts.js";
import { subirImagen } from "./cloudinary.js";
import { createPost, getUserById } from "./firebase.js";

//Variables fuera de la publicación
const textarea = document.querySelector("#textarea-post");
const publishBtn = document.getElementById("publish-btn");
const uploadBtn = document.getElementById("upload-btn");
const fileInput = document.getElementById("file-input");
const container = document.querySelector("#post-container");
const profileImg = document.querySelector("#profile-img");

const usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));

//GUARDA EL ARCHIVO SUBIDO POR EL USUARIO
let selectedFile = null;

//CAMBIAR EL TEXTO DE LA PUBLICACIÓN DINAMICAMENTE
const changeText = () => {
  const textPost = document.querySelector("#p-post");
  textPost.innerHTML =
    `<strong>@${usuario.username} </strong>` + textarea.value;
};

//CAMBIAR LA IMÁGEN DE LA PUBLICACIÓN DINÁMICAMENTE
const changeImage = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById(
        "preview"
      ).innerHTML = `<img src="${ev.target.result}" width="200" />`;
    };
    reader.readAsDataURL(file);
  }
};

//PONER UNA PUBLICACIÓN POR DEFECTO AL CARGARSE LA PÁGINA CON LOS DATOS DEL USUARIO
const showUserPostPreview = () => {
  profileImg.src = usuario.profile_pic;
  let postHTML = `
          <section class="post">
    <div id="preview">
      <img src="${usuario.profile_pic}" alt="" />
    </div>
    <button class="profile">
      <picture>
        <img src="${usuario.profile_pic}" />
      </picture>
      <span class="user-text">
        <span>${usuario.name}</span>
        <span>@${usuario.username}</span>
      </span>
    </button>
    <div class="actions-post">
      <button class="button-post">
        <i class="fa-regular fa-heart"></i>
        <span>1,232</span>
      </button>
      <button class="button-post">
        <i class="fa-regular fa-comment"></i>
        <span>300</span>
      </button>
    </div>
    <div class="blur"></div>
  </section>
  <section class="description-post">
    <p id="p-post">
      <strong>@${usuario.username} </strong>
        ${usuario.description}
    </p>
  </section>
    `;
  container.innerHTML = postHTML;
};

//HACE VERIFICACIONES ANTES DE REALIZAR EL POST
const posting = async () => {
  if (!selectedFile) {
    seleccionarImagenAlert();
    return;
  }

  if (textarea.value == "") {
    textoVacioAlert();
    return;
  }

  let url = await subirImagen(selectedFile);
  userPost(usuario.id, textarea.value, url);
};

//CREA EL POST
const userPost = async (user_id, description, picture) => {
  const fecha = new Date();
  let post = {
    user_id: user_id,
    description: description,
    picture: picture,
    likes: [],
    comments: [],
    date: fecha,
  };

  let posteado = await createPost(post);
  if (posteado) {
    let actuUsario;
    actuUsario = await getUserById(usuario.id);
    localStorage.setItem("infoUsuarioActual", JSON.stringify(actuUsario));
    publicacionAlert();
  }
};

/* ZONA DE EJECUCIÓN DE MÉTODOS */
showUserPostPreview();
uploadBtn.addEventListener("click", () => fileInput.click());
textarea.addEventListener("input", changeText);
publishBtn.addEventListener("click", posting);
fileInput.addEventListener("change", changeImage);
