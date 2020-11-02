/* 
 * Projet Tower Defense 
 * Zacharia Beddalia
 */


// Chargement des images contenant les sprites du jeu3
var enemiesSprite = new Image();
enemiesSprite.src = "assets/enemies.png";
var treeSprite = new Image();
treeSprite.src = "assets/tree.png";
var caveSprite = new Image();
caveSprite.src = "assets/cave.png";
var castleSprite = new Image();
castleSprite.src = "assets/castle.png";
var simpleTowerSprite = new Image();
simpleTowerSprite.src = "assets/simple.png";
var UISprite = new Image();
UISprite.src = "assets/UI.png";
var dialogSprite = new Image();
dialogSprite.src = "assets/dialog.png";
var heavyTowerSprite = new Image();
heavyTowerSprite.src = "assets/heavy.png";
var slowDownTowerSprite = new Image();
slowDownTowerSprite.src = "assets/slowdown.png";


var cellSide = 40;
var refreshRate = 20;
var accumulator = 0;
var timer;

class Main {
    
    constructor() {
        this.height = 720;
        this.width = 880;
        this.UIwidth = 320;
        this.isPaused = false;

        // Création du canvas pour l'arriere plan
        this.bgContext = this.createCanvasWithContext("bgCanvas", this.width, this.height, "gameArea", 1, 20);
        this.bgContext.fillStyle = '#999966';
        this.bgContext.fillRect(0, 0, this.width, this.height);

        // Création du canvas qui servira a l'affichage des éléments de jeu
        this.gameContext = this.createCanvasWithContext("gameCanvas", this.width, this.height, "gameArea", 2, 20);
        
        // Création du canvas pour l'affichage des texts
        this.textContext = this.createCanvasWithContext("textCanvas", this.width, this.height, "gameArea", 3, 30);
        this.textContext.fillStyle = "gold";

        // Création du canvas pour la pose des tours
        this.selectContext = this.createCanvasWithContext("selectCanvas", this.width, this.height, "gameArea", 4, 20);
        this.isSelectMode = false;
        this.canvas = document.getElementById("selectCanvas");

        // Création du canvas pour l'assombrissement pendant la pause
        this.overlayContext = this.createCanvasWithContext("overlayCanvas", this.width +  this.UIwidth, this.height, "gameArea", -1, 30);
        this.overlayContext.fillStyle = "black";
        document.getElementById("overlayCanvas").opacity = 0;

        // Création du canvas pour la modal lors de la pause et de la fin de partie
        this.dialogContext = this.createCanvasWithContext("dialogCanvas", this.width +  this.UIwidth, this.height, "gameArea", -1, 30);

        // Création du canvas pour l'interface de jeu
        this.UIContext = this.createCanvasWithContext("UICanvas",  this.UIwidth,this.height, "UIArea", 0, 20);
        document.getElementById("UICanvas").style.left = "888px";


        this.row = this.height /cellSide;
        this.col = this.width /cellSide;

        // Récupération de la carte du jeu
        var settings = data;
        // Suppression de la data ecrite en dur par le serveur dans le body html
        document.body.removeChild(document.getElementById("data"));
        document.body.removeChild(document.getElementById("font-loader"));

        // Initialisation des parametres du jeu : cellules vides, chemins des enemies, bases et point d'arrivé
        var emptyCells = new Array();
        var paths = new Array();
        
        for (var i = 0; i < settings.emptyCells.length; ++i) {
            emptyCells.push(new Coord(settings.emptyCells[i].x, settings.emptyCells[i].y));
        }
        
        for (var i = 0; i < settings.paths.length; ++i) {
            var directions = new Array();
            for (var j = 0; j < settings.paths[i].pathArray.length; ++j) {
                var dir = eval("Direction." + settings.paths[i].pathArray[j]);
                directions.push(dir);
            }
            var startCoord = new Coord(settings.paths[i].startCoord.x, settings.paths[i].startCoord.y);
            var goalCoord = new Coord(settings.paths[i].goalCoord.x, settings.paths[i].goalCoord.y);
            var path = new Path(startCoord, goalCoord, directions);
            paths.push(path);
        }


        // Création de la partie
        this.game = new Game(this.row, this.col, emptyCells, paths);

        // Ajout d'un ecouteur sur les click effectué dans l'UICanvas pour créer des tours
        this.selectMode = this.selectMode.bind(this);
        document.getElementById("UICanvas").addEventListener("click", this.selectMode);

        // Ajout d'un ecouteur sur la touche "Echap" pour mettre le jeu en pause. Permet aussi
        // de revenir au menu principal.
        document.onkeydown = () => {
            var isEscape = false;
            if ("key" in event) {
                isEscape = (event.key == "Escape" || event.key == "Esc");
            } else {
                isEscape = (event.keyCode == 27);
            }
            if (isEscape && !this.game.player.isDead()) {
                // Si on est en pose de tour, on le quitte en appuyant sur echap
                if (this.isSelectMode) {
                    this.isSelectMode = false;
                    this.canvas.removeEventListener("click", this.sendEvent);
                } else {
                    this.openDialog("PAUSE", "Voulez-vous revenir au menu principal ?", 530, 300, 300, 360);
                }
            }
        };

        // Rendering du départ et de l'arrivé qui ne changeront pas
        var args = Array.from(this.game.getCellAt(path.getStartCoord()).getImageArgs());
        this.bgContext.drawImage.apply(this.bgContext, args);
        args = Array.from(this.game.getCellAt(path.getGoalCoord()).getImageArgs());
        this.bgContext.drawImage.apply(this.bgContext, args);
        
        // Initialisation de la variable qui servira à faire le "flash" quand on veut
        // poser un tour
        this.sine = 0;
        this.renderUI();
    }

