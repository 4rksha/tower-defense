/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

// Classe représentant le type des cellules
var CellType = Array(
    ENTRY = 0, 
    GOAL = 1
);

class Cell {
    constructor() {
        if (new.target === Cell) {
            throw new TypeError("Cannot construct Cell instances directly");
        }
    }
    
    getColor() {
        return this.color;
    }
}