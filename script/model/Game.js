/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */

 // Enumération pour les directions
var Direction = {
    NORTH : new Coord(0, -1),
    SOUTH : new Coord(0, 1),
    EAST : new Coord(1, 0),
    WEST : new Coord(-1, 0)
};


// Classe de jeu, les arguments r et c correspondent au nombre 
// de ligne et de colonne de la grille, emptyCells corresponds au cellules
// vides de la carte et paths contient les différents chemins arpentable par
// les ennemis
class Game {
    constructor(r, c, emptyCells, paths) {
        this.player = new Player();
        this.rowNb = r;
        this.colNb = c;
        this.grid = new Array(this.colNb);
        // Boucle pour remplir la grille avec des cellules "decor" qui contiendront
        // les arbres ou les tours ou avec des cellules "chemin" qui ne contiendront
        // rien ou des ennemis
        for (var i = 0; i < this.colNb; ++i) {
            this.grid[i] = new Array(this.rowNb);
            for (var j = 0; j < this.rowNb; ++j) {
                var isEmpty = false;
                var coord = new Coord(i, j);
                emptyCells.forEach(element => {
                   isEmpty = isEmpty || element.equals(coord);                   
                });
                if (isEmpty) {
                    this.grid[i][j] = new PathCell();                
                } else {
                    this.grid[i][j] = new DecorCell(i, j);
                }
            }
        }
        // Pour chaque chemin, on récupére son point de départ et on le
        // répertorie sur la grille
        for (var i = 0; i < paths.length; ++i) {
            this.grid[paths[i].startCoord.x][paths[i].startCoord.y] =
                new StartCell(paths[i].startCoord.x, paths[i].startCoord.y, caveSprite);
            this.grid[paths[i].goalCoord.x][paths[i].goalCoord.y] =
                new GoalCell(paths[i].goalCoord.x, paths[i].goalCoord.y, castleSprite);
        }

        // On plante la cellule d'arrivée
        var goalCoord = paths[0].goalCoord;
        


        this.paths = paths;
        this.enemies = new Array();
        this.cellTowers = new Array();
        this.towerText = new Array();

        // Variable correspondant a la durée entre deux apparitions d'enemies au lancement
        // du jeu
        this.enemySpawnDelta = 7;

        // Variable correspondant au taux d'apparition d'enemies supérieurs (1 pour 5)
        this.bigEnemySpawnFrequency = 5;
    }
    
    // Retourne le joueur associé a la partie
    getPlayer() {
        return this.player;
    }

    // Retourne la cellule situé aux coordonnées (x, y)
    getCell(x, y) {
        return this.grid[x][y];
    }

    // Récupérere la coordonnées situé dans la direction donnée
    getCoordAtDirection(direction, coord) {
        switch(direction) {
            case Direction.SOUTH :
                if (coord.getX === this.colNb) {
                    return coord;
                } 
            break;
            case Direction.NORTH :
                if (coord.getX === 0) {
                    return coord;
                } 
            break;
            case Direction.WEST :
                if (coord.getY === this.rowNb) {
                    return coord;
                } 
            break;
            case Direction.EAST :
                if (coord.getY === 0) {
                    return coord;
                } 
            break;
            default:
                throw new TypeError();
                // Recharge la page
                window.location.reload(true);
        }
        return coord.add(direction);
    }

    // Créé un ennemi, en choisissant aléatoirement un des chemins disponible
    // et en fonction du bigEnemySpawnFrequency le type de l'enemie
    createNewEnnemy() {
        var random = Math.floor(Math.random() * Math.floor(this.paths.length));
        var p = this.paths[random];
        var path = new Path(p.startCoord, p.goalCoord, p.pathArray);
        random =  Math.floor(Math.random() * this.bigEnemySpawnFrequency);
        var enemy = random == 0 && timer > 30 ? new SlowEnemy(path) : new FastEnemy(path);
        this.enemies.push(enemy);
        this.getCellAt(path.getStartCoord()).putEnemy(enemy);
    }

    // Permet de tenter de bouger un ennemi. Si l'ennemi atteint le goal, on le tue et
    // on retire de la vie au joueur, sinon on déplace l'ennemi dans la nouvelle cellule
    // situé dans la direction qui suit son dernier mouvement.
    // L'ennemi est ajouté a la liste des ennemis actifs et en est retiré si il atteint le goal.
    enemyMove(enemy) {         
        if (accumulator % enemy.getSpeed() == 0) {
            var next = enemy.getPath().getNextDirection();
            var newCoord = this.getCoordAtDirection(next, enemy.getCoord());
            if (newCoord.equals(enemy.getPath().getGoalCoord())) {
               this.killEnemy(enemy, false);
               this.player.damage();
            } else {
                this.getCellAt(enemy.getCoord()).removeEnemy(enemy);
                this.getCellAt(newCoord).putEnemy(enemy);
                enemy.setCoord(newCoord);
            }            
        }
    }

