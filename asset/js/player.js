class ShipPlayer{
    x = 10;
    y = canvasGame.height / 2;
    hpMax = 6; // Maximum HP of the player
    hp = 6;
    power = 10;
    shift = 0; 
    shotTime = 0; // Initialize shotTime to 0
    recharge = 5000; // 5 seconds recharge time


    constructor(hpMax, power, img){
        this.hpMax = hpMax;
        this.power = power;
        this.img = img;
        this.shotTime = 0;
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

    move(){
        this.y += this.shift; // Move the ship vertically based on the shift value
    
        if (this.y < 0) this.y = 0;
        if (this.y + this.img.height > canvasGame.height) this.y = canvasGame.height - this.img.height;
    }

    canonShot(){
        const now = Date.now();


        if (now - this.shotTime >= this.recharge){ // Check if the last shot was more than 5 seconds ago
            let canonBall = new CanonBall(pictures[1], this.x + this.img.width, this.y + this.img.height / 2, 1, 20);
            canonBall.draw();
            console.log(canonBall);
            this.shotTime = now; // Update the last shot time
        } 
    }

    cooldownBar(){
        const now = Date.now();
        const elapsed = now - this.shotTime; // Calculate the elapsed time since the last shot
        let ratio = Math.min(elapsed / this.recharge, 1); // Calculate the width of the cooldown bar
         

        const barWidth = this.img.width - 20; // Width of the cooldown bar
        const barHeight = 10; // Height of the cooldown bar
        const barX = this.x + 10; // X position of the cooldown bar
        let barY = this.y + this.img.height + 10; // Y position of the cooldown bar
        const radius = 5; // Radius of the corners of the cooldown bar

        if (barY + barHeight > canvasGame.height) {
            barY = this.y - 10; // Adjust the Y position if it goes out of bounds
        }

        function drawRoundedRect(x, y, width, height, radius, fillColor, strokeColor) {
            ctxGame.beginPath();
            ctxGame.moveTo(x + radius, y);
            ctxGame.lineTo(x + width - radius, y);
            ctxGame.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctxGame.lineTo(x + width, y + height - radius);
            ctxGame.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctxGame.lineTo(x + radius, y + height);
            ctxGame.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctxGame.lineTo(x, y + radius);
            ctxGame.quadraticCurveTo(x, y, x + radius, y);
            ctxGame.closePath();

            ctxGame.fillStyle = fillColor;
            ctxGame.fill();
            if (strokeColor) {
                ctxGame.strokeStyle = strokeColor;
                ctxGame.stroke();
            }
        }

        // Dessine le fond de la barre (gris)
        drawRoundedRect(barX, barY, barWidth, barHeight, radius, "rgb(0, 0, 0, 0.5)", "black");

        // Dessine le remplissage (rouge -> vert)
        const fillColor = ratio === 1 ? "yellow" : "red";
        drawRoundedRect(barX, barY, barWidth * ratio, barHeight, radius, fillColor);
    }

    lose(){
        if(this.hp <= 0){
            gameOver = true; // Set the game over flag to true
        }
    }
}

class PlayerLife{
    y = 0;
    x = ctxGame.canvas.width/2;
    heartCount = []; 

    constructor(player){
        this.player = player;
        this.displayLife(this.player.hpMax); // Call the method to display the hearts        
    }

    displayLife(hp){
        this.heartCount = []; // Reset the heart count array

        if (hp % 2 === 0) { // If the maximum HP is even
           for (let i = 0; i < hp/2; i++){
                const x = this.x + i * 60;
                const y = this.y;
                this.heartCount.push({ img: heartFull, x, y });
                
            } 
        }
        else{
            let i = 0
            for (i; i < Math.ceil(hp/2); i++){
                const x = this.x + i * 60;
                const y = this.y;
                this.heartCount.push({ img: heartFull, x, y });
         
            } 
            this.heartCount.pop(); // Remove the last heart if the player's HP is odd
            const x = this.x + (i-1) * 60;
            const y = this.y;
            this.heartCount.push({ img: heartHalf, x, y });
            
            if(hp < 1){
                this.heartCount.pop(); // Remove the last heart if the player's HP is less than 1
            }
        }
        
    }

    draw(){

        this.heartCount.forEach(heart => {
            if (heart.img.loaded && heart.img.img instanceof HTMLImageElement) { // Check if the image is loaded and is an instance of HTMLImageElement
                ctxGame.drawImage(heart.img.img, heart.x, heart.y, heart.img.width, heart.img.height);
            }
            else{
                heart.img.pictureLoad().then(() => {
                    ctxGame.drawImage(heart.img.img, heart.x, heart.y, heart.img.width, heart.img.height);
                }).catch((error) => {
                    console.error("Erreur lors du chargement de l'image :", error);
                });
            }
        });      
    }
}