let pictures = [
    "asset/picture/ship_player.png",
    "asset/picture/canon_ball.png",
    "asset/picture/log.png",
    "asset/picture/barrel.png",
    "asset/picture/heart.png",
    "asset/picture/bomb.png",
    "asset/picture/plane.png",
]


class Picture{
    picture = "";
    loaded = false;
    formatDivision = 1;

    constructor(picture, formatDivision){
        this.picture = picture;
        this.formatDivision = formatDivision;
    }
    
    pictureLoad(){ // Method to load the image asynchronously
        if (this.loaded === false){
            return new Promise((resolve, reject) => { // Create a new Promise to handle the asynchronous loading of the image
                const img = new Image(); // Create a new image object
                img.src = this.picture; // Set the source of the image
                
                img.onload = () => {
                    this.img = img; // Return the image object when it has loaded
                    this.loaded = true;
                    this.width = img.width/this.formatDivision;
                    this.height = img.height/this.formatDivision;
                    resolve();
                }

                img.onerror = () => {
                    reject(new Error("Erreur lors du chargement de l'image"));
                };
            });
        }    
    }
}