    // Boucle principale d'affichage et de rendu
    update() {
        if (!this.isPaused) {
            // Variable servant au clignotement lors de la pose d'une tour
            this.sine = this.sine + .05;
            // Accumulateur pour synchronisez toutes les actions entre la vue et le model
            accumulator++;
            // Timer pour le jeu (-15 pour laisser 15 sec au joueur avant le début de la partie)
            timer = Math.floor(accumulator / refreshRate) - 15;

            // On efface le canvas de selection
            this.selectContext.clearRect(0, 0, this.width, this.height);
            // Calcul de l'opacité pour le clignotement
            var cos = Math.cos(this.sine * Math.PI) + 1;
            this.canvas.style.opacity = cos / 2;

            // Gestion de l'affichage des différents textes du jeu
            var texts = Array.from(this.game.update());
            while (texts.length != 0) {
                var arg = texts.pop();
                this.textContext.fillText.apply(this.textContext, arg);
                this.clearText(arg[1], arg[2]);
            }

            // On efface le game canvas
            this.gameContext.clearRect(0, 0, this.width, this.height);
            
            // On boucle sur chaque cellule pour récupérer l'image de l'"objet" quelle possede
            for (var i = 0; i < this.col; ++i) {
                for (var j = 0; j < this.row; ++j) {
                    var cell = this.game.getCell(i, j);
                    if (cell.getImageArgs() !== undefined) {
                        var args = Array.from(cell.getImageArgs());
                        this.gameContext.drawImage.apply(this.gameContext, args);
                    }
                    // Si on est en pose de tour, on applique le clignotement
                    if (this.isSelectMode) {
                        this.renderColor(i, j);
                    }
                }
            }
            // On met a jour l'UI en fonction des nouvelles données du model
            this.updateUI();
        }
    }

    // Permet d'effacer au bout d'1 seconde un texte qui a été affiché
    // Fonction necessaire pour empecher un bug avec les setTimeout à l'intérieur des boucles
    clearText(arg1, arg2) {
        setTimeout(() => { 
            this.textContext.clearRect(arg1 - 2, arg2 - cellSide, cellSide + 30, cellSide + 10)
        }, 1000);
    }

