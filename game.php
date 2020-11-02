<!--
    Projet Tower Defense 
    Zacharia Beddalia
-->
<!DOCTYPE html>
<html>
    <head>
        <title>Tower Defense</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" type="text/css" href="css/style.css">
    </head>
    <body>
        <?php include_once("server/map.php")?>
        <div id="font-loader">.</div>
        <div class="area" id="gameArea"></div>
        <div class="area" id="UIArea"></div>
        <script src="script/util/Coord.js"> </script>
        <script src="script/model/buildings/Tower.js"></script>
        <script src="script/model/buildings/SlowDownTower.js"></script>
        <script src="script/model/buildings/SimpleTower.js"></script>
        <script src="script/model/buildings/HeavyTower.js"></script>
        <script src="script/model/Path.js"></script>
        <script src="script/model/units/Enemy.js"></script>
        <script src="script/model/units/FastEnemy.js"></script>
        <script src="script/model/units/SlowEnemy.js"></script>
        <script src="script/model/cells/Cell.js"></script>
        <script src="script/model/cells/DecorCell.js"></script>
        <script src="script/model/cells/PathCell.js"></script>
        <script src="script/model/cells/StartCell.js"></script>
        <script src="script/model/cells/GoalCell.js"></script>
        <script src="script/model/Game.js"></script>
        <script src="script/model/Player.js"></script>
        <script id="data"> var data = <?php getMap(); ?> </script>
        <script src="script/Main.js"> </script>
    </body>
</html>

