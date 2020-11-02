<?php
    function getMap() {
        $mapName = "maps/".$_POST["map"]."map.json";
        if (file_exists($mapName)) {
            $data = file_get_contents($mapName); 
            header("Accept: application/json");   
            echo $data;
        } else {
            header("Location: index.html");
        }
    }
?>