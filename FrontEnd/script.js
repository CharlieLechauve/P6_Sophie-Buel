//Constantes FILTRE
const btnAll = document.querySelector(".filter__btn-id-null");
const btnId1 = document.querySelector(".filter__btn-id-1");
const btnId2 = document.querySelector(".filter__btn-id-2");
const btnId3 = document.querySelector(".filter__btn-id-3");

//Constante Projet
const sectionProjets = document.querySelector(".gallery");

let data = null;
let id;

function main() {
    generationProjets(data, null);
}

main()

// Fonction reset Projets
function resetSectionProjets() {  
	sectionProjets.innerHTML = "";
}

//-----------------------------------//
//--Fonction génération des Projets--//
//-----------------------------------//
async function generationProjets(data, id) { 

    //Vérifier si Fetch a été lancé
    try {
        const response = await fetch('http://localhost:5678/api/works');
        data = await response.json();
    }

    //Si Fetch n'a pas été lancé
    catch{
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Une erreur est survenue lors de la récupération des projets";
        sectionProjets.appendChild(p);
        await new Promise(resolve => setTimeout(resolve, 60000)); //(Temps en milisecondes)
        window.location.href = "index.html";
    }

    resetSectionProjets()

    // Filtres
    if ([1, 2, 3].includes(id)) {
        data = data.filter(data => data.categoryId == id);}

    document.querySelectorAll(".filter__btn").forEach(btn => {
        btn.classList.remove("filter__btn--active");})
    document.querySelector(`.filter__btn-id-${id}`).classList.add("filter__btn--active");

    if (data.length === 0 || data === undefined) { 
        const p = document.createElement("p");
        p.classList.add("error");
        p.innerHTML = "Aucun projet à afficher";
        sectionProjets.appendChild(p);
        return;}

    // Génère les projets
    if (id === null || [1, 2, 3].includes(id)) {
        for (let i = 0; i < data.length; i++) {
            
            const figure = document.createElement("figure"); 
            sectionProjets.appendChild(figure);
            figure.classList.add(`js-projet-${data[i].id}`); // Ajoute l'id du projet 
            const img = document.createElement("img");
            img.src = data[i].imageUrl;
            img.alt = data[i].title;
            figure.appendChild(img);

            const figcaption = document.createElement("figcaption");
            figcaption.innerHTML = data[i].title;
            figure.appendChild(figcaption);
        }
}}

//--------------------//
//--Filtres Listener--//
//--------------------//
btnAll.addEventListener("click", () => {
    generationProjets(data, null);})

btnId1.addEventListener("click", () => {
    generationProjets(data, 1);})

btnId2.addEventListener("click", () => {
    generationProjets(data, 2);})

btnId3.addEventListener("click", () => {
    generationProjets(data, 3);})



//------------------------------//
//------------------------------//
//------------MODALE------------//
//------------------------------//
//------------------------------//