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
// A MODIFIER

        const direction = 

        this.y = playerAtUpload.y; // Follow the player vertically
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

    destroy() {
        super.destroy(); // Call the parent destroy method
        planeDesroy = true; // Set the variable to true when the plane is destroyed
    }
}


let planeDesroy = true; // Variable to track if the plane has been destroyed

function spawnEnemy() {
    if (breakGame) return; // Stop spawning enemies if the game is paused
    else{
        let ratioRecharge = Math.random();

        if (ratioRecharge < 0.5){
            ratioRecharge += 0.5; // Ensure a minimum recharge ratio
        }

        if (planeDesroy){
            planeDesroy = false; // Reset the variable after spawning a new enemy

            setTimeout(() => {
                let plane = new Plane(pictures[6]); // Create a new Plane enemy
                enemyAtUpload.push(plane); // Add the enemy to the enemy array
                console.log("New enemy spawned:", plane);

            }, ratioRecharge * 20000); // Wait between 10 and 20 seconds before spawning a new enemy
        }
    }
}
