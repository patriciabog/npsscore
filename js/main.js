'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const stars = document.querySelectorAll('.star');
    const otherCheckbox = document.getElementById('otherCheckbox');
    const otherText = document.getElementById('otherText');
    const form = document.getElementById('surveyForm');
    const confirmationMessage = document.getElementById('confirmationMessage');
    let selectedStars = 0;

    stars.forEach((star, index) => {
        star.addEventListener('click', () => handleClickStar(index + 1));
    });

    function handleClickStar(starValue) {
        selectedStars = starValue;
        highlightStars(starValue);
    }

    function highlightStars(starValue) {
        stars.forEach(star => star.classList.remove('selected'));
        for (let i = 1; i <= starValue; i++) {
            stars[i - 1].classList.add('selected');
        }
    }

    otherCheckbox.addEventListener('change', function () {
        if (this.checked) {
            otherText.disabled = false;
            otherText.focus();
        } else {
            otherText.disabled = true;
            otherText.value = "";
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const selectedAspects = [];
        document.querySelectorAll('input[name="aspect"]:checked').forEach(function (checkbox) {
            selectedAspects.push(checkbox.value);
        });

        if (otherCheckbox.checked && otherText.value.trim() !== '') {
            selectedAspects.push('Otro: ' + otherText.value);
        }

        const data = {
            stars: selectedStars,
            aspects: selectedAspects
        };

        // Enviar datos a Google Apps Script
        fetch('https://script.google.com/macros/s/AKfycbzWrWf1qxFi1TcZ-t_nihwuGDkhWjEW4pUc9FA8XpXSDtBgGcb8bJYyfMlYKl_eE2Ze/exec', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(result => {
                confirmationMessage.style.display = 'block';
                confirmationMessage.textContent = '¡Listo! Gracias por enviar tus respuestas.';
                form.reset();
                highlightStars(0);
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                alert('Hubo un problema al enviar tus respuestas. Intenta nuevamente.');
            });
    });
});




