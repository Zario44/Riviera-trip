class Enemy {
    img = null;
    x = 0;
    y = 0;
    destroyed = false;
    playerY = 0;
    projetile = null;

    constructor(img) {
        this.img = new Picture(img, 0.5); // Assuming img is a path to the image
        this.img.pictureLoad().then(() => {
            this.y = Math.random() * (canvasGame.height - this.img.height);
            this.x = canvasGame.width - this.img.width - 50;
        });
    }

    draw(){
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

    destroy() {
        console.log("Enemies:", enemyAtUpload);
        this.destroyed = true; // Mark the object for destruction
        if (this.shotInterval) {
            clearInterval(this.shotInterval);// Clear the shooting interval if it exists
        }
        lastSpawnEnnemy = Date.now(); // Update the last spawn time when an enemy is destroyed
        console.log("Enemy destroyed:", this);
        console.log("Remaining enemies:", enemyAtUpload);
    }
    
}


class Parrot extends Enemy{
    hp = 1;
    damage = 1;
    speed = 6;
    lastShoot = Date.now();
    shotInterval = 3500; // Time in milliseconds between shots
    

    constructor(img) {
        super(img); // Call the parent constructor
        this.img.pictureLoad().then(() => {
            this.shoot(); // Start shooting when the Parrot is created
        });
    }

    move() {

        if (this.y < playerAtUpload.y) {
            if (this.y + this.speed > playerAtUpload.y) this.y = playerAtUpload.y;
            else this.y += this.speed;
        }
        else if (this.y > playerAtUpload.y) {
            if (this.y - this.speed < playerAtUpload.y) this.y = playerAtUpload.y;
            else this.y -= this.speed;
        }
        else this.y = playerAtUpload.y;

        if (this.x > canvasGame.width - this.img.width - 50) this.x -= this.speed; // Move left until a certain point
        else if (this.x < canvasGame.width - this.img.width - 50) this.x += this.speed; // Move right if it goes too far left

        //this.y = playerAtUpload.y; // Follow the player vertically
    }

    shoot(){
        if (Date.now() - this.lastShoot >= this.shotInterval && !breakGame && !gameOver){
            this.projetile = new ParrotAttack(pictures[1], this.x - 10, this.y + this.img.height / 2, this.damage, -20);
            this.lastShoot = Date.now(); // Update the last spawn time
            this.projetile.img.pictureLoad().then(() => { // Ensure the image is loaded before adding the bullet
                ennemyBulletAtUpload.push(this.projetile);
            });
            this.playerY = playerAtUpload.y; // Update the player's Y position at the time of shooting
            timeBreak = 0;
        }
    }

    destroy() {
        super.destroy(); // Call the parent destroy method
        parrotDesroy = true; // Set the variable to true when the parrot is destroyed
        scoreParrot = true; // Set the variable to true when a parrot is destroyed
    }
}

class ParrotBoss extends Parrot{
    hp = 3;
    damage = 1;
    yI = 0;

    constructor(img) {
        super(img);
        this.img.pictureLoad().then(() => {
            this.shoot(); // Start shooting when the Parrot is created
            this.y = (canvasGame.height - this.img.height) / 2; // Center the boss vertically

        });
    }

    move() {} // Boss does not move

    shoot(){
        if (Date.now() - this.lastShoot >= this.shotInterval && !breakGame && !gameOver){
            this.projetile = new ParrotBossAttack(pictures[1], this.x - 10, this.y + this.img.height / 2, this.damage, -20);
            this.lastShoot = Date.now(); // Update the last spawn time
            console.log("Boss shooting");

            this.projetile.img.pictureLoad().then(() => { // Ensure the image is loaded before adding the bullet
                ennemyBulletAtUpload.push(this.projetile);
                console.log("Bullet ennemy added: ", this.projetile);
            });

            this.playerY = playerAtUpload.y; // Update the player's Y position at the time of shooting
            this.yI = (playerAtUpload.y - this.y) / (this.x - playerAtUpload.x + playerAtUpload.width); // Calculate the slope to the player's current position

            timeBreak = 0;
        }
        
    }

    shootUpdate(){
        if (this.projetile) {
            this.projetile.y += this.yI * 20;
        }
    }

    destroy() {
        Enemy.prototype.destroy.call(this); //Call Ennemy destroy method
    }

}
