<?php
try {
    $pdo = new PDO('mysql:dbname=wiki;host=localhost', 'iwi', 'iwi');
    $stmt = $pdo->query('SELECT id, name FROM article');
    $json = array();
    foreach ($stmt as $row) {
        $json['nodes'][] = array('id' => $row['id'], 'name' => $row['name']);
    }
    $stmt->closeCursor();
    echo json_encode($json);
} catch (PDOException $ex) {
    echo 'Connection failed: ' . $e->getMessage();
}
