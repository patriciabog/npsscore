'use strict';
// main.js

'use strict';
// Esperamos a que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', function () {
    // Seleccionamos las estrellas
    const stars = document.querySelectorAll('.star');
    const otherCheckbox = document.getElementById('otherCheckbox');
    const otherText = document.getElementById('otherText');
    const form = document.getElementById('surveyForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    let selectedStars = 0; // Variable para almacenar la calificación de estrellas

    // Asignamos los eventos de clic a cada estrella
    stars.forEach((star, index) => {
        star.addEventListener('click', () => handleClickStar(index + 1));
    });

    // Función que se ejecuta cuando se hace clic en una estrella
    function handleClickStar(starValue) {
        console.log(`${starValue} estrella(s) seleccionada(s)`);
        selectedStars = starValue; // Guardamos la calificación seleccionada
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

        // Mostrar los valores seleccionados en la consola
        console.log('Aspectos seleccionados:', selectedAspects);

        // Crear un objeto con los datos para enviar
        const data = {
            stars: selectedStars,
            aspects: selectedAspects
        };

        // Enviar los datos a Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbz3v9PtssYlFKhK382NbRbSLAMgmMeM54gl9A3J4fz2qYiMBo59j9CUQChrfXf13W4o/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // Convertir los datos a JSON
        })
            .then(response => response.json()) // Convertir la respuesta a JSON
            .then(result => {
                console.log('Respuesta del servidor:', result);
                // Mostrar mensaje de confirmación
                confirmationMessage.style.display = 'block';  // Muestra el mensaje
                confirmationMessage.textContent = 'Listo! Gracias por enviar tus respuestas.'; // Establece el texto del mensaje

                // Reiniciar el formulario
                form.reset();
                highlightStars(0); // Reinicia la selección de estrellas
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                alert('Hubo un problema al enviar tus respuestas. Intenta nuevamente.');
            });
    });
});



