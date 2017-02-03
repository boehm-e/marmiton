<?php
//  INSTALL php5.6-pgsql
header("Access-Control-Allow-Origin: *");
require_once('./connection.php');
  if (isset($_GET['controller']) && isset($_GET['action'])) {
    $controller = $_GET['controller'];
    $action     = $_GET['action'];
  } else {
    $controller = 'pages';
    $action     = 'home';
  }
  require_once('./views/layout.php');
?>
