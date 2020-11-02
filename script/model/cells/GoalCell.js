/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représenant les cellules d'arrivé (les chateaux)
class GoalCell extends PathCell {
    constructor(i, j) {
        super();
        this.x = i;
        this.y = j;

    }

    getImageArgs() {
        return [castleSprite, 0, 0, 76, 100, this.x * cellSide - 38, this.y * cellSide - 50,
            76, 100];
    }
}