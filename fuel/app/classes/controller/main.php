<?php

class Controller_Main extends Controller
{

	public function action_index()
	{
		$this->template->title = 'Main &raquo; Index';
		$this->template->content = View::forge('main/index');
	}

	public function action_list()
	{
		$this->template->title = 'Main &raquo; List';
		$this->template->content = View::forge('main/list');
	}

	public function action_nodes()
	{
		$this->template->title = 'Main &raquo; Nodes';
		$this->template->content = View::forge('main/nodes');
	}

}
