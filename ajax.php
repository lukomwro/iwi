<?php
try {
    $pdo = new PDO('mysql:dbname=wiki;host=localhost', 'iwi', 'iwi');
    $articles = $pdo->query('SELECT id, name FROM article LIMIT 50');

    $node_id = array();
    $json = array();
    foreach ($articles as $article) {
        $node_id[] = $r
        $json['nodes'][] = array('id' => $article['id'], 'name' => $article['name']);
    }
    $articles->closeCursor();

    $edges = $pdo->query('
        SELECT 
            id_article_from, 
            id_article_to 
        FROM article_article 
        WHERE id_article_from IN ('.join(',', $node_id ).') AND id_article_to IN ('.join(',', $node_id).')');
    foreach ($edges as $edge) {
        $json['links'][] = array('source' => $edge['id_article_from'], 'target' => $edge['id_article_to'], 'group' => 1);
    }
    echo json_encode($json);
} catch (PDOException $ex) {
    echo 'Connection failed: ' . $e->getMessage();
}
