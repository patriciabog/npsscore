'use strict';
// Esperamos a que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionamos las estrellas
    const stars = document.querySelectorAll('.star');
    const otherCheckbox = document.getElementById('otherCheckbox');
    const otherText = document.getElementById('otherText');
    const form = document.getElementById('surveyForm');
    const confirmationMessage = document.getElementById('confirmationMessage'); // Mensaje de confirmación

    // Asignamos los eventos de clic a cada estrella
    stars.forEach((star, index) => {
        star.addEventListener('click', () => handleClickStar(index + 1));
    });

    // Función que se ejecuta cuando se hace clic en una estrella
    function handleClickStar(starValue) {
        console.log(`${starValue} estrella(s) seleccionada(s)`);
        highlightStars(starValue);  // Llamamos a la función para destacar las estrellas seleccionadas
    }

    // Función que resalta las estrellas seleccionadas y resetea las no seleccionadas
    function highlightStars(starValue) {
        // Reiniciamos todas las estrellas quitando la clase 'selected'
        stars.forEach(star => {
            star.classList.remove('selected');
        });

        // Agregamos la clase 'selected' a las estrellas desde 1 hasta la seleccionada
        for (let i = 1; i <= starValue; i++) {
            stars[i - 1].classList.add('selected');
        }
    }

    // Evento para habilitar o deshabilitar el campo de texto según si está seleccionado "Otro"
    otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            otherText.disabled = false;  // Habilita el campo de texto
            otherText.focus();  // Enfoca automáticamente el campo de texto
        } else {
            otherText.disabled = true;  // Deshabilita el campo de texto si "Otro" se desmarca
            otherText.value = "";  // Limpia el texto si se desmarca la opción
        }
    });

    // Manejo del envío del formulario
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Previene el envío por defecto para que puedas manejar los datos
        const selectedAspects = [];

        // Obtener las opciones seleccionadas
        document.querySelectorAll('input[name="aspect"]:checked').forEach(function (checkbox) {
            selectedAspects.push(checkbox.value);
        });
        // Si "Otro" está seleccionado, añadir el valor del campo de texto
        if (otherCheckbox.checked && otherText.value.trim() !== '') {
            selectedAspects.push('Otro: ' + otherText.value);
        }

        // Mostrar los valores seleccionados en la consola (puedes procesarlos o enviarlos al servidor)
        console.log('Aspectos seleccionados:', selectedAspects);

        // Mostrar mensaje de confirmación
        confirmationMessage.style.display = 'block'; // Muestra el mensaje
        confirmationMessage.textContent = 'Listo! Gracias por enviar tus respuestas.'; // Establece el texto del mensaje

        // Reiniciar el formulario
        form.reset();
        highlightStars(0);

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);
    });
});