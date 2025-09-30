class Obstacle{

    x = canvasGame.width; // Start at the right edge of the canvas
    y = 0;

    collision(){

        if (inCollision(this, playerAtUpload)) {
            this.destroy();
            playerAtUpload.hp -= this.damage; // Reduce player's health by the obstacle's damage
            damageShip(); // Call the function to handle player damage
            console.log(`Player hit by obstacle! Remaining HP: ${playerAtUpload.hp}`);
        }


        ballAtUpload.forEach(ball => {
            if (inCollision(this, ball) && this.powerOrder > ball.powerOrder) {
                ball.destroy(); // Destroy the ball on collision with the obstacle
            } else if (inCollision(this, ball) && this.powerOrder === ball.powerOrder) {
                this.destroy(); // Destroy both the obstacle and the ball if they have the same power order
                ball.destroy();
                if (this instanceof Barrel) { // If the obstacle is a Barrel, spawn loot
                    this.loot(); // Call the loot method to spawn loot
                }
            }      
        });

        obstacleAtUpload.forEach(obs => {
            if (inCollision(this, obs) && obs !== this && this.powerOrder > obs.powerOrder) { // Check collision with other obstacles
                obs.destroy(); // Destroy the other obstacle on collision
                if (this instanceof Barrel) { // If the obstacle is a Barrel, spawn loot
                    this.loot(); // Call the loot method to spawn loot
                }
                
            }
            else if (inCollision(this, obs) && obs !== this && this.powerOrder === obs.powerOrder) {
                this.destroy(); // Destroy twice obstacle if  equal power order
                obs.destroy();
                if (this instanceof Barrel && typeof this.loot === "function") { // If the obstacle is a Barrel, spawn loot
                    this.loot(); // Call the loot method to spawn loot
                }
            }
            
        });
    }

    draw(){
        if(!obstacleAtUpload.includes(this)){ // Check if the image is already in the array
            obstacleAtUpload.push(this);// Add the image to the array
        }

        if (this.img.loaded && this.img.img instanceof HTMLImageElement) { // Check if the image is loaded and is an instance of HTMLImageElement
            ctxGame.drawImage(this.img.img, this.x, this.y, this.img.width, this.img.height);
        }
        else{
            this.img.pictureLoad().then(() => {
                ctxGame.drawImage(this.img.img, this.x, this.y, this.img.width, this.img.height);
            }).catch((error) => {
                console.error("Erreur lors du chargement de l'image :", error);
            });
        }
    }

    move(){
        const newX = this.x - this.speed;

        // Check out of bounds horizontally
        if (newX + this.img.width < 0) {
            this.destroy();
        } else {
            this.x = newX;
        }
    }

    destroy(){
        this.destroyed = true; // Mark the object for destruction
    }
}


class Log extends Obstacle{
    powerOrder = 1;
    img = null;
    speed = 4; 
    damage = 2;
    destroyed = false;

    constructor(img){
        super(); // Call the parent constructor
        this.img = new Picture(img, 1);
        this.img.pictureLoad().then(() => {
            this.y = Math.random() * (canvasGame.height - this.img.height);
        });
        
    }

}


class Wave extends Obstacle{
    powerOrder = 2;
    img = null;
    speed = 8; 
    damage = 3;
    destroyed = false;
    height = 100; // Height of the wave
    width = 80; // Width of the wave

    constructor(height){
        super(); // Call the parent constructor
        this.height = height;
        this.y = Math.random() * (canvasGame.height - this.height);
    }

    draw(){
        if(!obstacleAtUpload.includes(this)){ // Check if the image is already in the array
            obstacleAtUpload.push(this);// Add the image to the array
        }

        ctxGame.fillStyle = "blue"; // Set the color for the wave
        ctxGame.fillRect(this.x, this.y, this.width, this.height); // Draw the wave as a rectangle
    }

    move(){
        const newX = this.x - this.speed;

        // Check out of bounds horizontally
        if (newX + this.width < 0) {
            this.destroy();
        } else {
            this.x = newX;
        }
    }
}










class Barrel extends Obstacle{
    powerOrder = 1;
    img = null;
    speed = 4; 
    damage = 1;
    destroyed = false;

