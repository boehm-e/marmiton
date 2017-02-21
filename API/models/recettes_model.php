<?php
class Recettes {
  // we define 3 attributes
  // they are public so that we can access them using $post->author directly
  public $firstname;
  public $lastname;
  public $email;
  public function __construct($firstname, $lastname, $email) {
    $this->firstname = $firstname;
    $this->lastname  = $lastname;
    $this->email     = $email;
  }

  public static function getCategory() {
    $db = Db::getInstance();
    $sql = "SELECT * FROM category";
    $req = $db->prepare($sql,  array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    $req->execute();
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($res);
  }

  public static function create($recetteObj, $picture) {
    $db = Db::getInstance();

    // instructions !!!

    // CREATE RECETTE;
    $recette = $recetteObj->recette;
    $req = $db->prepare("INSERT INTO recettes(picture, nbrPersonnes, perparationTime, instruction, name, category) VALUES(:picture, :nbrPersonne, :preparationTime, :instruction, :name, :category)",  array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    print_r($recette);
    $req->execute(array(':picture' => $picture ,':nbrPersonne' => $recette->nbrPersonne, ':preparationTime' => $recette->preparationTime, ':instruction' => $recette->instruction, ':name' => $recette->name, ':category' => $recette->category));
    $ingredientId = $db->lastInsertId();
    // ADD COMMENTS TO RECETTE;
    $ingredients = $recetteObj->ingredients;
    for ($i=0; isset($ingredients[$i]) ; $i++) {
      $req = $db->prepare("INSERT INTO ingredients(name, amount, unit, ingredientId) VALUES(:name, :amount, :unit, :ingredientId)");
      $req->execute(array(':name' => $ingredients[$i]->name, ':amount' => $ingredients[$i]->amount, ':unit' => $ingredients[$i]->unit, ':ingredientId' => $ingredientId));
    }
    return;
  }

  public static function delete($recetteId) {
    $db = Db::getInstance();

    // CREATE RECETTE;
    $recette = $recetteObj->recette;
    $req = $db->prepare("DELETE FROM recettes WHERE id=:recetteId",  array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    $req->execute(array(':id' => $recetteId));
    return;
  }

  public static function search($q, $category) {
    $db = Db::getInstance();
    $q = "%$q%";
    $sql = "SELECT *, name AS value FROM (SELECT *, (name || instruction) AS tosearch FROM recettes) d WHERE d.tosearch LIKE :q";
    $req = $db->prepare($sql,  array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
    $req->execute(array(':q' => $q));
    $res = $req->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($res);
  }


  // public static function search($q, $category) {
  //   $db = Db::getInstance();
  //   $q = "%$q%";
  //   $sql = "SELECT *, name AS value FROM (SELECT *, (name || instruction) AS tosearch FROM recettes) d WHERE d.tosearch LIKE :q AND d.category = :category";
  //   $req = $db->prepare($sql,  array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
  //   $req->execute(array(':q' => $q, ':category' => $category));
  //   $res = $req->fetchAll(PDO::FETCH_ASSOC);
  //   return json_encode($res);
  // }
}
?>
