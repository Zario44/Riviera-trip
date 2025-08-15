const play = document.getElementById("play");
const startScreen = document.getElementById("play-screen");

const canvasGame = document.getElementById("game-area");
canvasGame.width = window.innerWidth;
canvasGame.height = window.innerHeight;
const ctxGame = canvasGame.getContext("2d");

const damagePlayer = document.querySelector(".damagePlayer");
const playerTouchZone = document.getElementById("touchPlayer");

let gameOver = false; // Variable to track if the game is over
let timer = null;

const heartFull  = new Picture(heartPicture[1], 5);
const heartHalf  = new Picture(heartPicture[2], 5);

Promise.all([heartFull.pictureLoad(), heartHalf.pictureLoad()]); // Load the heart images

let ballAtUpload = [];
let playerAtUpload = null;
let heartAtUpload = [];
let obstacleAtUpload = [];
let lootAtUpload = []; 
let enemyAtUpload = []; 
let ennemyBulletAtUpload = []; 


function gameLoop(){
    if (gameOver) {
        ctxGame.font = "48px Arial";
        ctxGame.fillStyle = "red";
        ctxGame.fillText("Game Over", canvasGame.width / 2 - 100, canvasGame.height / 2);
        return; // Stop the game loop if the game is over
    }
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
    });
    enemyAtUpload = enemyAtUpload.filter(verif => !verif.destroyed); //

    spawnEnemy(); // Call the function to spawn enemies

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

    playerAtUpload.cooldownBar(); // Draw the cooldown bar for the player's cannon shot
   

    requestAnimationFrame(gameLoop); // Call the game loop again
}

play.addEventListener("click", function(){

    startScreen.style.display = "none"; // Hide the start screen
    const player = new ShipPlayer(6, 10, new Picture(pictures[0], 1)); // Set the onload event to draw the image once it has loaded
    console.log(player);

    // Load the image and draw it on the canvas
    player.draw();
    playerAtUpload = player; // Add the player to the player array

    life = new PlayerLife(player); // Create a new PlayerLife object
        
    window.addEventListener("keydown", function(event) {
        if (gameOver) return; // Ignore key presses if the game is over
        switch (event.key) {
            case " ":
                player.canonShot();
                break;
            case "ArrowUp":
                player.shift = -8;
                break;
            case "ArrowDown":
                player.shift = 8;
                break;
        }
    }); 

    canvasGame.addEventListener("touchstart", function(event) {
        const touch = event.touches[0];
        const rect = canvasGame.getBoundingClientRect(); // Get the canvas position on the screen
        const x = touch.clientX - rect.left; // Calculate the x position relative to the canvas
        const y = touch.clientY - rect.top; // Calculate the y position relative to the canvas

        if (isTouchingObject(x, y, player)) {
            
        }
    }, { passive: false }); // Prevent default touch behavior

    document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        player.shift = 0;
    }
    });


    
    spawnObstacle(); // Call the function to spawn obstacles
    gameLoop(); // Start the game loop
});