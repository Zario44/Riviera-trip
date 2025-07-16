class Enemy {
    img = null;
    x = 0;
    y = 0;
    destroyed = false;

    constructor(img) {
        this.img = new Picture(img, 2); // Assuming img is a path to the image
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
        console.log("Enemy destroyed:", this);
        console.log("Remaining enemies:", enemyAtUpload);
    }
}


class Plane extends Enemy{
    hp = 1;
    damage = 1;
    speed = 2;

    constructor(img) {
        super(img);
        this.img.pictureLoad().then(() => {
            this.shoot(); // Start shooting when the Plane is created
        });

    }

    move() {
        this.y = playerAtUpload[0].y; // Follow the player vertically
    }

    shoot(){
        this.shotInterval = setInterval(() => {
            if (this.destroyed) return; // Stop shooting if the enemy is destroyed
            const bullet = new EnemyBullet(pictures[1], this.x - 10, this.y + this.img.height / 2, this.damage, -20);
            bullet.img.pictureLoad().then(() => {
                ennemyBulletAtUpload.push(bullet);
            });
        }, 3500);
    }
}

function spawnEnemy() {
    if(gameOver) return; // Stop spawning if the game is over

    let timer = null;


    if (enemyAtUpload.length > 0) return; // Stop spawning if there are already enemies
    if (timer !== null) return; // Prevent multiple timers from being set

    timer = setInterval(() => {

        let plane = new Plane(pictures[6]); // Create a new Plane enemy
        enemyAtUpload.push(plane); // Add the enemy to the enemy array
        console.log("New enemy spawned:", plane);

        timer = null; // Clear the timer after spawning an enemy
    }, 20000); // Wait 10 seconds between spawning the enemy

}
