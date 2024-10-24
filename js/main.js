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

        // Usar proxy para enviar datos a Google Apps Script
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = 'https://script.google.com/macros/s/AKfycbyYtc15iPaT3R4m1_AikLjRlw4LuuLehcwVmeWp3t5rVK0Epx_oWMvIFVy3fdzI0i2T1g/exec';

        fetch(proxyUrl + targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la respuesta del servidor: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                console.log('Parsed data:', data);
                if (data.result === 'success') {
                    confirmationMessage.style.display = 'block';
                    confirmationMessage.textContent = 'Completed! Thank you for submitting your responses.';
                    form.reset();
                    highlightStars(0);
                } else {
                    throw new Error('Hubo un problema al procesar los datos: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error al enviar los datos:', error);
                alert('There was a problem submitting your answers. Please try again.');
            });
    });
});



