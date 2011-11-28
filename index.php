<?php
try {
    $db = new PDO('mysql:db=wiki;host=localhost', 'iwi', 'iwi');
    foreach ($db->query('SELECT * FROM articles') as $row) {
        var_dump($row);
    }
} catch (PDOException $ex) {
    echo 'Connection failed: ' . $e->getMessage();
}
