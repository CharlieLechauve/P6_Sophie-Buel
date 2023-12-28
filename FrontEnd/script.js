const gallery = document.querySelector('.gallery');
const filtersContainer = document.querySelector('.filters');

async function main() {
    displayWorks();  // Affiche tous les projets initialement
    displayFilters();  // Affiche les filtres
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