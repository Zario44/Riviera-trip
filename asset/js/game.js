class Game{

    
    lastSpawnEnnemy = Date.now();
    intervalSpawn = 5000;
    score = 0;
    oldTimeScore = Date.now(); 
    intervalScore = 600; // Interval in milliseconds to increase the score
    

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

        level = new Level();

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
        lastSpawnEnnemy += timeBreak; // Adjust the last spawn time to account for the pause
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

        this.score = 0; // Reset the score

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
        if (parrotDesroy && !level.parrotBoss && Date.now() - lastSpawnEnnemy >= this.intervalSpawn && !breakGame && !gameOver){
            console.log(Date.now() - lastSpawnEnnemy);
            parrotDesroy = false; // Reset the variable after spawning a new enemy
            let parrot = new Parrot(pictures[6]); // Create a new Parrot enemy
            lastSpawnEnnemy = Date.now(); // Update the last spawn time
            enemyAtUpload.push(parrot); // Add the enemy to the enemy array

            this.intervalSpawn = Math.random(); // Interval in milliseconds between enemy spawns
            if (this.intervalSpawn < 0.5){
                this.intervalSpawn = (this.intervalSpawn + 0.5) * 20000; // Ensure a minimum spawn interval
            }
            else{
                this.intervalSpawn *= 20000; // Scale the interval to a maximum of 20 seconds
            }
            timeBreak = 0; // Reset the time break after spawning an enemy
            console.log("New enemy spawned:", parrot);
        }        
    }

    scoreIncrement(){
        if (Date.now() - this.oldTimeScore >= 1000 && !breakGame && !gameOver) { // Increase score every second
            this.oldTimeScore = Date.now();
            this.score += 1;
        }
        if (scoreObs) {
            this.score += 5; // Increase score by 5 for destroying an obstacle
            scoreObs = false; // Reset the variable after adding the score
        }
        if (scoreParrot){
            this.score += 10; // Increase score by 10 for destroying a parrot
            scoreParrot = false; // Reset the variable after adding the score
        } 
    }

    displayScore(){
        ctxGame.fillStyle = "white";
        ctxGame.font = "20px Arial";
        ctxGame.fillText(this.score, 10, 30); // Display the score at the top-left corner
    }
}

