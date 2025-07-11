class Enemy {
    img = null;
    x = canvasGame.width + 50;
    y = 0;
    destroyed = false;

    constructor(img) {
        this.img = new Picture(img, 2); // Assuming img is a path to the image
        this.img.pictureLoad().then(() => {
            this.y = Math.random() * (canvasGame.height - this.img.height);
        });
    }

    draw(){
        if(!enemyAtUpload.includes(this)){ // Check if the image is already in the array
            enemyAtUpload.push(this);// Add the image to the array
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
}


class Plane extends Enemy{
    hp = 3;
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
        this.shootInterval = setInterval(() => {
            const bullet = new CanonBall(pictures[1], this.x, this.y + this.img.height / 2, this.damage, -10);
            
            bullet.img.pictureLoad().then(() => {
                ballAtUpload.push(bullet);
            });
        }, 4000);
    }

    destroy() {
        this.destroyed = true; // Mark the object for destruction
    }
}

function spawnEnemy() {
    if (enemyAtUpload.length === 0) { 
        setTimeout(() => {
            let plane = new Plane(pictures[6]); // Create a new Plane enemy
            enemyAtUpload.push(plane); // Add the enemy to the enemy array
        }, 20000); // Wait 20 seconds between spawning the enemy
    }
}
