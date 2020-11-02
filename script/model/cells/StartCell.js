/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

// Classes représentant les cellules de départ (les grottes).
class StartCell extends PathCell {
    constructor(i, j, sprite) {
        super();
        this.x = i * cellSide;
        this.y = j * cellSide;
        this.sprite = sprite;
    }

    getImageArgs() {
        return [caveSprite, 0, 0, cellSide, cellSide, this.x, this.y, cellSide, cellSide];
    }
}