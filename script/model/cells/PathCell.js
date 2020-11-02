/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classes représentant les cellules qui forme le chemin. Elle peuvent accueillir
 // un ou plusieurs ennemis et affichera toujours le premier ennemi arrivé
class PathCell extends Cell {
    constructor() {
        super();
        this.enemies = new Array();
        this.imageArgs = undefined;
        this.stance = 0;
        this.color = 'red';
    }

    putEnemy(enemy) {
        this.enemies.push(enemy);
        this.imageArgs = enemy.getImageArgs();
    }

    removeEnemy(enemy) {
        this.enemies = this.enemies.filter(function(e) {
            return e !== enemy;
        });
    }

    getImageArgs() {
        if (this.enemies.length != 0) {
            this.imageArgs = this.enemies[0].getImageArgs();
        } else {
            this.imageArgs = undefined;
        }
        return this.imageArgs;
    }
}

