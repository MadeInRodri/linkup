import { cerrarSesionAlert, noUsuarioAlert } from "./alerts.js";

let usuario = JSON.parse(localStorage.getItem("infoUsuarioActual"));
if (!usuario) {
  noUsuarioAlert();
}

const salir = document.querySelector("#salir");
const cerrarSesion = () => {
  localStorage.clear();
  cerrarSesionAlert();
};

salir.addEventListener("click", cerrarSesion);
