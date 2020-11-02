/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représentant les ennemis rapide 

class FastEnemy extends Enemy{

    constructor(path) {
        super(path);
        this.speed = refreshRate / 1;
        this.health = 3;
    }

    getGold() {
        return 5;
    }

    getScore() {
        return 1;
    }

    // Permet de calculer l'image a afficher en fonction de la position de l'ennemi
    // et de sa stance
    getImageArgs() {   
        return [enemiesSprite, this.stance * 33 - 4, 21, 38, cellSide, 
            cellSide * (this.coord.getX()) + 5 ,
            cellSide * (this.coord.getY()) + 5, 30, 30];
    }
}