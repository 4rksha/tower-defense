/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe simple pour la création d'un chemin avec une cellule de 
 // départ, une d'arrivée et une liste de directions
class Path {
    constructor(start, goal, array) {
        this.startCoord = start;
        this.goalCoord = goal;
        this.pathArray = array.slice();

    }

    getPath() {
        return this.pathArray;
    }
    
    getStartCoord() {
        return this.startCoord;
    }

    getGoalCoord() {
        return this.goalCoord;
    }
    
    // Renvoie la direction suivante du chemin
    getNextDirection() {
        return this.pathArray.shift();
    }
}