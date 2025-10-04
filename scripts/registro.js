document.getElementById("loginForm").addEventListener("submit", function (e) {
  const correo = document.getElementById("correo").value.trim();
  const contra = document.getElementById("contra").value.trim();

  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contraRegex = /^[a-zA-Z0-9-]+$/;
  const soloLetras = /^[a-zA-Z\s]+$/;
  const usuario = /^[a-zA-Z0-9]+$/;

  let errores = [];

  if (!soloLetras.test(nombre)) {
    errores.push("El nombre solo debe contener letras y espacios.");
  }

  if (!soloLetras.test(apellido)) {
    errores.push("El apellido solo debe contener letras y espacios.");
  }

  if (!usuario.test(usuario)) {
    errores.push("El usuario solo debe contener letras y números.");
  }

  if (correo == "") {
    errores.push("El correo esta vacio");
  }

  if (contra == "") {
    errores.push("La contraseña esta vacia");
  }

  if (!correoRegex.test(correo)) {
    errores.push("El correo no tiene un formato válido.");
  }

  if (!contraRegex.test(contra)) {
    errores.push("La contraseña solo debe contener letras, números y guiones.");
  }

  if (errores.length > 0) {
    e.preventDefault(); // ESto evita el envío del formulario
    alert(errores.join("\n")); // Para mostrar errores
  }
});
