//import { la_cle } from "./config.js";




const supabaseUrl = "https://nwiowdfinufsysfluxok.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aW93ZGZpbnVmc3lzZmx1eG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NTk1NjEsImV4cCI6MjA5NjEzNTU2MX0.dT_g0CTlcD9wbHsfVlBJjFvIY0kKF07msi48DziqTy0"; 

const supabaseClient = window.supabase.createClient(
  supabaseUrl,
  supabaseKey
);




// let idees =
// JSON.parse(localStorage.getItem("idees")) || []
let idees = []
let currentIdeaId = null
// const id = Number(currentIdeaId);

 function erreur(champ) {
  champ.classList.add("error");
  champ.classList.remove("success");
 }
 function success(champ) {
  champ.classList.remove("error");
  champ.classList.add("success");
 }

const form =
document.getElementById("idea-form")

const ideasContainer =
document.getElementById("ideas-container")

const titleInput =
document.getElementById("title")
const erreurtitre = document.getElementById("titre-erreur")

const description = document.getElementById("description")
const descriptionerreur = document.getElementById("desc-erreur")

function ValiderTitre(titre) {
  const re = /^[a-zA-ZÀ-ÿ]+([ '-][a-zA-ZÀ-ÿ]+)*$/;
   return re.test(titre)
  
}

function TitreValide() {
  
  if(titleInput.value.trim() === ""){
    erreur(titleInput)
    erreurtitre.textContent = "Le titre ne peut etre vide"
    return false;
   }
  else if (!(ValiderTitre(titleInput.value.trim()))) {
     erreur(titleInput)
     erreurtitre.textContent = "Ce format n est pas pris en compte"
     return false;
  }
  else if (titleInput.value.length < 5){
    erreur(titleInput)
    erreurtitre.textContent = "Le titre doit au moins avoir 5caracteres"
    return false;
  }
 else {
  success(titleInput)
  erreurtitre.textContent = ""
  return true;
 }
}


function  DescValide() {
 
  if(description.value.trim() === ""){
    erreur(description)
    descriptionerreur.textContent = "Veuillez rediger une description"
    return false;
  }
  else if (description.value.length < 25 || description.value > 255){
    erreur(description)
    descriptionerreur.textContent = "La description doit au mois avoir 25 caracteres"
  }
  else {
    success(description)
    descriptionerreur.textContent = ""
    return true;
  }
}
let touchedTitre = false;
let touchedDesc = false;
const submitBtn = document.getElementById("submit-btn");
function verifierFormulaire() {
  
  const titreOk = TitreValide(); // true ou false
 // const descOk = DescValide();
  
  
  
  //submitBtn.disabled = !titreOk;
  //submitBtn.disabled = !descOk;
  
}
function verifierFormulairedesc() {
  
   // true ou false
  const descOk = DescValide();
  
  
  
  
  submitBtn.disabled = !descOk;
  
}

titleInput.addEventListener("input", () => {
  touchedDesc= true;
  verifierFormulaire();
});

titleInput.addEventListener("blur", () => {
  touchedTitre = true;
  verifierFormulaire();
});

description.addEventListener("input", () => {
  touchedDesc = true;
  verifierFormulairedesc();
});

description.addEventListener("blur", () => {
  touchedDesc = true;
  verifierFormulairedesc();
});
//fonction de mis de a jour du form a son etat initial apres soumission
function rechargerFormulaire() {

  titleInput.value = "";
  description.value = "";

  titleInput.classList.remove("success", "error");
  description.classList.remove("success", "error");

  erreurtitre.textContent = "";
  descriptionerreur.textContent = "";

  touchedTitre = false;
  touchedDesc = false;

  submitBtn.disabled = true;
}



// const categoryInput =
// document.getElementById("categorie")

// const descriptionInput =function showLoading() {
//   const loading =
//  document.getElementById("loading")

//   loading.style.display = "block"
// }
// function showLoading() {
//   document.getElementById("loading").style.display = "block"
// }

// function hideLoading() {
//   const loading =
//   document.getElementById("loading")

//   loading.style.display = "none"
// }


// fonctions de chargement des idées depuis la bd 

async function chargerIdees() {
  const { data, error } = await supabaseClient
    .from("ideas")
    .select("*")
    .order("id", { ascending: false });

  if (!error) {
    idees = data;
    afficherIdees();
  } else {
    console.log(error);
  }
}

// ajouter un event a chaque fois que la page est actualisés les données existants depuis la bd s afficheront

document.addEventListener("DOMContentLoaded", async () => {
  await chargerIdees();
});

form.addEventListener("submit", async (e) => {
  //console.log("submit déclenché")
  e.preventDefault()
  // showLoading()
  if (!TitreValide()) return;
  if (!DescValide()) return;

 let categorieIA =
    await obtenirCategorieIA(
    titleInput.value,
    description.value
)
categorieIA = categorieIA
  .trim()
  .toLowerCase()
  .replace(/[^a-z]/g, "");


 
  const nouvelleIdee = {
    
    // id: Date.now(),

     titre: titleInput.value,

     categorie: categorieIA,

     description: description.value,
    

    archivee: false

  }
  
  
  idees.push(nouvelleIdee)

 const { error } = await supabaseClient
  .from('ideas')
  .insert([nouvelleIdee])
  if (!error) {
  afficherIdees(); // recharge depuis la base
}

  

 rechargerFormulaire()

})

function afficherIdees() {
    const couleursCartes = {
    pedagogie: "note-pedagogie",
    evenement: "note-evenement",
    campus: "note-campus",
    technique: "note-technique"
    }

  const couleurs = {
    pedagogie: "text-bg-warning",
    evenement: "text-bg-info",
    campus: "text-bg-secondary",
    technique: "text-bg-success"
  }

  const labels = {
    pedagogie: "Pédagogie",
    evenement: "Événement",
    campus: "Vie de campus",
    technique: "Technique"
  }
 const archiveBtn =
document.getElementById("show-archives")

const archives =
idees.filter(
  idee => idee.archivee
)

archiveBtn.style.display =
archives.length > 0
? "inline-block"
: "none"

  ideasContainer.innerHTML = ""
  if (idees.length === 0) {

    ideasContainer.innerHTML = `
      <div class="text-center py-5">

        

        <h4>Aucune idée pour le moment</h4>

        <p class="text-muted">
          Soyez la première personne à proposer une idée !
        </p>

      </div>
    `

    return
  }
  else if (idees.length > 0) {

  ideasContainer.innerHTML = `
    <h3 class="mb-4">
       Voici les idées proposées
    </h3>
  `
}


  idees
   .filter(idee => !idee.archivee)
  .forEach((idee) => {

    const badgeColor =
    couleurs[idee.categorie]

    const cardWrapper =
    document.createElement("div")

    cardWrapper.classList.add(
      "col-12",
      "col-md-6",
      "col-lg-4"

    )

    const card =
    document.createElement("div")

   card.classList.add(
  "card",
  "border-0",
  "shadow-sm",
  "rounded-4",
  couleursCartes[idee.categorie]
)

    card.innerHTML = `

      <div class="card-body">

        <div class="d-flex justify-content-between align-items-center">

          <span class="badge rounded-pill ${badgeColor}">
            ${labels[idee.categorie]}
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

        <h5 class="fw-bold mt-3">
          ${idee.titre}
        </h5>

        <p class="text-muted">
          ${idee.description}
        </p>

      </div>

    `

    cardWrapper.appendChild(card)

    ideasContainer.appendChild(cardWrapper)

  })

}

document.addEventListener("click", async (e) => {

  if (
    e.target.classList.contains("delete-btn")
  ) {

    e.preventDefault()

    const id =
    Number(e.target.dataset.id)

    idees = idees.filter(
      idee => Number(idee.id) !== id
    )

    // localStorage.setItem(
    //   "idees",
    //   JSON.stringify(idees)
    // )
const { error } = await supabaseClient
.from('ideas')
.delete()
.eq('id',id)
if (!error) {
  afficherIdees(); // recharge depuis la base
}

  }

})

document.addEventListener("click", async (e) => {

 
 if (e.target.classList.contains("edit-btn")) {

  e.preventDefault()
  

  const id =
  Number(e.target.dataset.id)

  const idee =
  idees.find(
    idee => Number(idee.id) === id
  )

  currentIdeaId = id

  document.getElementById(
    "edit-title"
  ).value = idee.titre

  document.getElementById(
    "edit-description"
  ).value = idee.description

  const modal =
  new bootstrap.Modal(
    document.getElementById("editModal")
  )

  modal.show()
 
}
})
chargerIdees()
document
.getElementById("save-edit")
.addEventListener("click", async () => {

  const idee =
  idees.find(
    idee => Number(idee.id) === currentIdeaId
  )

  idee.titre =
  document.getElementById(
    "edit-title"
  ).value

  idee.description =
  document.getElementById(
    "edit-description"
  ).value

  

  const { error } = await supabaseClient
  .from('ideas')
  .update({
    titre: idee.titre,
    description: idee.description
  })
  .eq('id', currentIdeaId);

  bootstrap.Modal
    .getInstance(
      document.getElementById("editModal")
    )
    .hide()
    chargerIdees()

})
document.addEventListener("click", async(e) => {

  if (e.target.classList.contains("archive-btn")) {

    e.preventDefault()
   

    const id =
    Number(e.target.dataset.id)

    const idee =
    idees.find(
      idee => Number(idee.id) === id
    )

    idee.archivee = true
    currentIdeaId = id
    // localStorage.setItem(
    //   "idees",
    //   JSON.stringify(idees)
    // )
  
 const { error } = await supabaseClient
  .from('ideas')
  .update({archivee: true})
  .eq('id', currentIdeaId);

  }

})
chargerIdees()
document
.getElementById("show-archives")
.addEventListener("click", () => {
    document.getElementById("show-archives").style.display = "none"

    document.getElementById("show-ideas").style.display = "inline-block"

  ideasContainer.innerHTML = `
    <h3 class="mb-4">
      Idées archivées
    </h3>
  `

  const couleursCartes = {
    pedagogie: "note-pedagogie",
    evenement: "note-evenement",
    campus: "note-campus",
    technique: "note-technique"
  }

  const couleurs = {
    pedagogie: "text-bg-warning",
    evenement: "text-bg-info",
    campus: "text-bg-secondary",
    technique: "text-bg-success"
  }

  const labels = {
    pedagogie: "Pédagogie",
    evenement: "Événement",
    campus: "Vie de campus",
    technique: "Technique"
  }

  idees
    .filter(idee => idee.archivee)
    .forEach((idee) => {

      const cardWrapper =
      document.createElement("div")

      cardWrapper.classList.add(
        "col-12",
        "col-md-6",
        "col-lg-4"
      )

      const card =
      document.createElement("div")

      card.classList.add(
        "card",
        "border-0",
        "shadow-sm",
        "rounded-4",
        couleursCartes[idee.categorie]
      )

      card.innerHTML = `
        <div class="card-body">

          <span class="badge rounded-pill ${couleurs[idee.categorie]}">
            ${labels[idee.categorie]}
          </span>

          <h5 class="fw-bold mt-3">
            ${idee.titre}
          </h5>

          <p class="text-muted">
            ${idee.description}
          </p>

        </div>
      `

      cardWrapper.appendChild(card)
      ideasContainer.appendChild(cardWrapper)

    })

})
document
.getElementById("show-ideas")
.addEventListener("click", () => {

  afficherIdees()

  document.getElementById("show-ideas").style.display = "none"

  document.getElementById("show-archives").style.display = "inline-block"

})


// fonction async pour permettre a  l ia de suggerer des categorie a chque idée soumise


//console.log("API KEY:", process.env.OPENROUTER_API_KEY);
async function obtenirCategorieIA(titre, description) {

  const prompt = `
Tu es un classificateur d'idées.

Catégories autorisées :

- pedagogie : idées liées à l'apprentissage, aux cours, aux ateliers, à la formation ou à l'amélioration des compétences.

- evenement : idées liées à l'organisation d'activités, de concours, de hackathons, de conférences ou de rencontres.

- campus : idées liées à la vie quotidienne, aux espaces, au confort ou aux services du campus.

- technique : idées liées aux outils numériques, logiciels, équipements informatiques ou infrastructures techniques.

Règles importantes :

- N'ajoute aucune explication.
- Choisis uniquement parmi :
  pedagogie
  evenement
  campus
  technique



Titre : ${titre}
Description : ${description}

Réponse :


`

//   const response = await fetch(
//     "https://openrouter.ai/api/v1/chat/completions",
//     {
//       method: "POST",
//       headers: {
        
//          //"Authorization": `Bearer ${la_cle}`,
//          "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         model: "google/gemma-4-31b-it",
//         messages: [{role: "user",content:prompt}],
//         stream: false
//       })
//     }
//   )

//   const data = await response.json()

//   return data.choices[0].message.content.trim()
 

 const response = await fetch("/.netlify/functions/openrouter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ prompt })
  });

  const data = await response.json();

  console.log("IA response:", data);

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
     console.log("IA response complète:", data);
     throw new Error("Réponse IA invalide");
  }

  return content.trim();
}