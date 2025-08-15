function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|Tablet/i.test(navigator.userAgent);
}

if(isMobileDevice()){
    gameOver = true; // Set gameOver to true if the device is mobile
}