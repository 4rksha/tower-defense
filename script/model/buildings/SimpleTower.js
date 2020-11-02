/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représentant le type des tours simples
class SimpleTower extends Tower {
    constructor() {
        super();
        this.sprite = simpleTowerSprite;
        this.frequency = 2;
        this.shotPower = 1;
        this.minRange = 1;
        this.maxRange = 4;
        this.price = 10;
    }


    static getConstantes() {
        return {price : 10, shotPower : 1, speed : 1};
    }
}