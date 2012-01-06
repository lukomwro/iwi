<?php

class Controller_Ajax extends Controller {
	
	public function action_list($name = "")
	{
		return Model_Article::by_name_autocomplete($name);
	}

	public function action_nodes($node_id = "")
	{
		return View::forge('main/nodes');
	}
}