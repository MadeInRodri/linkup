import {
  loginExitosoAlert,
  loginIncorrectoAlert,
  usuarioInexistenteAlert,
} from "./alerts.js";
import { loginUser, getUserById } from "./firebase.js";

/* ZONA EN DESARROLLO, ESTA PANTALLA YA NO ESTÁ EN ZONA DE PRUEBAS */

//Método para logearse (pantalla de login)
const login = async (email, password) => {
  let id = await loginUser(email, password);

  if (id == false) {
    loginIncorrectoAlert();
    return;
  }

  if (id == null) {
    usuarioInexistenteAlert();
    return;
  }

  let usuario = await getUserById(id);

  console.log(id);
  //Limpiamos por si había una sesión
  localStorage.clear();
  //Guardamos id y datos del usuario para usarlos más tarde
  localStorage.setItem("idUsuario", id);
  localStorage.setItem("infoUsuarioActual", JSON.stringify(usuario));
  loginExitosoAlert(usuario.name);
};

//Aqui empieza el login
const correoInput = document.getElementById("correo");
const contraInput = document.getElementById("contra");
const errorCorreo = document.getElementById("errorCorreo");
const errorContra = document.getElementById("errorContra");

const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const contraRegex = /^[a-zA-Z0-9-]+$/;

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
correoInput.addEventListener("input", validarCorreo);
contraInput.addEventListener("input", validarContra);

// Validación final al enviar
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  validarCorreo();
  validarContra();

  if (errorCorreo.textContent || errorContra.textContent) {
    return; // bloquea envío si hay errores
  }
  const correo = correoInput.value.trim();
  const contra = contraInput.value.trim();

  login(correo, contra);
});
