const play = document.getElementById("play");
const startScreen = document.getElementById("play-screen");

const canvasGame = document.getElementById("game-area");
canvasGame.width = window.innerWidth;
canvasGame.height = window.innerHeight;
const ctxGame = canvasGame.getContext("2d");

const damagePlayer = document.querySelector(".damagePlayer");
const playerTouchZone = document.getElementById("touchPlayer");

const stopBtn = document.getElementById("stopBtn");
const stopScreen = document.getElementById("stopScreen");
const resume = document.getElementById("resume-btn");

const gameOverScreen = document.getElementById("gameOverScreen");
const restart = document.getElementById("restartGame");

let gameOver = false; // Variable to track if the game is over
let breakGame = false;

let intervalId = null;
let timoutId = null;

let gameObject = null;
let life = null;

let lastSpawnEnnemy = Date.now();
let stratBreak = 0;
let timeBreak = 0;

let scoreObs = false;
let scoreParrot = false;

let parrotDesroy = true; // Variable to track if the parrot has been destroyed

let level = new Level();

const heartFull  = new Picture(heartPicture[1], 1);
const heartHalf  = new Picture(heartPicture[2], 1);
const heartempty  = new Picture(heartPicture[0], 1);

Promise.all([heartFull.pictureLoad(), heartHalf.pictureLoad()]); // Load the heart images

let ballAtUpload = [];
let playerAtUpload = null;
let heartAtUpload = [];
let obstacleAtUpload = [];
let lootAtUpload = []; 
let enemyAtUpload = []; 
let ennemyBulletAtUpload = []; 
let bossAtUpload = [];


window.addEventListener("keydown", function(event) { // Listen for the Escape key to pause the game
    if (event.key === "Escape") {
        if (!breakGame) {
            gameObject.breakGame();
        }
        else {
            gameObject.resume();
        }
    }
});

/*window.addEventListener("resize", function(){ // Adjust the canvas size when the window is resized
    canvasGame.width = window.innerWidth;
    canvasGame.height = window.innerHeight;
    if (playerAtUpload) {
        playerAtUpload.y = canvasGame.height / 2 - playerAtUpload.img.height / 2; // Center the player vertically
    }
    if (life) {
        life.x = ctxGame.canvas.width / 2; // Center the life display horizontally
    }
});*/

resume.addEventListener("click", function(){ // Resume the game
    gameObject.resume();
});

function gameLoop(){
    if (breakGame) return; // Pause the game loop if the game is paused
    else if (!breakGame) {
        if (gameOver) {
            gameObject.gameOverFonction(); // Call the game over function if the game is over
            return;
        }
        else{
            ctxGame.clearRect(0, 0, canvasGame.width, canvasGame.height); // Clear the canvas

            ballAtUpload.forEach(obj=> { // Loop through each ball object
                obj.draw();
                obj.move();
                obj.contact(); // Check for collisions with enemies
            });
            ballAtUpload = ballAtUpload.filter(verif => !verif.destroyed); 

            obstacleAtUpload.forEach(obj=> { // Loop through each obstacle object
                obj.draw();
                obj.move();
                obj.collision(); // Check for collisions
            });
            obstacleAtUpload = obstacleAtUpload.filter(verif => !verif.destroyed);

            lootAtUpload.forEach(obj=> { // Loop through each loot object
                obj.draw();
                obj.move();
                if (obj instanceof Heart) {
                    obj.take(); // Check if the heart is taken by the player
                } else if (obj instanceof Bomb) {
                    obj.explosion(); // Check if the bomb explodes
                }
            });
            lootAtUpload = lootAtUpload.filter(verif => !verif.destroyed);

            enemyAtUpload.forEach(obj=> { // Loop through each enemy object
                obj.draw(); 
                obj.move();
                obj.shoot();
            });
            enemyAtUpload = enemyAtUpload.filter(verif => !verif.destroyed); 

            bossAtUpload.forEach(obj=> { // Loop through each boss object
                obj.draw(); 
                obj.move();
                obj.shoot();
                //obj.shootUpdate();
            });
            bossAtUpload = bossAtUpload.filter(verif => !verif.destroyed);

            gameObject.spawnEnnemy(); // Call the function to spawn enemies

            ennemyBulletAtUpload.forEach(obj=> { // Loop through each enemy bullet object
                obj.draw();
                obj.move();
                obj.contact(); // Check for collisions with the player
            });
            ennemyBulletAtUpload = ennemyBulletAtUpload.filter(verif => !verif.destroyed); // Remove bullets that have been destroyed

            playerAtUpload.draw();
            playerAtUpload.move();
            playerAtUpload.lose(); // Check if the player has lost

            /*ctxGame.fillStyle = "yellow";
            ctxGame.font = "20px Arial";
            ctxGame.fillText(`Vies: ${obj.hp}`, 10, 40);*/

            life.displayLife(playerAtUpload.hp); // Update the player's life hearts
            life.draw(); // Draw the player's life hearts

            level.parrotLevel1(); // Check and update the level based on parrot kills

            gameObject.scoreIncrement(); // Increment the score based on time
            gameObject.displayScore(); // Display the current score

            playerAtUpload.cooldownBar(); // Draw the cooldown bar for the player's cannon shot
        }
        
    }

    requestAnimationFrame(gameLoop); // Call the gameLoop function again to create a loop
}

window.addEventListener("keydown", function(event) { // Handle keydown events for player movement and shooting
    if (gameOver) return; // Ignore key presses if the game is over
    else if(breakGame) return; // Ignore key presses if the game is paused
    switch (event.key) {
        case " ":
            playerAtUpload.canonShot();
            break;
        case "ArrowUp":
            playerAtUpload.shift = -8;
            break;
        case "ArrowDown":
            playerAtUpload.shift = 8;
            break;
    }
}); 

document.addEventListener("keyup", function (event) { // Stop the player's movement when the arrow keys are released
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            playerAtUpload.shift = 0;
        }
    });

canvasGame.addEventListener("touchstart", function(event) {// Listen for touch events on the canvas
    const touch = event.touches[0]; // Get the first touch point
    const rect = canvasGame.getBoundingClientRect(); // Get the canvas position on the screen
    const x = touch.clientX - rect.left; // Calculate the x position relative to the canvas
    const y = touch.clientY - rect.top; // Calculate the y position relative to the canvas

    if (isTouchingObject(x, y, player)) {
        
    }
}, { passive: false }); // Prevent default touch behavior

play.addEventListener("click", function(){
    gameObject = new Game();
    gameObject.startGame(startScreen);
});

restart.addEventListener("click", function(){
    gameObject.restart();
});