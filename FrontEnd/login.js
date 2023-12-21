// DOMContentLoaded permet d'attendre la connexion de la page avant le lancement du script
document.addEventListener("DOMContentLoaded", function () {

const alreadyLoggedError = document.querySelector(".alreadyLogged__error"); 
const loginEmailError = document.querySelector(".loginEmail__error"); 
const loginMdpError = document.querySelector(".loginMdp__error"); 

const email = document.getElementById("email");
const password = document.getElementById("password");

const submit = document.getElementById("submit");

alreadyLogged();

// Utilisateur déjà connecté : Suppression token
function alreadyLogged() {
    if (localStorage.getItem("token")) {
        localStorage.removeItem("token");

        const p = document.createElement("p");
        p.innerHTML = "Vous avez été déconnecté";
        alreadyLoggedError.appendChild(p);
        return;
    }
}

// Event Listener connexion
submit.addEventListener("click", () => {
    let user = {
        email: email.value,
        password: password.value
    };
    login(user);
})

// Fonction Connexion
function login(id) {
    console.log(id);
    loginEmailError.innerHTML = "";
    loginMdpError.innerHTML = "";


    // Vérification E-mail
    if (!id.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Adresse e-mail invalide";
        loginEmailError.appendChild(p);
        return;
    }

    // Vérification Password
    if (id.password.length < 5 && !id.password.match(/^[a-zA-Z0-9]+$/g)) {
        const p = document.createElement("p");
        p.innerHTML = "Mot de passe invalide";
        loginMdpError.appendChild(p);
        return;
    }

    // Vérification de l'email et du mot de passe
    else {
    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(id)
    })
    .then(response => response.json())
    .then(result => { 
        console.log(result);
        
        //  Connexion impossible
        if (result.error || result.message) {
            const p = document.createElement("p");
            p.innerHTML = "Ce mot de passe était incorrect. Veuillez réessayer.";
            loginMdpError.appendChild(p);

        // Connexion possible
        } else if (result.token) {
            localStorage.setItem("token", result.token);
            window.location.href = "index.html";
        }
    
    })
    
    // Envoie du message d'erreur
    .catch(error => 
        console.log(error));
}}
});