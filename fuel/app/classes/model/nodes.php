<?php

class Model_Nodes {

	public static function by_id_json($id) {
		if (!is_numeric($id)) {
			return array();
		}
		$id = (int)$id;
		$article_query = DB::query("
			SELECT 
				DISTINCT a.id, a.name
			FROM article_article AS aa
			JOIN article AS a ON a.id = id_article_to
			WHERE id_article_from = {$id}
			ORDER BY id_article_to
		");
	    $node_id = array($id);
	    $node_index_asoc = array($id => 0);
	    $json = array();
	    $json['nodes'][] = array('group' => 50, 'name' => self::get_name_by_id($id), 'nodeid' => $id);
	    $articles = $article_query->execute();
	    $index = 0;
	    foreach ($articles as $article) {
	    	if (isset($node_index_asoc[$article['id']])) {
	    		continue;
	    	}
	        $node_id[$index++] = $article['id'];
	        $node_index_asoc[$article['id']] = $index;
	        $json['nodes'][] = array('group' => 1, 'name' => $article['name'], 'nodeid' => $article['id']);
	    }
	    $edges = DB::query("
	        SELECT 
	            id_article_from, 
	            id_article_to 
	        FROM article_article 
	        WHERE id_article_from = {$id}")->execute();
	    foreach ($edges as $edge) {
	        $json['links'][] = array('source' => $node_index_asoc[$edge['id_article_from']], 'target' => $node_index_asoc[$edge['id_article_to']], 'group' => 1);
	    }

	    /*$edges = DB::query("
	        SELECT 
	            id_article_from, 
	            id_article_to 
	        FROM article_article 
	        WHERE id_article_from IN (".join(',', $node_id).")
	        	AND id_article_to IN (".join(',', $node_id).")")->execute();
	    foreach ($edges as $edge) {
	        $json['links'][] = array('source' => $node_index_asoc[$edge['id_article_from']], 'target' => $node_index_asoc[$edge['id_article_to']], 'group' => 1);
	    }*/
	    return json_encode($json);
	}

	public static function by_id_click($id) {	
	}

	public static function get_name_by_id($id) {
		$query = DB::query("
			SELECT name
			FROM article
			WHERE id = {$id}
		");
		$result = $query->execute()->as_array();;
		if (!empty($result)) {
			return current(current($result));
		}
	}
}