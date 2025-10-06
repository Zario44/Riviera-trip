class Game{

    lastSpawnEnnemy = Date.now();
    intervalSpawn = 15000;
    

    constructor(){
    }

    startGame(btn){
        btn.style.display = "none"; // Hide the start screen
        const player = new ShipPlayer(6, 10, new Picture(pictures[0], 1)); // Set the onload event to draw the image once it has loaded
        console.log(player);

        // Load the image and draw it on the canvas
        player.draw();
        playerAtUpload = player; // Add the player to the player array

        life = new PlayerLife(player); // Create a new PlayerLife object

        spawnObstacle(); // Call the function to spawn obstacles
        gameLoop(); // Start the game loop
    }

    breakGame(){
        breakGame = true;
        stopScreen.style.display = "flex";
        stratBreak = Date.now();
    }

    resume(){
        breakGame = false;
        stopScreen.style.display = "none";
        requestAnimationFrame(gameLoop); // Resume the game loop
        timeBreak = Date.now() - stratBreak;
        lastSpawnEnnemy -= timeBreak;
    }

    gameOverFonction(){
        ctxGame.clearRect(0, 0, canvasGame.width, canvasGame.height); // Clear the canvas
        gameOverScreen.style.display = "flex"; // Show the game over screen

        enemyAtUpload.forEach(obj=> { // Loop through each enemy object
            obj.destroy(); 
        });

        return; // Stop the game loop if the game is over
    }

    restart(){
        gameOver = false;
        breakGame = false;
        gameOverScreen.style.display = "none"; // Hide the game over screen

        obstacleAtUpload = [];
        lootAtUpload = [];
        enemyAtUpload = [];
        ennemyBulletAtUpload = [];
        ballAtUpload = [];
        heartAtUpload = [];

        playerAtUpload = null;
        life = null;

        lastSpawnEnnemy = Date.now();

        clearInterval(intervalId); 
        this.startGame(gameOverScreen); // Restart the game
    }

    spawnEnnemy(){
        if (planeDesroy && Date.now() - lastSpawnEnnemy >= this.intervalSpawn && !breakGame && !gameOver){
            console.log(Date.now() - lastSpawnEnnemy);
            planeDesroy = false; // Reset the variable after spawning a new enemy
            let plane = new Plane(pictures[6]); // Create a new Plane enemy
            lastSpawnEnnemy = Date.now(); // Update the last spawn time
            enemyAtUpload.push(plane); // Add the enemy to the enemy array

            this.intervalSpawn = Math.random(); // Interval in milliseconds between enemy spawns
            if (this.intervalSpawn < 0.5){
                this.intervalSpawn = (this.intervalSpawn + 0.5) * 20000; // Ensure a minimum spawn interval
            }
            else{
                this.intervalSpawn *= 20000; // Scale the interval to a maximum of 20 seconds
            }
            timeBreak = 0; // Reset the time break after spawning an enemy
            console.log("New enemy spawned:", plane);
        }        
    }
}
