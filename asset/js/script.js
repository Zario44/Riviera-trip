const play = document.getElementById("play");
const startScreen = document.getElementById("play-screen");

const canvasGame = document.getElementById("game-area");
canvasGame.width = window.innerWidth;
canvasGame.height = window.innerHeight;
const ctxGame = canvasGame.getContext("2d");

const damagePlayer = document.querySelector(".damagePlayer");

let gameOver = false; // Variable to track if the game is over

let ballAtUpload = [];
let playerAtUpload = [];
let obstacleAtUpload = [];
let lootAtUpload = []; 
let enemyAtUpload = []; 
let ennemyBulletAtUpload = []; 


function damageShip(){
    damagePlayer.style.display = "block"; // Show the damage overlay
    setTimeout(() => {
        damagePlayer.style.display = "none"; // Hide the damage overlay after 1 second
    }, 200);
}

function gameLoop(){
    if (gameOver) {
        ctxGame.font = "48px Arial";
        ctxGame.fillStyle = "red";
        ctxGame.fillText("Game Over", canvasGame.width / 2 - 100, canvasGame.height / 2);
        return; // Stop the game loop if the game is over
    }
    ctxGame.clearRect(0, 0, canvasGame.width, canvasGame.height); // Clear the canvas

    playerAtUpload.forEach(obj=> { // Loop through each player object
        obj.draw();
        obj.move();
        obj.lose(); // Check if the player has lost

        ctxGame.fillStyle = "yellow";
        ctxGame.font = "20px Arial";
        ctxGame.fillText(`Vies: ${obj.hp}`, 10, 40);
    }); 

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

    ennemyBulletAtUpload.forEach(obj=> { // Loop through each enemy bullet object
        obj.draw();
        obj.move();
        obj.contact(); // Check for collisions with the player
    });
    ennemyBulletAtUpload = ennemyBulletAtUpload.filter(verif => !verif.destroyed); // Remove bullets that have been destroyed

    

    requestAnimationFrame(gameLoop); // Call the game loop again
}

play.addEventListener("click", function(){

    startScreen.style.display = "none"; // Hide the start screen
    const player = new ShipPlayer(6, 10, new Picture(pictures[0], 1)); // Set the onload event to draw the image once it has loaded
    console.log(player);

    // Load the image and draw it on the canvas
    player.draw();
        
    window.addEventListener("keydown", function(event) {
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

    document.addEventListener("keyup", function (event) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        player.shift = 0;
    }
    });
    
    gameLoop(); // Start the game loop
    spawnObstacle(); // Call the function to spawn obstacles
    spawnEnemy(); // Call the function to spawn enemies
});