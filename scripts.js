
import { supabaseKey, supabaseUrl } from "./config.js";


const supabaseClient = window.supabase.createClient(
supabaseUrl,
supabaseKey
);


let idees = [];
let currentIdeaId = null;


const form = document.getElementById("idea-form");
const ideasContainer = document.getElementById("ideas-container");

const titleInput = document.getElementById("title");
const erreurtitre = document.getElementById("titre-erreur");

const description = document.getElementById("description");
const descriptionerreur = document.getElementById("desc-erreur");

const submitBtn = document.getElementById("submit-btn");
const archiveBtn = document.getElementById("show-archives");
const showIdeasBtn = document.getElementById("show-ideas");


function erreur(champ) {
champ.classList.add("error");
champ.classList.remove("success");
}

function success(champ) {
champ.classList.remove("error");
champ.classList.add("success");
}


function ValiderTitre(titre) {
const re = /^[a-zA-ZÀ-ÿ]+([ '-][a-zA-ZÀ-ÿ]+)*$/;
return re.test(titre);
}

function TitreValide() {
const titre = titleInput.value.trim();

if (titre === "") {
erreur(titleInput);
erreurtitre.textContent = "Le titre ne peut pas être vide";
return false;
}

if (!ValiderTitre(titre)) {
erreur(titleInput);
erreurtitre.textContent = "Ce format de titre n'est pas pris en compte";
return false;
}

if (titre.length < 5) {
erreur(titleInput);
erreurtitre.textContent = "Le titre doit contenir au moins 5 caractères";
return false;
}

success(titleInput);
erreurtitre.textContent = "";
return true;
}


function DescValide() {
const desc = description.value.trim();

if (desc === "") {
erreur(description);
descriptionerreur.textContent = "Veuillez rédiger une description";
return false;
}

if (desc.length < 25 || desc.length > 255) {
erreur(description);
descriptionerreur.textContent =
"La description doit contenir entre 25 et 255 caractères";
return false;
}

success(description);
descriptionerreur.textContent = "";
return true;
}


function verifierFormulaire() {
const titreOk = TitreValide();
const descOk = DescValide();

submitBtn.disabled = !(titreOk && descOk);
}


titleInput.addEventListener("input", verifierFormulaire);
titleInput.addEventListener("blur", verifierFormulaire);

description.addEventListener("input", verifierFormulaire);
description.addEventListener("blur", verifierFormulaire);


function rechargerFormulaire() {
titleInput.value = "";
description.value = "";

titleInput.classList.remove("success", "error");
description.classList.remove("success", "error");

erreurtitre.textContent = "";
descriptionerreur.textContent = "";

submitBtn.disabled = true;
}


async function chargerIdees() {
try {
const { data, error } = await supabaseClient
.from("ideas")
.select("*")
.order("id", { ascending: false });


if (error) {
  console.error("Erreur chargement idées :", error);
  ideasContainer.innerHTML = `
    <div class="alert alert-danger">
      Impossible de charger les idées pour le moment.
    </div>
  `;
  return;
}

idees = data || [];
afficherIdees();


} catch (err) {
console.error("Erreur inattendue lors du chargement :", err);
ideasContainer.innerHTML = `       <div class="alert alert-danger">
        Une erreur inattendue est survenue lors du chargement des idées.       </div>
    `;
}
}


function afficherIdees() {
const couleursCartes = {
pedagogie: "note-pedagogie",
evenement: "note-evenement",
campus: "note-campus",
technique: "note-technique"
};

const couleurs = {
pedagogie: "text-bg-warning",
evenement: "text-bg-info",
campus: "text-bg-secondary",
technique: "text-bg-success"
};

const labels = {
pedagogie: "Pédagogie",
evenement: "Événement",
campus: "Vie de campus",
technique: "Technique"
};

const archives = idees.filter((idee) => idee.archivee);
archiveBtn.style.display = archives.length > 0 ? "inline-block" : "none";

ideasContainer.innerHTML = "";

const ideesActives = idees.filter((idee) => !idee.archivee);

if (ideesActives.length === 0) {
ideasContainer.innerHTML = `       <div class="text-center py-5">         <h4>Aucune idée pour le moment</h4>         <p class="text-muted">
          Soyez la première personne à proposer une idée !         </p>       </div>
    `;
return;
}

ideasContainer.innerHTML = `     <h3 class="mb-4">Voici les idées proposées</h3>
  `;

ideesActives.forEach((idee) => {
const badgeColor = couleurs[idee.categorie] || "text-bg-dark";
const couleurCarte = couleursCartes[idee.categorie] || "note-campus";
const label = labels[idee.categorie] || "Autre";


const cardWrapper = document.createElement("div");
cardWrapper.classList.add("col-12", "col-md-6", "col-lg-4");

const card = document.createElement("div");
card.classList.add("card", "border-0", "shadow-sm", "rounded-4", couleurCarte);

card.innerHTML = `
  <div class="card-body">
    <div class="d-flex justify-content-between align-items-center">
      <span class="badge rounded-pill ${badgeColor}">
        ${label}
      </span>

      <div class="dropdown">
        <button
          type="button"
          class="btn btn-light btn-sm rounded-circle"
          data-bs-toggle="dropdown">
          ⋮
        </button>

        <ul class="dropdown-menu">
          <li>
            <a
              href="#"
              class="dropdown-item edit-btn"
              data-id="${idee.id}">
              Modifier
            </a>
          </li>

          <li>
            <a
              href="#"
              class="dropdown-item text-danger delete-btn"
              data-id="${idee.id}">
              Supprimer
            </a>
          </li>

          <li>
            <a
              href="#"
              class="dropdown-item archive-btn"
              data-id="${idee.id}">
              Archiver
            </a>
          </li>
        </ul>
      </div>
    </div>

    <h5 class="fw-bold mt-3">${idee.titre}</h5>
    <p class="text-muted">${idee.description}</p>
  </div>
`;

cardWrapper.appendChild(card);
ideasContainer.appendChild(cardWrapper);


});
}


function afficherArchives() {
const couleursCartes = {
pedagogie: "note-pedagogie",
evenement: "note-evenement",
campus: "note-campus",
technique: "note-technique"
};

const couleurs = {
pedagogie: "text-bg-warning",
evenement: "text-bg-info",
campus: "text-bg-secondary",
technique: "text-bg-success"
};

const labels = {
pedagogie: "Pédagogie",
evenement: "Événement",
campus: "Vie de campus",
technique: "Technique"
};

ideasContainer.innerHTML = ` <h3 class="mb-4">Idées archivées</h3>`;

const ideesArchivees = idees.filter((idee) => idee.archivee);

if (ideesArchivees.length === 0) {
ideasContainer.innerHTML += `<div class="text-center py-4">  <p class="text-muted">Aucune idée archivée.</p> </div> `;
return;
}

ideesArchivees.forEach((idee) => {
const badgeColor = couleurs[idee.categorie] || "text-bg-dark";
const couleurCarte = couleursCartes[idee.categorie] || "note-campus";
const label = labels[idee.categorie] || "Autre";


const cardWrapper = document.createElement("div");
cardWrapper.classList.add("col-12", "col-md-6", "col-lg-4");

const card = document.createElement("div");
card.classList.add("card", "border-0", "shadow-sm", "rounded-4", couleurCarte);

card.innerHTML = `
  <div class="card-body">
    <span class="badge rounded-pill ${badgeColor}">
      ${label}
    </span>

    <h5 class="fw-bold mt-3">${idee.titre}</h5>
    <p class="text-muted">${idee.description}</p>
  </div>
`;

cardWrapper.appendChild(card);
ideasContainer.appendChild(cardWrapper);


});
}


form.addEventListener("submit", async (e) => {
e.preventDefault();

if (!TitreValide()) return;
if (!DescValide()) return;

let categorieIA = "campus"; // fallback par défaut

try {
const categorieBrute = await obtenirCategorieIA(
titleInput.value.trim(),
description.value.trim()
);


categorieIA = categorieBrute
  .trim()
  .toLowerCase()
  .replace(/[^a-z]/g, "");

const categoriesValides = ["pedagogie", "evenement", "campus", "technique"];

if (!categoriesValides.includes(categorieIA)) {
  categorieIA = "campus";
}


} catch (error) {
console.error("Erreur IA, catégorie par défaut utilisée :", error);
categorieIA = "campus";
}

const nouvelleIdee = {
titre: titleInput.value.trim(),
categorie: categorieIA,
description: description.value.trim(),
archivee: false
};

try {
const { error } = await supabaseClient
.from("ideas")
.insert([nouvelleIdee]);


if (error) {
  console.error("Erreur insertion idée :", error);
  alert("Impossible d'ajouter l'idée pour le moment.");
  return;
}

await chargerIdees();
rechargerFormulaire();


} catch (err) {
console.error("Erreur inattendue lors de l'ajout :", err);
alert("Une erreur inattendue est survenue.");
}
});


document.addEventListener("click", async (e) => {
if (!e.target.classList.contains("delete-btn")) return;

e.preventDefault();

const id = Number(e.target.dataset.id);

try {
const { error } = await supabaseClient
.from("ideas")
.delete()
.eq("id", id);


if (error) {
  console.error("Erreur suppression :", error);
  alert("Impossible de supprimer l'idée.");
  return;
}

await chargerIdees();


} catch (err) {
console.error("Erreur inattendue suppression :", err);
alert("Une erreur inattendue est survenue.");
}
});


document.addEventListener("click", (e) => {
if (!e.target.classList.contains("edit-btn")) return;

e.preventDefault();

const id = Number(e.target.dataset.id);

const idee = idees.find((idee) => Number(idee.id) === id);
if (!idee) return;

currentIdeaId = id;

document.getElementById("edit-title").value = idee.titre;
document.getElementById("edit-description").value = idee.description;

const modal = new bootstrap.Modal(document.getElementById("editModal"));
modal.show();
});


document.getElementById("save-edit").addEventListener("click", async () => {
const nouveauTitre = document.getElementById("edit-title").value.trim();
const nouvelleDescription = document.getElementById("edit-description").value.trim();

if (nouveauTitre === "" || nouvelleDescription === "") {
alert("Le titre et la description ne doivent pas être vides.");
return;
}

if (nouvelleDescription.length < 25 || nouvelleDescription.length > 255) {
alert("La description doit contenir entre 25 et 255 caractères.");
return;
}

try {
const { error } = await supabaseClient
.from("ideas")
.update({
titre: nouveauTitre,
description: nouvelleDescription
})
.eq("id", currentIdeaId);


if (error) {
  console.error("Erreur modification :", error);
  alert("Impossible de modifier l'idée.");
  return;
}

bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
await chargerIdees();


} catch (err) {
console.error("Erreur inattendue modification :", err);
alert("Une erreur inattendue est survenue.");
}
});


document.addEventListener("click", async (e) => {
if (!e.target.classList.contains("archive-btn")) return;

e.preventDefault();

const id = Number(e.target.dataset.id);

try {
const { error } = await supabaseClient
.from("ideas")
.update({ archivee: true })
.eq("id", id);


if (error) {
  console.error("Erreur archivage :", error);
  alert("Impossible d'archiver l'idée.");
  return;
}

await chargerIdees();


} catch (err) {
console.error("Erreur inattendue archivage :", err);
alert("Une erreur inattendue est survenue.");
}
});


archiveBtn.addEventListener("click", () => {
archiveBtn.style.display = "none";
showIdeasBtn.style.display = "inline-block";
afficherArchives();
});


showIdeasBtn.addEventListener("click", () => {
showIdeasBtn.style.display = "none";
archiveBtn.style.display = "inline-block";
afficherIdees();
});


async function obtenirCategorieIA(titre, description) {
const prompt = `
Tu es un classificateur d'idées.

Catégories autorisées :

* pedagogie : idées liées à l'apprentissage, aux cours, aux ateliers, à la formation ou à l'amélioration des compétences.
* evenement : idées liées à l'organisation d'activités, de concours, de hackathons, de conférences ou de rencontres.
* campus : idées liées à la vie quotidienne, aux espaces, au confort ou aux services du campus.
* technique : idées liées aux outils numériques, logiciels, équipements informatiques ou infrastructures techniques.

Règles importantes :

* N'ajoute aucune explication.
* Réponds uniquement avec UNE catégorie parmi :
  pedagogie
  evenement
  campus
  technique

Titre : ${titre}
Description : ${description}

Réponse :
`;

const response = await fetch("/.netlify/functions/openrouter", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({ prompt })
});

if (!response.ok) {
throw new Error("Erreur réseau ou serveur IA");
}

const data = await response.json();
console.log("IA response:", data);

const content = data?.choices?.[0]?.message?.content;

if (!content) {
console.log("IA response complète:", data);
throw new Error("Réponse IA invalide");
}

return content.trim();
}


document.addEventListener("DOMContentLoaded", async () => {
submitBtn.disabled = true;
showIdeasBtn.style.display = "none";
await chargerIdees();
});
