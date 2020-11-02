/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

class Coord {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    add(coord) {
        return new Coord(coord.getX() + this.x, coord.getY() + this.y);
    }

    equals(coord) {
        return this.x === coord.getX() && this.y === coord.getY();
    }

    distance(coord) {
        var x = Math.abs(this.x - coord.getX());
        var y = Math.abs(this.y - coord.getY());
        return x + y;
    }
}