document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("login__form");
    const errorText = document.getElementById("login__error");
    const mailInput = document.getElementById("email");
    const pwInput = document.getElementById("password");

    pwInput.addEventListener('input', function () {
        mailInput.classList.remove('login__error');
        pwInput.classList.remove('login__error');
        clearErrorMessage();
    });

    mailInput.addEventListener('input', function () {
        mailInput.classList.remove('login__error');
        pwInput.classList.remove('login__error');
        clearErrorMessage();
    });

    function clearErrorMessage() {
        errorText.innerHTML = "";
    }

    function setErrorMessage(Error) {
        errorText.innerHTML = Error;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mail = mailInput.value.trim(); // Utilisez la valeur réelle du champ email
        const pw = pwInput.value.trim();

        try {
            let apiResponse = await fetch("http://localhost:5678/api/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: mail, password: pw }), 
            });

            if (apiResponse.status === 200) {
                const data = await apiResponse.json();
                sessionStorage.setItem("token", data.token);
                window.location.href = "index.html";
            } else if (apiResponse.status === 401) {
                setErrorMessage('Adresse ou mot de passe incorrect');
            } else if (apiResponse.status === 404) {
                setErrorMessage('Adresse ou mot de passe incorrect');
            } else {
                const errorMessage = await apiResponse.text();
                setErrorMessage(errorMessage || 'Une erreur est survenue');
            }
        } catch (error) {
            console.error(error);
            setErrorMessage('Une erreur est survenue');
        }
    });
});