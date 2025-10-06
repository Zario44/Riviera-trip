let pictures = [
    "asset/picture/ship_player.png",
    "asset/picture/canon_ball.png",
    "asset/picture/log.png",
    "asset/picture/barrel.png",
    "asset/picture/lootHearth.png",
    "asset/picture/dynamite.png",
    "asset/picture/parrot.png",
]

let heartPicture = [
    "asset/picture/emptyHearth.png",
    "asset/picture/fullHearth.png",
    "asset/picture/halfHearthV1.png",
]


class Picture{
    picture = "";
    loaded = false;
    formatMult = 1;

    constructor(picture, formatMult){
        this.picture = picture;
        this.formatMult = formatMult;
    }
    
    pictureLoad(){ // Method to load the image asynchronously
        if (this.loaded === false){
            return new Promise((resolve, reject) => { // Create a new Promise to handle the asynchronous loading of the image
                const img = new Image(); // Create a new image object
                img.src = this.picture; // Set the source of the image
                
                img.onload = () => {
                    this.img = img; // Return the image object when it has loaded
                    this.loaded = true;
                    this.width = img.width*this.formatMult;
                    this.height = img.height*this.formatMult;
                    resolve();
                }

                img.onerror = () => {
                    reject(new Error("Erreur lors du chargement de l'image"));
                };
            });
        }    
    }
}