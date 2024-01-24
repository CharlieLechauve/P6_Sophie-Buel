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

    figure.setAttribute("workId", works.id);

    //Placement dans DOM
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

//Fonction d'apparition des works dans la modale
function createModalWorks(works) {
    const modalFigure = document.createElement("figure");
    const modalImg = document.createElement("img");
    const trashButton = document.createElement("a");

    trashButton.classList.add("trash");
    trashButton.href = "#"
    trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    modalFigure.setAttribute('workId', works.id);

    modalImg.src = works.imageUrl;

    modalFigure.appendChild(modalImg);
    modalFigure.appendChild(trashButton);
    modalGallery.appendChild(modalFigure);

    trashButton.addEventListener('click', function (e) {
        e.preventDefault();
        const workId = modalFigure.getAttribute('workId');
        deleteWorks(workId);
    });
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
        displayCatOptions();
        
        addWork();
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
    editionButton.href=".modal-gallery";
    editionButton.classList.add('js-modal')
    pfTitle.appendChild(editionButton);
};

////------------------------/////
//// APPARITION DES MODALES /////
////------------------------/////
let modal = null
let modal2 = null

const openModal = function (e) {
    e.preventDefault();
    const target = document.querySelector('.modal')
    target.style.display = null;
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-stop').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();


    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-stop').removeEventListener('click', stopPropagation)
    modal = null
}

const openModal2 = function (e) {
    e.preventDefault();
    const target2 = document.querySelector('.modal2')
    target2.style.display = null;
    target2.removeAttribute('aria-hidden')
    target2.setAttribute('aria-modal', 'true')
    modal2 = target2
    modal2.addEventListener('click', closeModal2)
    modal2.querySelector('.js-modal-close').addEventListener('click', closeModal2)
    modal2.querySelector('.js-stop').addEventListener('click', stopPropagation)
}

const closeModal2 = function (e) {
    if (modal2 === null) return
    e.preventDefault();

    resetModal(modal2);

    modal2.style.display = "none";
    modal2.setAttribute('aria-hidden', 'true')
    modal2.removeAttribute('aria-modal')
    modal2.removeEventListener('click', closeModal2)
    modal2.querySelector('.js-modal-close').removeEventListener('click', closeModal2)
    modal2.querySelector('.js-stop').removeEventListener('click', stopPropagation)
    modal2 = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

function resetModal(modal) {
    // Réinitialiser les inputs, vider les contenus, etc.
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = ''; // Vider les inputs
    });

    const imagePreviewContainer = modal.querySelector('#previewImageContainer');
    const iconContainer = modal.querySelector('#iconContainer');
    const picLabel = modal.querySelector('#add-pic_label');

    imagePreviewContainer.innerHTML = ''; // Vider le conteneur au cas où il y aurait déjà des images.
    iconContainer.style.display = "block"; // Afficher à nouveau l'icône
    picLabel.style.display = "block"; // Afficher à nouveau le label
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click',openModal)
})

document.querySelectorAll('#js-modal-change').forEach(button => {
    button.addEventListener('click',openModal2)
    button.addEventListener('click',closeModal)
})

document.querySelectorAll('.js-modal-back').forEach(button => {
    button.addEventListener('click',openModal)
    button.addEventListener('click',closeModal2)
})

////----------------------------/////
//// CHANGEMENT Input <-> Image /////
////----------------------------/////
document.getElementById('add-pic_button').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('input-hidden').click();
});

document.getElementById('input-hidden').addEventListener('change', function previewImage() {
    const fileInput = document.getElementById('input-hidden');
    const file = fileInput.files[0];
    const imagePreviewContainer = document.getElementById('previewImageContainer');
    const iconContainer = document.getElementById('iconContainer');
    const picLabel = document.getElementById('add-pic_label');
    
    if(file.type.match('image.*')){
      const reader = new FileReader();
      
      reader.addEventListener('load', function (event) {
        const imageUrl = event.target.result;
        const image = new Image();
        
        image.addEventListener('load', function() {
          imagePreviewContainer.innerHTML = '';
          imagePreviewContainer.appendChild(image);
          iconContainer.style.display = "none";
          picLabel.style.display = "none";
        });
        
        image.src = imageUrl;
      });
      
      reader.readAsDataURL(file);
    }
  })


////----------------------------------------------------------/////
//// Ajout des catégories dans le menu déroulant de la modale /////
////----------------------------------------------------------/////
  async function displayCatOptions() {
    try {
        const dataCategories = await getCategories();
        const selectElement = document.getElementById('categorie-select');

        dataCategories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;
            selectElement.appendChild(option);
        });

        selectElement.addEventListener('change', function () {
            const selectedCategoryId = this.value;
            console.log("Catégorie sélectionnée :", selectedCategoryId);
        });
    } catch (error) {
        console.log("Erreur lors de la création des options de la catégorie");
    }
}

////-------------------------/////
//// Suppression d'un projet /////
////-------------------------/////

function resetModalGallery() {
    const modalGallery = document.querySelector('.modal-gallery__pics');
    modalGallery.innerHTML = '';
}

async function deleteWorks(workId) {
    const adminToken = sessionStorage.getItem("token")
    try {
        if (window.confirm("Voulez vous effacer ce projet ?")) {
            let response = await fetch(`http://localhost:5678/api/works/${workId}`,{
                method:"DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${adminToken}`,
                },
            });

            if (response.ok) {
                console.log("Projet supprimé");
                resetModalGallery();
                await displayWorks();

            } else if (response.status === 401) {
                console.error("Vous n'êtes pas autorisé à effectuer cette action")
            } 
        }
    } catch (error) {
        console.error("Erreur lors de la suppression", error);
    }
};




////-------------------/////
//// Ajout d'un projet /////
////-------------------/////

async function addWork() {
    const form = document.getElementById("modal-add-pics");
    const addTitle = document.querySelector(".add-pic_input");
    const addCategory = document.getElementById("categorie-select");
    const addPhoto = document.getElementById("input-hidden");
    const submitButton = document.getElementById("js-modal-add");
    const textImg = document.getElementById("img_info");
    

    if (!addTitle || !addCategory || !addPhoto) {
        console.error("Certains éléments ne sont pas présents dans le DOM.");
        return;
    }

    form.addEventListener("input", function () {
        const isFormValid = addPhoto.files.length > 0 && addTitle.value !== "" && addCategory.value !== "";
        submitButton.disabled = !isFormValid; // Active ou désactive le bouton en fonction de la validité du formulaire

        if (isFormValid) {
            submitButton.classList.add("valid_btn--active");
        } else {
            submitButton.classList.remove("valid_btn--active");
        }

        if (addPhoto.files.length > 0) {
            textImg.style.display = "none"
        } else {
            textImg.style.display = "null"
        }

    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (addPhoto.files.length > 0 && addTitle.value !== "" && addCategory.value !== "") {
            try {
                let formData = new FormData();
                formData.append("title", addTitle.value);
                formData.append("image", addPhoto.files[0]);
                formData.append("category", parseInt(addCategory.value));

                const response = await fetch(`http://localhost:5678/api/works`, {
                    method: "POST",
                    headers: {
                        accept: "*/*",
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: formData,
                });

                if (response.ok) {
                    console.log("Succès");
                    form.reset();

                    resetModalGallery();
                    await displayWorks();

                    resetModal(modal2);

                } else {
                    console.log("Erreur");
                }
            } catch (error) {
                console.error("Erreur lors de la requête :", error);
            }
        } else {
            console.error("Veuillez remplir tous les champs.");
        }
    });
}