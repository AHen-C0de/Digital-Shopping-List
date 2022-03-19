<?php
require_once 'config.php';
// config includes connection data for MySQL data base
//  $host = "IP adress for data base server"
//  $user = "username"
//  $pwd  = "password"
//  $database = "name of data base"

if (isset($_REQUEST['gerichte_id'])) {
    $gerichte_id = $_REQUEST['gerichte_id'];
}
if (isset($_REQUEST['cmd'])) {
    $cmd = $_REQUEST['cmd']*1; // *1 to make sure 'cmd' is a number

    switch ($cmd) {
        case 1:          
            $database_connect = mysqli_connect($host,$user,$pwd,$database);
            $database_connect->set_charset('utf8');
            if (!$database_connect) {
                die("Verbindung fehlgeschlagen: " . mysqli_error());
            }

            $sql = "SELECT * FROM gerichte";
            $sql_result = mysqli_query($database_connect,$sql);

            $i = 0;
            //$temp = [];
            $result = [];
            while ($row = mysqli_fetch_object($sql_result)) {
                $result[$i]['ID'] = $row->ID;
                $result[$i]['Gerichte'] = $row->Gerichte;
                $i++;
            }

            mysqli_close($database_connect);
            echo json_encode($result);
            break;

        case 2: 
            $data = json_decode(file_get_contents("php://input"));
            $gerichte_id = $data->gerichte_id;

            $database_connect = mysqli_connect($host,$user,$pwd,$database);
            $database_connect->set_charset('utf8');
            if (!$database_connect) {
                die("Verbindung fehlgeschlagen: " . mysqli_error());
            }

            $sql = "SELECT ID,Zutaten FROM zutaten WHERE Gerichte_ID = " .$gerichte_id; //toDo: parametisieren, weil sql injection!
            $sql_result = mysqli_query($database_connect,$sql);

            $i = 0;
            //$temp = [];
            $result = [];
            while ($row = mysqli_fetch_object($sql_result)) {
                $result[$i]['ID'] = $row->ID;
                $result[$i]['Zutaten'] = $row->Zutaten;
                $i++;
            }

            mysqli_close($database_connect);
            echo json_encode($result);
            break;

        case 3:
            $data = json_decode(file_get_contents("php://input"));
            
            /* toDo:
            - anstatt if else, lösche letztes Komma im String nach for loop
            */
            $items = "";
            $len = count($data);
            $i = 1;
            foreach($data as $item) {
                if ($i < $len) {
                    $items = $items. "('" .$item. "'),";
                } else {
                    $items = $items. "('" .$item. "')";
                }
                $i ++;
            }
            unset($item);
            echo json_encode($items);

            $database_connect = mysqli_connect($host,$user,$pwd,$database);
            $database_connect->set_charset('utf8');
            if (!$database_connect) {
                die("Verbindung fehlgeschlagen: " . mysqli_error());
            }

            $sql = "INSERT INTO einkaufsliste (Item) VALUES " .$items;
            $sql_result = mysqli_query($database_connect,$sql);

            mysqli_close($database_connect);
            echo ("data sent");
            break;
    }
}
?>