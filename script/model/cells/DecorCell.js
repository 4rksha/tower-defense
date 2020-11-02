/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

// Classe représentant le type des cellules de décor. De base, on les rempli avec un arbre
// et on peut y rajouter un tour qui prendra sa place
class DecorCell extends Cell {
    constructor(i, j) {
        super();
        this.i = i;
        this.j = j;
        this.color = 'rgb(51, 153, 255)';
        this.tower = undefined;
        this.imageArgs = [treeSprite, 0, 0, cellSide, cellSide, this.i * cellSide, this.j * cellSide,
            cellSide, cellSide];
    }

    putTower(tower) {
        this.tower = tower;
        this.sprite = tower.getSprite();
        this.color = 'red';
        this.imageArgs = [this.sprite, 0, 0, cellSide, 76, this.i * cellSide, (this.j - 1) * cellSide,
            cellSide, 76]
    }

    getTower() {
        return this.tower;
    }

    getImageArgs() {
        return this.imageArgs;
    }

    getCoord() {
        return new Coord(this.i, this.j);
    }
}

