/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représentant le type des tours lourdes
class HeavyTower extends Tower { 
    constructor() {
        super();
        this.sprite = heavyTowerSprite;
        this.frequency = 2;
        this.shotPower = 3;
        this.minRange = 1;
        this.maxRange = 4;
        this.price = 100;
    }

    static getConstantes() {
        return {price : 100, shotPower : 3, speed : 0.5};
    }
}