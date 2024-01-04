const gallery = document.querySelector('.gallery');
const modalGallery = document.querySelector('.modal-gallery__pics')
const filtersContainer = document.querySelector('.filters');
const adminToken = sessionStorage.getItem("token");


async function main() {
    displayWorks();  // Affiche tous les projets initialement
    displayFilters();  // Affiche les filtres
    Admin ();
}

main();

async function getWorks() {
    try {
        const worksResponse = await fetch('http://localhost:5678/api/works');
        return worksResponse.json();
    } catch (error) {
        console.log("Erreur lors de la récupération des projets depuis l'API");
    }
}

async function getCategories() {
    try {
        const categoriesResponse = await fetch('http://localhost:5678/api/categories');
        return await categoriesResponse.json();
    } catch (error) {
        console.log("Erreur lors de la récupération des catégories depuis l'API");
    }
}

async function displayWorks(categoryId) {
    try {
        const dataWorks = await getWorks();
        gallery.innerHTML = "";

        // Création des projets pour affichage
        dataWorks.map((works) => {
            if (categoryId == works.category.id || categoryId == null) {
                createWorks(works);
                createModalWorks(works);
            }
        });

    } catch (error) {
        console.log("Erreur lors de l'affichage des projets");
    }
}

// Fonction création d'un projet dans le DOM
function createWorks(works) {
    //Création des éléments "fictivement"
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const figcaption = document.createElement("figcaption");

    //Liens où récupérer img, figcaption et catégorie
    img.src = works.imageUrl;
    figcaption.innerText = works.title;
    figure.setAttribute("categoryId", works.category.id);

    //Placement dans DOM
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

//Fonction d'apparition des works dans la modale
function createModalWorks(works) {
    const modalFigure = document.createElement("figure");
    const modalImg = document.createElement("img");

    modalImg.src = works.imageUrl;

    modalFigure.appendChild(modalImg);
    modalGallery.appendChild(modalFigure);
}

// Fonction filtre associé aux boutons (créés dans la fonction directement)
async function displayFilters() {
    try {
        const dataCategories = await getCategories();

        // Création des boutons
        dataCategories.map((category) => {
            const btnCategory = document.createElement("button");
            btnCategory.innerText = category.name;
            btnCategory.setAttribute("class", "filter__btn");
            btnCategory.setAttribute("id", category.id);
            filtersContainer.appendChild(btnCategory);
        });

        // EventListeners sur les boutons
        const buttons = document.querySelectorAll(".filters button");

        //Fonction appliquée à chaques boutons
        buttons.forEach((button) => {
        
            button.addEventListener("click", () => {
                const categoryId = button.getAttribute("id");
                buttons.forEach((button) => button.classList.remove("filter__btn--active"));
                button.classList.add("filter__btn--active");
                    displayWorks(categoryId);
            });
        });
    } catch (error) {
        console.log("Erreur lors de la création des boutons");
    }
}


//Fontion quand connecté 

function Admin () {
    if (adminToken) {
        const connect = document.getElementById('login');

        connect.innerHTML = "<a href='#'> logout </a>";

        connect.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.removeItem("token");
            window.location.href ="index.html";
        });

        adminDisplay();
    };
};

function adminDisplay() {
    const adminTop = document.querySelector('.admin-top');

    //bannière en noire
    adminTop.classList.add("admin-top__reveal");
    adminTop.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>' +
	"<p> Mode édition </p>";


    //Enlever les filtres + modifier la zone de texte associée
    const filters = document.querySelector(".filters")
    filters.style.display = "none";

    const pfTitle = document.querySelector(".pf-title");
    pfTitle.style.marginBottom = "90px";

    //Ajout de l'icone
    const editionButton = document.createElement("a");
    editionButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>' + "modifier";
    editionButton.href="#modal-gallery";
    editionButton.classList.add('js-modal')
    pfTitle.appendChild(editionButton);
};

let modal = null

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector('.modal')
    target.style.display = null;
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener(click, closeModal)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.style.display = none;
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal = null
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click',openModal)
})