    // Récupére la couleur de chaque case en mode de pose de tour
    renderColor(i, j) {
        var cell = this.game.getCell(i, j);
        this.selectContext.fillStyle = cell.getColor();
        this.selectContext.fillRect(i * cellSide + 1, j * cellSide + 1, cellSide - 2, cellSide - 2)
    }

    // Lance la partie
    startGame() {
        this.game.createNewEnnemy();
    }

    // Traitement de l'event pour savoir quel type de tour a été selectionné
    selectMode(event) {
        // Récupération des coordonnées
        var x = event.clientX - document.getElementById("UICanvas").offsetLeft;
        var y = event.clientY - document.getElementById("UICanvas").offsetTop;
        // Cas SimpleTower
        if (x >= 53 && x <= 268 
            && y >= 451 && y <= 556
            && this.game.getPlayer().getMoney() - SimpleTower.getConstantes()["price"] >= 0) {
            this.selectedTower = SimpleTower;
            this.isSelectMode = true;
            this.sendEvent = this.sendEvent.bind(this);
            this.canvas.addEventListener("click", this.sendEvent);
        // Cas HeavyTower
        } else if ((x >= 53 && x <= 268 
            && y >= 572 && y <= 677
            && this.game.getPlayer().getMoney() - HeavyTower.getConstantes()["price"] >= 0)) {
            this.selectedTower = HeavyTower;
            this.isSelectMode = true;
            this.sendEvent = this.sendEvent.bind(this);
            this.canvas.addEventListener("click", this.sendEvent);
        }
    }

    // Traite le clic aprés selection d'une tour afin de signifier 
    // au model la position de la tour et de transmettre la position 
    // de la cellule choisie si la cellule est libre
    sendEvent(event) {
        var i = Math.floor(event.clientX / cellSide - 0.2);
        var j = Math.floor(event.clientY / cellSide - .5);
        var cell = this.game.getCell(i, j);
        if (cell instanceof DecorCell && cell.getTower() === undefined) {
            this.game.createNewTower(i, j, this.selectedTower);
            this.isSelectMode = false;
            this.canvas.removeEventListener("click", this.sendEvent);
        }
    }

    // Fonction pour créer un canvas, les arguments sont l'id que le canvas
    // aura dans le dom, sa longueur, sa largeur, la div dans laquelle le canvas
    // sera placé et la taille de la police des textes qui seront dessiné.
    createCanvasWithContext(id, width, height, area, index, fontSize) {
        // Creation du Canvas
        var canvas = document.createElement("canvas");
        canvas.id = id;
        canvas.width = width;
        canvas.height = height;

        // Paramétrage du canvas

        document.getElementById(area).appendChild(canvas);
        var context = canvas.getContext("2d");
        // Style du canvas
        canvas.style.zIndex = index;
        canvas.style.position = 'absolute';
        context.font = String(fontSize + "px dpcomic");
        return context;
    }

    // Création de l'UI avec les images liées au tour ainsi que leur caracs
    renderUI() {
        this.UIContext.drawImage(UISprite, 0, 0, 320, 720);
        this.UIContext.drawImage(simpleTowerSprite, 69, 465, 40, 76);
        this.UIContext.drawImage(heavyTowerSprite, 69, 585, 40, 76);
        this.UIContext.font = "20px dpcomic";

        // UI pour la Simple Tower
        this.UIContext.fillText(SimpleTower.getConstantes().price + "g", 225, 495);
        this.UIContext.fillText(SimpleTower.getConstantes().shotPower, 225, 512);
        this.UIContext.fillText(SimpleTower.getConstantes().speed, 225, 530);

        // UI pour l'Heavy Tower
        this.UIContext.fillText(HeavyTower.getConstantes().price + "g", 225, 617);
        this.UIContext.fillText(HeavyTower.getConstantes().shotPower, 225, 634);
        this.UIContext.fillText(HeavyTower.getConstantes().speed, 225, 652);

        // On prépare les options d'affichage pour les updates a venir
        this.UIContext.font = "35px dpcomic";
        this.UIContext.textAlign = "right";
    }

