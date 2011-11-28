<?php
try {
    $pdo = new PDO('mysql:db=wiki;host=localhost', 'iwi', 'iwi');
    $stmt = $pdo -> query('SELECT * FROM article');
    echo '<ul>';
    foreach($stmt as $row)
    {
        echo '<li>'.$row['nazwa'].': '.$row['opis'].'</li>';
    }
    $stmt -> closeCursor();
    echo '</ul>';

} catch (PDOException $ex) {
    echo 'Connection failed: ' . $e->getMessage();
}
