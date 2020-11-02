/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représentant le type des tours ralentissantes
class SlowDownTower extends Tower {
    constructor() {
        super();
        this.sprite = slowDownTowerSprite;
        this.frequency = 1;
        this.shotPower = 0;
        this.minRange = 1;
        this.maxRange = 4;
        this.price = 50;
    }

    static getConstantes() {
        return {price : 50, shotPower : "ralenti", speed : 1};
    }
}