    constructor(img){
        super(); // Call the parent constructor
        this.img = new Picture(img, 1);
        this.img.pictureLoad().then(() => {
            this.y = Math.random() * (canvasGame.height - this.img.height);
        });
    }

    loot(){
        if (Math.random() < 0.5) { 
            let heart = new Heart(pictures[4], this.x, this.y); 
            console.log("Heart spawned");
            lootAtUpload.push(heart); 
            return heart; 
        }
        else {
            let bomb = new Bomb(pictures[5], this.x, this.y); 
            console.log("Bomb spawned");
            lootAtUpload.push(bomb);
            return bomb; 
        }
    }
}


class LootBarrel{
    img = null;
    x = 0;
    y = 0;
    speed = 4;
    destroyed = false;

    constructor(img, x, y){
        this.img = new Picture(img, 1.8);
        this.x = x; 
        this.y = y; 
    }

    draw(){
        if(!lootAtUpload.includes(this)){ // Check if the image is already in the array
            lootAtUpload.push(this);// Add the image to the array
        }

        if (this.img.loaded && this.img.img instanceof HTMLImageElement) { // Check if the image is loaded and is an instance of HTMLImageElement
            ctxGame.drawImage(this.img.img, this.x, this.y, this.img.width, this.img.height);
        }
        else{
            this.img.pictureLoad().then(() => {
                ctxGame.drawImage(this.img.img, this.x, this.y, this.img.width, this.img.height);
            }).catch((error) => {
                console.error("Erreur lors du chargement de l'image :", error);
            });
        }
    }

    move(){
        const newX = this.x - this.speed;

        // Check out of bounds horizontally
        if (newX + this.img.width < 0) {
            this.destroy();
        } else {
            this.x = newX;
        }
    }

    destroy(){
        this.destroyed = true; // Mark the object for destruction
    }
}


class Heart extends LootBarrel{
    constructor(img, x, y){
        super(img, x, y); // Call the parent constructor with type 1 for Heart
    }

    take(){
        
        if (inCollision(this, playerAtUpload)) {
            if (playerAtUpload.hp + 2 <= playerAtUpload.hpMax) {
                playerAtUpload.hp += 2;
            } else {
                playerAtUpload.hp = playerAtUpload.hpMax; // Ensure HP does not exceed maximum
            }
            console.log(`Heart taken! Player HP: ${playerAtUpload.hp}`);
            this.destroy(); // Destroy the heart after taking it
        }
     
    }
}


class Bomb extends LootBarrel{
    constructor(img, x, y){
        super(img, x, y); // Call the parent constructor with type 2 for Bomb
    }

    explosion(){
      
        if (inCollision(this, playerAtUpload)) {
            playerAtUpload.hp -= 2; // Reduce player's health by 2
            damageShip();
            console.log(`Bomb exploded! Player HP: ${playerAtUpload.hp}`);
            this.destroy(); // Destroy the bomb after explosion
        }


        obstacleAtUpload.forEach(obs => {
            if (inCollision(this, obs)) {
                obs.destroy(); // Destroy the obstacle on bomb explosion
            }
        });
    }
}


function spawnObstacle(){
    const interval = 400; // Interval in milliseconds between obstacle spawns
    const value = 0.5; // Probability value for spawning a obstacle

    
    intervalId = setInterval(() => {
        if (breakGame || gameOver) return; // Stop spawning obstacles if the game is paused
        else{
            if (Math.random() <= value) { // Randomly decide whether to spawn an obstacle
                if(Math.random() <= 0.8){
                    let log = new Log(pictures[2], 1); // Create a new Log obstacle
                    obstacleAtUpload.push(log); // Add the log to the obstacle array
                    return log; // Return the log object
                }
                else if(Math.random() <= 0.93){
                    let barrel = new Barrel(pictures[3], 2); // Create a new Barrel obstacle
                    obstacleAtUpload.push(barrel); // Add the barrel to the obstacle array
                    console.log(obstacleAtUpload);
                    return barrel; // Return the barrel object
                }
                else {
                    let wave = new Wave(300); // Create a new Wave obstacle
                    obstacleAtUpload.push(wave); // Add the wave to the obstacle array
                    
                    return wave; // Return the wave object
                }
            }
        }
    }, interval); // Set the interval for spawning obstacles 
    
    
}