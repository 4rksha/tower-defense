/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Classe représenant le type des ennemis. ils sont initialisé avec un chemin.
class Enemy {
    constructor(path) {
        
        this.path = path;
        this.coord = this.path.getStartCoord();
        this.stance = 0;
        this.isSlowed = false;
        this.animate();
    }

    isDead() {
        return this.health == 0;
    }

    setCoord(coord) {
        this.coord = coord;
    }

    // Si l'ennemi est ralenti, sa vitesse est divisée par deux
    getSpeed() {
        return this.isSlowed ? this.speed / 2 : this.speed;
    }

    getCoord() {
        return this.coord;
    }

    getPath() {
        return this.path;
    }

    setSlowedDown(isSlowed) {
        this.isSlowed = isSlowed;
    }
    
    // Permet d'animer les enemis
    animate() {
        var cell = this;
        setInterval(cell.nextStance.bind(cell), 1000 / 5);
    }

    damage(amount) {
        this.health = this.health - amount;
        if (this.health < 0) {
            this.health = 0;
        }
    }

    nextStance() {
        this.stance = (this.stance + 1) % 3;
    }
}