class Enemy {
    img = null;
    x = 0;
    y = 0;
    destroyed = false;

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


class Plane extends Enemy{
    hp = 1;
    damage = 1;
    speed = 2;
    lastShoot = Date.now();
    shotInterval = 3000; // Time in milliseconds between shots
    

    constructor(img) {
        super(img);
        this.img.pictureLoad().then(() => {
            this.shoot(); // Start shooting when the Plane is created
        });
    }

    move() {
// A MODIFIER

        //const direction = 

        this.y = playerAtUpload.y; // Follow the player vertically
    }

    shoot(){
        /*if (this.shotInterval || breakGame) return; // Prevent multiple intervals or shooting when the game is paused
        this.shotInterval = setInterval(() => {
            if (this.destroyed) return; // Stop shooting if the enemy is destroyed
            if (breakGame){
       
            }
            
            bullet.img.pictureLoad().then(() => {
                ennemyBulletAtUpload.push(bullet);
            });
        }, 3500);*/

        if (Date.now() - this.lastShoot >= this.shotInterval && !breakGame && !gameOver){
            const bullet = new EnemyBullet(pictures[1], this.x - 10, this.y + this.img.height / 2, this.damage, -20);
            this.lastShoot = Date.now(); // Update the last spawn time
            bullet.img.pictureLoad().then(() => { // Ensure the image is loaded before adding the bullet
                ennemyBulletAtUpload.push(bullet);
            });
            timeBreak = 0;
        }
    }

    destroy() {
        super.destroy(); // Call the parent destroy method
        planeDesroy = true; // Set the variable to true when the plane is destroyed
    }
}
