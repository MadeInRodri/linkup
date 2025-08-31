document.addEventListener("DOMContentLoaded", function () {
    const enlacesComentarios = document.querySelectorAll(".comentarios");

    enlacesComentarios.forEach(function (enlace) {
        const card = enlace.closest(".card");
        const cardBody = card.querySelectorAll(".card-body")[1];
        const contenidoOriginal = cardBody.innerHTML;

        enlace.addEventListener("click", function () {

            if (!enlace.classList.contains("abierto")) {
                cardBody.innerHTML = `
            <h6 class="mb-3 text-white">Comentarios</h6>
            <div class="comentarios-container">
                <p class="comentario-pill">@Santal_33: ¡Qué gran momento! 😍✨</p>
                <p class="comentario-pill">@Aqua_dGio: Volvamos a jugar juntos 🧘🏻‍♂️</p>
                <p class="comentario-pill">@Santal_33: ¡Qué gran momento! 😍✨</p>
                <p class="comentario-pill">@Aqua_dGio: Volvamos a jugar juntos 🧘🏻‍♂️</p>            
            </div>
        `;
                enlace.classList.add("abierto");
            }
            else {
                cardBody.innerHTML = contenidoOriginal;
                enlace.classList.remove("abierto");
            }
        });
    });
});
