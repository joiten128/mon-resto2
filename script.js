let score = 0;
let timeLeft = 45;
let gameInterval;
let currentOrder = [];
let playerBurger = [];

const customers = ["🧑‍🦱", "👩", "👨", "👧", "👵", "👴"];
const recipes = [
    { name: "Burger Simple", items: ["🍞", "🥩", "🍞"] },
    { name: "Cheeseburger", items: ["🍞", "🥩", "🧀", "🍞"] },
    { name: "Burger Santé", items: ["🍞", "🥩", "🥗", "🍞"] },
    { name: "Le Complet", items: ["🍞", "🥩", "🧀", "🥗", "🍞"] }
];

const scoreEl = document.getElementById('score');
const timerEl = document.getElementById('timer');
const orderBubble = document.getElementById('orderBubble');
const customerEmoji = document.getElementById('customerEmoji');
const plateEl = document.getElementById('plate');
const startScreen = document.getElementById('startScreen');
const endScreen = document.getElementById('endScreen');

function startGame() {
    score = 0;
    timeLeft = 45;
    playerBurger = [];
    
    scoreEl.innerText = score;
    timerEl.innerText = timeLeft;
    
    startScreen.style.display = "none";
    endScreen.style.display = "none";
    
    updatePlate();
    nextCustomer();

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
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
    
    currentOrder = randomRecipe.items;
    
    customerEmoji.innerText = randomCustomer;
    orderBubble.innerText = `${randomRecipe.name} :\n${currentOrder.join(" + ")}`;
    
    customerEmoji.style.transform = "scale(0.5)";
    setTimeout(() => customerEmoji.style.transform = "scale(1)", 150);
}

function addIngredient(ing) {
    if (timeLeft <= 0) return;
    playerBurger.push(ing);
    updatePlate();
}

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
    const isCorrect = JSON.stringify(playerBurger) === JSON.stringify(currentOrder);

    if (isCorrect) {
        score += 10;
        scoreEl.innerText = score;
        playerBurger = [];
        updatePlate();
        nextCustomer();
    } else {
        alert("❌ Mauvaise recette ! Le client n'est pas content.");
        playerBurger = [];
        updatePlate();
    }
}

function endGame() {
    clearInterval(gameInterval);
    endScreen.style.display = "flex";
    document.getElementById('finalScore').innerText = score;

    const loveMsg = document.getElementById('loveMessage');
    if (score >= 80) {
        loveMsg.innerText = "Wow, un vrai cordon bleu ! Mais mon plat préféré, ça restera toujours toi. ❤️";
    } else {
        loveMsg.innerText = "Pas mal ! Entraîne-toi encore, je t'aime quand même. 😉❤️";
    }
}

// Liaison des boutons aux fonctions du jeu
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('trashBtn').addEventListener('click', trashBurger);
document.getElementById('serveBtn').addEventListener('click', serveBurger);

document.querySelectorAll('.ing-btn').forEach(button => {
    button.addEventListener('click', () => {
        const ingredient = button.getAttribute('data-ing');
        addIngredient(ingredient);
    });
});
