<?php
$limit = isset($_GET['limit'])? (int)$_GET['limit'] : 50;
try {
    $pdo = new PDO('mysql:dbname=wiki;host=localhost', 'iwi', 'iwi');
    $articles = $pdo->query('SELECT id, name FROM article LIMIT '.$limit);

    $node_id = array();
    $node_index_asoc = array();
    $json = array();
    $index = 0;
    foreach ($articles as $article) {
        $node_id[] = $article['id'];
        $node_index_asoc[$article['id']] = $index++;
        $json['nodes'][] = array('group' => 1, 'name' => $article['name']);
    }
    $articles->closeCursor();

    $edges = $pdo->query('
        SELECT 
        id_article_from, 
        id_article_to 
        FROM article_article 
        WHERE id_article_from IN ('.join(',', $node_id ).') AND id_article_to IN ('.join(',', $node_id).')');
    foreach ($edges as $edge) {
        $json['links'][] = array('source' => $node_index_asoc[$edge['id_article_from']], 'target' => $node_index_asoc[$edge['id_article_to']], 'group' => 1);
    }
    echo json_encode($json);
} catch (PDOException $ex) {
    echo 'Connection failed: ' . $e->getMessage();
}
