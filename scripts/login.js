document.getElementById("loginForm").addEventListener("submit", function (e) {
  const correo = document.getElementById("correo").value.trim();
  const contra = document.getElementById("contra").value.trim();

  const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contraRegex = /^[a-zA-Z0-9-]+$/;

  let errores = [];

  if (correo == "") {
    errores.push("El correo esta vacio");
  }

  if (contra == "") {
    errores.push("El correo esta vacio");
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
