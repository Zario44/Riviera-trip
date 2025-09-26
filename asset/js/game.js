class Game{
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
    }

    resume(){
        breakGame = false;
        stopScreen.style.display = "none";
        requestAnimationFrame(gameLoop); // Resume the game loop
    }

    gameOverFonction(){
        ctxGame.clearRect(0, 0, canvasGame.width, canvasGame.height); // Clear the canvas
        gameOverScreen.style.display = "flex"; // Show the game over screen
        stopBtn.style.display = "none";
        return; // Stop the game loop if the game is over
    }

    restart(){
        gameOver = false;
        breakGame = false;
        gameOverScreen.style.display = "none"; // Hide the game over screen

        planeDesroy = true; // Reset the plane destroyed variable

        obstacleAtUpload = [];
        lootAtUpload = [];
        enemyAtUpload = [];
        ennemyBulletAtUpload = [];
        ballAtUpload = [];
        heartAtUpload = [];

        playerAtUpload = null;
        life = null;

        clearInterval(intervalId); 
        clearTimeout(timoutId); 
        this.startGame(gameOverScreen); // Restart the game
    }
}
