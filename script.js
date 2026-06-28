// 1. Déclaration des variables (La mémoire court terme du jeu)
let score = 0;
let timeLeft = 45;
let gameInterval;   /* Contiendra le compte à rebours */
let currentOrder = []; /* Liste des emojis demandés par le client */
let playerBurger = []; /* Liste des emojis empilés par le joueur */

// Les banques de données (Listes de clients et de recettes)
const customers = ["🧑‍🦱", "👩", "👨", "👧", "👵", "👴"];
const recipes = [
    { name: "Burger Simple", items: ["🍞", "🥩", "🍞"] },
    { name: "Cheeseburger", items: ["🍞", "🥩", "🧀", "🍞"] },
    { name: "Burger Santé", items: ["🍞", "🥩", "🥗", "🍞"] },
    { name: "Le Complet", items: ["🍞", "🥩", "🧀", "🥗", "🍞"] }
];

// 2. Ciblage des éléments HTML pour pouvoir interagir avec eux
const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const orderBubble = document.getElementById('orderBubble');
const customerEmoji = document.getElementById('customerEmoji');
const plateEl = document.getElementById('plate');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');

// 3. Les fonctions (Les actions mécaniques du jeu)

function startGame() {
    score = 0;
    timeLeft = 45;
    playerBurger = [];
    
    // On met à jour les textes du HTML
    scoreEl.innerText = score;
    timerEl.innerText = timeLeft;
    
    // On cache les écrans d'affichage
    startScreen.style.display = "none";
    endScreen.style.display = "none";
    
    updatePlate();
    nextCustomer();

    // Lancement de l'horloge : s'exécute TOUTES les 1000 millisecondes (1 seconde)
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function nextCustomer() {
    // Sélection aléatoire d'un client et d'une recette
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    
    currentOrder = randomRecipe.items;
    
    customerEmoji.innerText = randomCustomer;
    orderBubble.innerText = `${randomRecipe.name} :\n${currentOrder.join(" + ")}`;
    
    // Animation de pop du client
    customerEmoji.style.transform = "scale(0.5)";
    setTimeout(() => customerEmoji.style.transform = "scale(1)", 150);
}

// Fonction appelée dès qu'on clique sur un ingrédient
function addIngredient(ing) {
    if (timeLeft <= 0) return; // Bloque le clic si le jeu est fini
    playerBurger.push(ing);   // Ajoute l'emoji au tableau du joueur
    updatePlate();
}

// Actualise l'affichage de l'assiette au milieu de l'écran
function updatePlate() {
    if (playerBurger.length === 0) {
        plateEl.innerText = "🍽️ Assiette vide";
    } else {
        plateEl.innerText = playerBurger.join(" ");
    }
}

function trashBurger() {
    playerBurger = [];
    updatePlate();
}

function serveBurger() {
    // Technique pro pour comparer deux listes (Tableaux) : on les transforme en texte
    const isCorrect = JSON.stringify(playerBurger) === JSON.stringify(currentOrder);

    if (isCorrect) {
        score += 10;
        scoreEl.innerText = score;
        playerBurger = [];
        updatePlate();
        nextCustomer(); // Client suivant !
    } else {
        alert("❌ Mauvaise recette ! Le client n'est pas content.");
        playerBurger = [];
        updatePlate();
    }
}

function endGame() {
    clearInterval(gameInterval); // On arrête le chrono
    endScreen.style.display = "flex"; // On affiche l'écran de fin
    document.getElementById('finalScore').innerText = score;

    const loveMsg = document.getElementById('loveMessage');
    if (score >= 80) {
        loveMsg.innerText = "Wow, un vrai cordon bleu ! Mais mon plat préféré, ça restera toujours toi. ❤️";
    } else {
        loveMsg.innerText = "Pas mal ! Entraîne-toi encore, je t'aime quand même. 😉❤️";
    }
}

// 4. Écouteurs d'Événements (Les déclencheurs physiques)
// Au lieu de mettre du code directement dans le HTML, on branche les clics ici
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('trashBtn').addEventListener('click', trashBurger);
document.getElementById('serveBtn').addEventListener('click', serveBurger);

// On écoute le clic sur tous les boutons d'ingrédients d'un coup
document.querySelectorAll('.ing-btn').forEach(button => {
    button.addEventListener('click', () => {
        const ingredient = button.getAttribute('data-ing');
        addIngredient(ingredient);
    });
});
