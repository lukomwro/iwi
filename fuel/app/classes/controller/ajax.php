<?php

class Controller_Ajax extends Controller {
	
	public function action_list($name = "")
	{
		return Model_Article::by_name_autocomplete($name);
	}

	public function action_nodes($node_id = "")
	{
		return Model_Nodes::by_id_json($node_id);
	}

	public function action_nodesclick($node_id = "") {
		return Model_Nodes::by_id_click($node_id);
	}
}