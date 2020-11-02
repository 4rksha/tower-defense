/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

  // Classe représentant les ennemis puissants 

class SlowEnemy extends Enemy{

    constructor(path) {
        super(path);
        this.speed = refreshRate / .5;
        this.health = 10;
    }

    getGold() {
        return 15;
    }

    getScore() {
        return 10;
    }

    // Permet de calculer l'image a afficher en fonction de la position de l'ennemi
    // et de sa stance
    getImageArgs() {   
        return [enemiesSprite, this.stance * 31 + 97, 18, 30, 55, 
            cellSide * (this.coord.getX()) + 5 ,
            cellSide * (this.coord.getY()) - 20, 40, 80];
    }
}