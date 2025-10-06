/* ZONA DE IMPORTACIÓN DE MÉTODOS */
import { actualizacionAlert, textoVacioParamAlert } from "./alerts.js";
import { subirImagen } from "./cloudinary.js";
import { getUserById, updateUser } from "./firebase.js";

/* ZONA DE VARIABLES DECLARADAS */
const profileImageButton = document.querySelector("#profile-img-button");
const profileInput = document.querySelector("#profile-input");
const bioImageButton = document.querySelector("#bio-img-button");
const bioInput = document.querySelector("#bio-input");
const saveButton = document.querySelector("#save-button");

const profile_img = document.querySelector("#profile-img");
const bio_img = document.querySelector("#bio-img");
const name = document.querySelector("#name");
const description = document.querySelector("#description");

//Info del usuario en localstorage
let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));

//Archivos que el usuario va a seleccionar
let selectedProfile = null;
let selectedBio = null;

//Cargamos los datos con la información que ya tenía el usuario
const cargarDatos = () => {
  profile_img.src = usuario.profile_pic;
  bio_img.src = usuario.bio_pic;
  name.value = usuario.name;
  description.value = usuario.description;
};

//Si el usuario hace click en su imagen de perfil, puede cambiarla por otra
const changeImageProfile = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedProfile = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById(
        "profile-preview"
      ).innerHTML = `<img src="${ev.target.result}" id="profile-img" class="img-profile" />`;
    };
    reader.readAsDataURL(file);
  }
};

//Lo mismo con la de la biografía
const changeImageBio = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedBio = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      document.getElementById(
        "bio-preview"
      ).innerHTML = `<img src="${ev.target.result}" id="bio-img" class="img-profile"  />`;
    };
    reader.readAsDataURL(file);
  }
};

//Una vez se haga click en el botón de guardar, guardamos los cambios
const guardarCambios = async () => {
  let bioPic = usuario.bio_pic;
  let profilePic = usuario.profile_pic;

  //Validaciones
  if (name.value == "") {
    textoVacioParamAlert("tu nombre");
    return;
  }

  if (description.value == "") {
    textoVacioParamAlert("tu descripción");
    return;
  }

  saveButton.disabled = true;

  //Si el usuario ha subido imágenes, las subimos para actualizar todo
  if (selectedBio) {
    let url = await subirImagen(selectedBio);
    bioPic = url;
  }

  if (selectedProfile) {
    let url = await subirImagen(selectedProfile);
    profilePic = url;
  }

  //El método que actualiza
  let esActualizado = await updateUser(
    usuario.id,
    name.value,
    description.value,
    profilePic,
    bioPic
  );
  saveButton.disabled = false;

  //Si todo salió bien, el usuario será redirigido a su perfil
  if (esActualizado) {
    usuario = await getUserById(usuario.id);
    localStorage.setItem("infoUsuarioActual", JSON.stringify(usuario));
    actualizacionAlert();
  }
};

/* ZONA DE EJECUCIÓN DE MÉTODOS */
cargarDatos();
profileImageButton.addEventListener("click", () => profileInput.click());
bioImageButton.addEventListener("click", () => bioInput.click());
profileInput.addEventListener("change", changeImageProfile);
bioInput.addEventListener("change", changeImageBio);
saveButton.addEventListener("click", guardarCambios);
