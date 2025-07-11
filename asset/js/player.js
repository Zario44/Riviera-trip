class ShipPlayer{
    x = 10;
    y = canvasGame.height / 2;
    hp = 6;
    power = 10;
    shift = 0; 
    shotTime = 0; // Initialize shotTime to 0
    

    constructor(hp, power, img){
        this.hp = hp;
        this.power = power;
        this.img = img;
        this.shotTime = 0;
    }

    draw(){

        if(!playerAtUpload.includes(this)){ // Check if the image is already in the array
            playerAtUpload.push(this);// Add the image to the array
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
        this.y += this.shift; // Move the ship vertically based on the shift value
    
        if (this.y < 0) this.y = 0;
        if (this.y + this.img.height > canvasGame.height) this.y = canvasGame.height - this.img.height;
    }

    canonShot(){
        const now = Date.now();
        const recharge = 5000; // 5 seconds recharge time


        if (now - this.shotTime >= recharge){ // Check if the last shot was more than 5 seconds ago
            let canonBall = new CanonBall(pictures[1], this.x + this.img.width, this.y + this.img.height / 2, 1, 20);
            canonBall.draw();
            console.log(canonBall);
            this.shotTime = now; // Update the last shot time
        } 
    }

    lose(){
        if(this.hp <= 0){
            gameOver = true; // Set the game over flag to true
        }
    }
}

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
                this.destroy(); // Destroy the ball after contact
                if (player.hp <= 0) {
                    player.destroy(); // Destroy the player if its HP is 0 or less
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