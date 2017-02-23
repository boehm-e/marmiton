<?php
$controllers = array(
    'recettes' => ['create', 'search', 'getCategory', 'upload', 'getById', 'getAll']
);

if (array_key_exists($controller, $controllers)) {
  if (in_array($action, $controllers[$controller])) {
    return call($controller, $action);
  } else {
    return call('pages', 'error');
  }
} else {
  return call('pages', 'error');
}

function call($controller, $action) {
  require_once('./controllers/' . $controller . '_controller.php');
  switch($controller) {
    case "db":
    require_once('models/db_model.php');
    $controller = new DbController();
    break;
    case 'recettes':
    require_once('./models/recettes_model.php');
    $controller = new RecettesController();
    break;
  }
  $controller->{ $action }();
}

?>
