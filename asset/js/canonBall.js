class CanonBall{
    powerOrder = 1; 
    img = null;
    x = 0;
    y = 0;
    speed = 10; 
    damage = 1;
    destroyed = false;

    constructor(img, x, y, damage, speed){
        this.img = new Picture(img, 0.15); // Assuming img is a path to the image
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
            console.log("Ball out of bounds and destroyed:", this);
        } else {
            this.x = newX;
        }
    }

    contact(){

        enemyAtUpload.forEach(enemy => {
            if (inCollision(this, enemy)) { // Check collision with enemy
                enemy.hp -= this.damage;
                this.destroy(); // Destroy the ball after contact
                console.log("Ball destroyed after contact with enemy:", this);
                if (enemy.hp <= 0) {
                    enemy.destroy(); // Destroy the enemy if its HP is 0 or less
                    level.nbEnnemieDestroy += 1; // Increment the parrot destroy count in the level
                    console.log("nbEnnemieDestroy:", level.nbEnnemieDestroy);
                }
            }
        });
        bossAtUpload.forEach(enemy => {
            if (inCollision(this, enemy)) { // Check collision with enemy
                enemy.hp -= this.damage;
                this.destroy(); // Destroy the ball after contact
                console.log("Ball destroyed after contact with boss:", this);
                if (enemy.hp <= 0) {
                    enemy.destroy(); // Destroy the enemy if its HP is 0 or less
                    
 
                }
            }
        });
    }

    destroy(){
        this.destroyed = true; // Mark the object for destruction
        console.log("Ball destroyed:", this);
    }
}


class ParrotAttack extends CanonBall{
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
    
        if (inCollision(this, playerAtUpload)) { // Check collision with player
            playerAtUpload.hp -= this.damage;
            damageShip();
            this.destroy(); // Destroy the ball after contact
            console.log("Enemy bullet destroyed after contact with player:", this);
            if (playerAtUpload.hp <= 0) {
                playerAtUpload.lose(); // Destroy the player if its HP is 0 or less
            }
        }
    

        enemyAtUpload.forEach(enemy => {
            if (inCollision(this, enemy)) { // Check collision with enemy
                return; // Do nothing if the bullet hits an enemy
            }
        });

        bossAtUpload.forEach(boss => {
            if (inCollision(this, boss)) { // Check collision with enemy
                return; // Do nothing if the bullet hits an enemy
            }
        });
    }
}

class ParrotBossAttack extends CanonBall{
    constructor(img, x, y, damage, speed, player) {
        super(img, x, y, damage, speed);
        
        // Calculate the angle towards the player at the moment of shooting
        const dx = (player.x + player.img.width / 2) - x;
        const dy = (player.y + player.img.height / 2) - y;
        const angle = Math.atan2(dy, dx);

        // Set velocity components based on the angle
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
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

    move(){
        this.x += this.vx;
        this.y += this.vy;

        if (this.x > canvasGame.width || this.x < 0 || this.y > canvasGame.height || this.y < 0) {
            this.destroy();
        }
    }

    contact(){
    
        if (inCollision(this, playerAtUpload)) { // Check collision with player
            playerAtUpload.hp -= this.damage;
            damageShip();
            this.destroy(); // Destroy the ball after contact
            console.log("Enemy bullet destroyed after contact with player:", this);
            if (playerAtUpload.hp <= 0) {
                playerAtUpload.lose(); // Destroy the player if its HP is 0 or less
            }
        }
    

        enemyAtUpload.forEach(enemy => {
            if (inCollision(this, enemy)) { // Check collision with enemy
                return; // Do nothing if the bullet hits an enemy
            }
        });

        bossAtUpload.forEach(boss => {
            if (inCollision(this, boss)) { // Check collision with enemy
                return; // Do nothing if the bullet hits an enemy
            }
        });
    }
}