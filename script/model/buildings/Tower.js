/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représentant le type des tours
class Tower {
    constructor() {
        if (new.target === Cell) {
            throw new TypeError("Cannot construct Tower instances directly");
        }
    }

    getSprite() {
        return this.sprite;
    }

    getShotFrequency() {
        return this.frequency;
    }

    getShotPower() {
        return this.shotPower;
    }

    getMinRange() {
        return this.minRange;
    }

    getMaxRange() {
        return this.maxRange;
    }
    
    isCoolingDown() {
        return this.cooldown;
    }

    getPrice() {
        return this.price;
    }

    coolDown() {
        this.cooldown = true;
        setTimeout(() => {this.cooldown = false;}, 1000 * this.frequency);
    }
}