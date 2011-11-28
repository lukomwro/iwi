<?php
try {
    $db = new PDO('mysql:db=wiki;host=localhost', 'iwi', 'iwi');
} catch (PDOException $ex) {
    echo 'Connection failed: ' . $e->getMessage();
}
