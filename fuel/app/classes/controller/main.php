<?php

class Controller_Main extends Controller
{

	public function action_index()
	{
		return "";
	}

	/**
	 * The 404 action for the application.
	 * 
	 * @access  public
	 * @return  Response
	 */
	public function action_404()
	{
		return Response::forge(View::forge('main/404'), 404);
	}
}