    // Fonction pour la mise a jour de l'UI. On efface les précédents textes, puis on les
    // réécris avec les bonnes données venant du model.
    updateUI() {
        this.UIContext.fillStyle= "#D6D6D6";
        this.UIContext.fillRect(185, 175, 110, 40);
        this.UIContext.fillRect(185, 240, 110, 40);
        this.UIContext.fillRect(185, 310, 110, 40);
        this.UIContext.fillRect(40, 50, 240 - this.game.getPlayer().getHealth() * 80, 80);

        this.UIContext.fillStyle = "black";

        this.UIContext.fillText(timer, 275, 200);
        this.UIContext.fillText(this.game.getPlayer().getMoney(), 275, 270);
        this.UIContext.fillText(this.game.getPlayer().getScore(), 275, 340);
    }    

    // Fonction pour créer un une modal en lui donnant un titre, sa position (en x et y)
    // un sous titre, sa position (en x et y). Si la fonction est rappelée alors qu'une 
    // modal est ouverte, elle se ferme.
    openDialog(title, subtitle, titleX, titleY, subtitleX, subtitleY) {
        var overlayCanvas = document.getElementById("overlayCanvas");
        var dialogCanvas = document.getElementById("dialogCanvas");
        if (!this.isPaused) {
            var main = this;
            this.buttonClick = this.buttonClick.bind(this);
            dialogCanvas.addEventListener("click", this.buttonClick);
            this.isPaused = true;
            overlayCanvas.style.zIndex = 10;
            this.overlayContext.fillRect(0, 0, this.width + 320, this.height);
            overlayCanvas.style.opacity = .7;
            
            dialogCanvas.style.zIndex = 11;
            this.dialogContext.drawImage(dialogSprite, 240, 200);

            this.dialogContext.font = "60px dpcomic";
            this.dialogContext.fillText(title, titleX, titleY);
            this.dialogContext.font = "40px dpcomic";
            this.dialogContext.fillText(subtitle, subtitleX, subtitleY);
            
        } else {
            overlayCanvas.style.zIndex = -1;
            dialogCanvas.style.zIndex = -1;
            overlayCanvas.style.opacity = 0;
            this.isPaused = false;
        }
    }

    // Permet de traiter les clics dans la modal
    buttonClick(event) {
        var x = event.clientX - dialogCanvas.offsetLeft;
        var y = event.clientY - dialogCanvas.offsetTop;
        if (x >= 363 && x <= 566 && y >= 405 && y <= 484) {
            if (this.game.getPlayer().isDead()) {
                location.reload();
            } else {
                location.href = 'index.html';
            }
            dialogCanvas.removeEventListener("click", this.buttonClick);
        } else if (x >= 630 && x <= 834 && y >= 405 && y <= 482) {
            if (this.game.getPlayer().isDead()) {
                location.href = 'index.html';
            } else {
                this.openDialog();
            }
            dialogCanvas.removeEventListener("click", this.buttonClick);
        }
    }

}

// Permet de lancer le jeu unique aprés que la police d'affichage soit chargée
document.fonts.ready.then(function () {  
    newGame();
});

// Fonction pour lancer le jeu
var newGame = function () {
    var main = new Main();
    var int = setInterval(() =>  {
        // On update
        main.update();
        // Puis on test pour la fin de partie
        if (main.game.getPlayer().isDead()) {
            clearInterval(int);
            main.openDialog("PARTIE TERMINE", "Recommencer la partie ?", 430, 300, 420, 360);
        }
    }, 1000 / this.refreshRate);
}