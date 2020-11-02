/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représentant un joueur 
 class Player {
    constructor() {
         this.money = 15;
         this.health = 3;
         this.score = 0;
    }

    getMoney() {
        return this.money;
    }

    addGoldAmount(amount) {
        this.money += amount;
    }

    getHealth() {
        return this.health;
    }

    damage() {
        this.health--;
    }

    getScore() {
        return this.score;
    }

    addScoreAmount(amount) {
        this.score += amount;
    }

    isDead() {
        return this.health == 0;
    }
    
}