class CanonBall{
    powerOrder = 1; 
    img = null;
    x = 0;
    y = 0;
    speed = 10; 
    damage = 1;
    destroyed = false;

    constructor(img, x, y, damage, speed){
        this.img = new Picture(img, 6); // Assuming img is a path to the image
        this.x = x;
        this.damage = damage ;
        this.speed = speed;
        this.img.pictureLoad().then(() => {
            this.y = y - this.img.height / 2;
        });
    }

    draw(){

        if(!ballAtUpload.includes(this)){ // Check if the image is already in the array
            ballAtUpload.push(this);// Add the image to the array
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
        const newX = this.x + this.speed;

        // Check out of bounds horizontally
        if (newX + this.img.width > canvasGame.width || newX < 0) {
            this.destroy();
        } else {
            this.x = newX;
        }
    }

    contact(){

        enemyAtUpload.forEach(enemy => {
            if (inCollision(this, enemy)) { // Check collision with enemy
                enemy.hp -= this.damage;
                this.destroy(); // Destroy the ball after contact
                if (enemy.hp <= 0) {
                    enemy.destroy(); // Destroy the enemy if its HP is 0 or less
                }
            }
        });
    }

    destroy(){
        this.destroyed = true; // Mark the object for destruction
    }
}


class EnemyBullet extends CanonBall{
    constructor(img, x, y, damage, speed){
        super(img, x, y, damage, speed);
    }

    draw(){
        if(!ennemyBulletAtUpload.includes(this)){ // Check if the image is already in the array
            ennemyBulletAtUpload.push(this);// Add the image to the array
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

    contact(){
        playerAtUpload.forEach(player => {
            if (inCollision(this, player)) { // Check collision with player
                player.hp -= this.damage;
                damageShip();
                this.destroy(); // Destroy the ball after contact
                if (player.hp <= 0) {
                    player.lose(); // Destroy the player if its HP is 0 or less
                }
            }
        });

        enemyAtUpload.forEach(enemy => {
            if (inCollision(this, enemy)) { // Check collision with enemy
                return; // Do nothing if the bullet hits an enemy
            }
        });
    }
}