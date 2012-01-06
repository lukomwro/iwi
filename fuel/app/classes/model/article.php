<?php

class Model_Article {

	public static function by_name($name) {
		if (empty($name)) {
			return array();
		}
		$query = DB::query("
			SELECT name, id
			FROM article
			WHERE name LIKE '{$name}%'
		");
		return $query->execute()->as_array();
	}

	public static function by_name_json($name) {
		return json_encode(self::by_name($name));
	}

	public static function by_name_autocomplete($name) {
		$data = self::by_name($name);
		$tmp = "";
		foreach ($data as $d) {
			$tmp .= implode("|", $d)."\n";
		}
		return $tmp;
	}
}