    // Récupére la céllule de coordonnées coord
    getCellAt(coord) {
        return this.grid[coord.getX()][coord.getY()];
    }

    // Créer une nouvelle tour de type towerType a la cellule de coordonnées (i, j)
    // le joueur perd autant d'or que le prix de la tour. La tour est ajouté
    // a la liste des tours et la chaine de caractére dénotant la variation d'or 
    // est envoyé a la vue
    createNewTower(i, j, towerType) {
        var cell = this.getCellAt(new Coord(i, j));
        cell.putTower(new towerType());
        this.cellTowers.push(cell);
        this.player.addGoldAmount(-cell.getTower().getPrice());
        var tText = new Array();
        tText.push(String("-" + cell.getTower().getPrice() + "g"), 
            cell.getCoord().getX() * cellSide,
            cell.getCoord().getY() * cellSide);
        this.towerText.push(tText);
    }

    // Tente de tirer avec chaques tours en jeu. Si la tour peut tirer (!isCoolingDown())
    // On test la distance entre chaque ennemi et la tour. Le premier ennemi a porté est attaqué
    // Si l'ennemi est mort, on le retire de la liste des enemis et on envoie un texte représentant
    // le gain d'or. Si il survit, on envoie un texte représentant la perte de point de vie en fonction
    // de la puissance de la tour.
    // Si la tour est une tour ralentissante, l'ennemi est ralenti tant qu'il est a porté et la tour
    // n'est jamais en coolDown
    tryShotFire() {
        var texts = new Array();
        this.cellTowers.forEach(function (cellTower) {
            var tower = cellTower.getTower();
            if (!tower.isCoolingDown()) {
                for (var i = 0; i < this.enemies.length; ++i) {
                    var enemy = this.enemies[i];
                    var distance = enemy.getCoord().distance(cellTower.getCoord());
                    if (distance <= tower.getMaxRange() 
                    && distance >= tower.getMinRange()) {
                        if (tower instanceof SlowDownTower) {
                            enemy.setSlowedDown(true);
                        } else {
                            enemy.damage(tower.getShotPower());
                            tower.coolDown();
                        
                            var text = new Array();
                            if (enemy.isDead()) {
                                text.push(String("+" + enemy.getGold() + 'g'), 
                                enemy.getCoord().getX() * cellSide,
                                enemy.getCoord().getY() * cellSide);
                                this.killEnemy(enemy, true);
                            } else {
                                text.push(String("-" + tower.getShotPower()), 
                                    enemy.getCoord().getX() * cellSide,
                                    enemy.getCoord().getY() * cellSide);
                            }
                            texts.push(text);
                            break;
                        }
                    } else {
                        if (tower instanceof SlowDownTower) {
                            enemy.setSlowedDown(false);
                        }
                    }
                }
            }
            if (tower instanceof SlowDownTower) {
                tower.coolDown();
            }
        }, this);
        return texts;
    }

    // Boucle principale du model
    update() {
        // On se synchronise sur chaque seconde
        if (accumulator % refreshRate == 0) {
            // Toutes les 30 secondes, on diminue la durée entre deux apparitions d'ennemi
            // jusqu'a ce qu'elle atteigne 1 (la on la fige)
            if (timer % 30 == 0 && timer > 0 && this.enemySpawnDelta > 1) {
                this.enemySpawnDelta--;
                // Toutes les 60 secondes, on augmente la probabilté d'apparition d'ennemi
                // puissant jusqu'a ce que la probabilté soit maximale
                if (timer % 60 == 0 && this.bigEnemySpawFrequency > 0) {
                    this.bigEnemySpawFrequency--;
                }
            }
            // On fait apparaitre un ennemi si la durée necessaire s'est écoulée
            if (timer % this.enemySpawnDelta == 0 && timer >= 0) {
                this.createNewEnnemy();
            }
        }
        // On fait bouger chaque enemi actif
        for (var i = 0; i < this.enemies.length; ++i) {
            this.enemyMove(this.enemies[i]);
        }
        // On tente de tiré avec chaque tour
        var texts = this.tryShotFire();
        if (this.towerText.length != 0) {
            texts.push(this.towerText.pop());
        }
        // Enfin on renvoie les textes qui doivent etre affiché en fonction des 
        // actions qui ont été réalisées
        return texts;
    }

    // Tue un ennemi en le retirant de la cellule ou il se trouve,
    // en le retirant de la liste des ennemis actifs, et si l'ennemi
    // est mort d'une tour, on augmente le score et l'argent du joueur
    // relativement
    killEnemy(enemy, isDeadByTower) {
        this.getCellAt(enemy.getCoord()).removeEnemy(enemy);
        this.enemies.splice(this.enemies.indexOf(enemy), 1);                
        this.getCellAt(enemy.getCoord()).removeEnemy(enemy);
        if (isDeadByTower) {
            this.player.addGoldAmount(enemy.getGold());
            this.player.addScoreAmount(enemy.getScore());
        }
        enemy = null;
    }
}