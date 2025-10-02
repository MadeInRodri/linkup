/* ALERTAS UTILIZADAS EN TODO EL PROGRAMA*/

export const publicacionAlert = () => {
  Swal.fire({
    title: "¡La publicación ha sido creada con éxito!",
    text: "Te redirigiremos a tu muro para que puedas verla",
    icon: "success",
    confirmButtonText: "Ver mi perfil",
  }).then((result) => {
    if (result.isConfirmed) {
      // 👇 Aquí haces la redirección
      window.location.href = "/views/myProfile.html";
    }
  });
};

export const eliminarAmigoAlert = () => {
  Swal.fire({
    title: "¡Has eliminado a este amigo de tu lista de amigos!",
    text: "Esperamos que todo esté bien entre ustedes...",
    icon: "success",
    confirmButtonText: "Ok",
  });
};

export const agregarAmigoAlert = () => {
  Swal.fire({
    title: "¡Tienes un nuevo amigo!",
    text: "Felicidades por vuestra nueva amistad",
    icon: "success",
    confirmButtonText: "Ok",
  });
};

export const actualizacionAlert = () => {
  Swal.fire({
    title: "¡Tus datos han sido actualizados con éxito!",
    text: "Te redirigiremos a tu muro para que puedas verlos",
    icon: "success",
    confirmButtonText: "Ver mi perfil",
  }).then((result) => {
    if (result.isConfirmed) {
      // 👇 Aquí haces la redirección
      window.location.href = "/views/myProfile.html";
    }
  });
};

export const eliminarPostAlert = () => {
  Swal.fire({
    title: "¡El post se ha eliminado correctamente!",
    text: "Deberías publicar algo nuevo...",
    icon: "success",
    confirmButtonText: "Ok",
  });
};

export const seleccionarImagenAlert = () => {
  Swal.fire({
    title: "¡Debes de seleccionar una imágen!",
    text: "Por defecto se usa la imagen de tu biografía, selecciona otra",
    icon: "error",
    confirmButtonText: "Ok",
  });
};

export const textoVacioAlert = () => {
  Swal.fire({
    title: "¡El texto está vacío!",
    text: "No puedes subirlo sin escribir nada...",
    icon: "error",
    confirmButtonText: "Ok",
  });
};

export const textoVacioParamAlert = (param) => {
  Swal.fire({
    title: "¡El texto está vacío!",
    text: `No puedes dejar ${param} vacío...`,
    icon: "error",
    confirmButtonText: "Ok",
  });
};
