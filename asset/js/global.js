function damageShip(){
    damagePlayer.style.display = "block"; // Show the damage overlay
    setTimeout(() => {
        damagePlayer.style.display = "none"; // Hide the damage overlay after 1 second
    }, 200);
}

function inCollision(a, b) { // Check if two objects are colliding
    if (a.img && b.img) { // Check if both objects have images
        return (
            a.x < b.x + b.img.width &&
            a.x + a.img.width > b.x &&
            a.y < b.y + b.img.height &&
            a.y + a.img.height > b.y
        );
    } 
    if (a.img && !b.img) { // Check if only the first object has an image
        return (
            a.x < b.x + b.width &&
            a.x + a.img.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.img.height > b.y
        );
    }
    if (!a.img && b.img) { // Check if only the second object has an image
        return (
            a.x < b.x + b.img.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.img.height &&
            a.y + a.height > b.y
        );
    }
    if (!a.img && !b.img) { // Check if neither object has an image
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }    
}

