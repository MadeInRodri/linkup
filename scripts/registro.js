import { registroExitosoAlert, registroIncorrectoAlert } from "./alerts.js";
import { createAccount, getUserById } from "./firebase.js";

const nombreInput = document.getElementById("nombre");
const apellidoInput = document.getElementById("apellido");
const usuarioInput = document.getElementById("usuario");
const correoInput = document.getElementById("correo");
const contraInput = document.getElementById("contra");

const errorNombre = document.getElementById("errorNombre");
const errorApellido = document.getElementById("errorApellido");
const errorUsuario = document.getElementById("errorUsuario");
const errorCorreo = document.getElementById("errorCorreo");
const errorContra = document.getElementById("errorContra");

const soloLetras = /^[a-zA-Z\s]+$/;
const usuarioRegex = /^[a-zA-Z0-9]+$/;
const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const contraRegex = /^[a-zA-Z0-9-]+$/;

const createUser = async (
  name,
  username,
  email,
  password,
  description = "Hola, estoy usando LinkUp!",
  profile_pic = "https://res.cloudinary.com/diogirqun/image/upload/v1759378125/usuario_mswads.png",
  bio_pic = "https://res.cloudinary.com/diogirqun/image/upload/v1759378247/luke-chesser-pJadQetzTkI-unsplash_mpmrjs.jpg"
) => {
  let user = {
    name: name,
    username: username,
    email: email,
    password: password,
    description: description,
    friends: [],
    profile_pic: profile_pic,
    bio_pic: bio_pic,
  };

  let cuenta = await createAccount(user);

  if (cuenta == false) {
    registroIncorrectoAlert();
    return;
  }

  let usuario = await getUserById(cuenta);

  localStorage.clear();
  localStorage.setItem("infoUsuarioActual", JSON.stringify(usuario));
  registroExitosoAlert(usuario.name);
};

function validarNombre() {
  const nombre = nombreInput.value.trim();
  if (nombre === "") {
    errorNombre.textContent = "El nombre está vacío.";
  } else if (!soloLetras.test(nombre)) {
    errorNombre.textContent = "El nombre solo debe contener letras y espacios.";
  } else {
    errorNombre.textContent = "";
  }
}

function validarApellido() {
  const apellido = apellidoInput.value.trim();
  if (apellido === "") {
    errorApellido.textContent = "El apellido está vacío.";
  } else if (!soloLetras.test(apellido)) {
    errorApellido.textContent =
      "El apellido solo debe contener letras y espacios.";
  } else {
    errorApellido.textContent = "";
  }
}

function validarUsuario() {
  const usuario = usuarioInput.value.trim();
  if (usuario === "") {
    errorUsuario.textContent = "El usuario está vacío.";
  } else if (!usuarioRegex.test(usuario)) {
    errorUsuario.textContent =
      "El usuario solo debe contener letras y números.";
  } else {
    errorUsuario.textContent = "";
  }
}

function validarCorreo() {
  const correo = correoInput.value.trim();
  if (correo === "") {
    errorCorreo.textContent = "El correo está vacío.";
  } else if (!correoRegex.test(correo)) {
    errorCorreo.textContent = "El correo no tiene un formato válido.";
  } else {
    errorCorreo.textContent = "";
  }
}

function validarContra() {
  const contra = contraInput.value.trim();
  if (contra === "") {
    errorContra.textContent = "La contraseña está vacía.";
  } else if (!contraRegex.test(contra)) {
    errorContra.textContent =
      "La contraseña solo debe contener letras, números y guiones.";
  } else {
    errorContra.textContent = "";
  }
}

// Eventos en tiempo real
nombreInput.addEventListener("input", validarNombre);
apellidoInput.addEventListener("input", validarApellido);
usuarioInput.addEventListener("input", validarUsuario);
correoInput.addEventListener("input", validarCorreo);
contraInput.addEventListener("input", validarContra);

// Validación final al enviar
document
  .getElementById("registroForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    validarNombre();
    validarApellido();
    validarUsuario();
    validarCorreo();
    validarContra();

    if (
      errorNombre.textContent ||
      errorApellido.textContent ||
      errorUsuario.textContent ||
      errorCorreo.textContent ||
      errorContra.textContent
    ) {
      return;
    }

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const usuario = usuarioInput.value.trim();
    const correo = correoInput.value.trim().toLowerCase();
    const contra = contraInput.value.trim();

    await createUser(`${nombre} ${apellido}`, usuario, correo, contra);
  });
