class Level {
    parrotLevel = false;
    parrotBoss = false;

    nbEnnemieDestroy = 2;
    boss = null;

    parrotLevel1(){
        this.parrotLevel = true;
        if (this.nbEnnemieDestroy === 3) {
            console.log("Boss incoming!");
            this.parrotBoss = true;
            this.nbEnnemieDestroy = 0;
            intervalObs = 500; // Increase the spawn interval for obstacles during the boss fight
            this.boss = new ParrotBoss(pictures[6]); // Create a new ParrotBoss enemy
            bossAtUpload.push(this.boss); // Add the boss to the enemy array
        }
        if (this.parrotBoss && this.boss.hp <= 0) {
            this.parrotBoss = false;
        }
    }
}