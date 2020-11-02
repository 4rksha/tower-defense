// Fonction pour afficher l'ecran titre
var render = function() {
    var width = 1200;
    var height = 720;

    // Création du canvas de l'ecran titre
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    // Paramétrage du canvas pour l'ecran titre
    document.body.appendChild(canvas);
    var context = canvas.getContext("2d");

    // Arriere plan de l'ecran titre 
    context.fillStyle = '#999966';
    context.fillRect(0, 0, width, height);

    // Récupération de l'image qui sert a l'arriere plan
    var titleScreenSprite = new Image();
    titleScreenSprite.onload = function() {
        context.drawImage(titleScreenSprite, 150, 99);
    };
    titleScreenSprite.src = "assets/title.png";

    // Ecoute sur le click
    canvas.addEventListener("click", startGame);
};

// Traite l'evenement du click et le soumission du formulaire pour charger 
// la bonne carte
var startGame = function (event) {
    var x = event.clientX;
    var y = event.clientY;
    var mapNb;
    if (y >= 325 && y <= 489) {
        if (x >= 226 && x <= 387) {
            mapNb = "1";
        } else if (x >= 426 && x <= 589) {
            mapNb = "2";
        } else if (x >= 629 && x <= 791) {
            mapNb = "3";
        } else if (x >= 822 && x <= 992) {
            mapNb = "4";
        }
    } else {
        return;
    }
    // On stock le numéro de map dans la variable map
    document.formName.elements["map"].value = mapNb;
    document.formName.submit();
};


window.onload = render();