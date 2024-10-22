'use strict';
/// Manejo del envío del formulario
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Previene el envío por defecto

    const selectedAspects = [];

    // Obtener las opciones seleccionadas
    document.querySelectorAll('input[name="aspect"]:checked').forEach(function (checkbox) {
        selectedAspects.push(checkbox.value);
    });

    // Si "Otro" está seleccionado, añadir el valor del campo de texto
    if (otherCheckbox.checked && otherText.value.trim() !== '') {
        selectedAspects.push('Otro: ' + otherText.value);
    }

    // Obtener la calificación de estrellas
    const starRating = stars.filter(star => star.classList.contains('selected')).length;

    // Aquí se enviarán los datos a la Google Sheet
    fetch('https://script.google.com/macros/s/AKfycbzweFlgGHSa1dfJ4iypOjfBVyD9Hag-dj8fieDXBa-poR0jdTRMBsMKyeUDwFoCHiVM/exec', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            starRating: starRating, // Asegúrate de enviar la calificación de estrellas
            aspectValues: selectedAspects, // Los datos que se envían
            otherText: otherText.value // Si se envía texto adicional
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
