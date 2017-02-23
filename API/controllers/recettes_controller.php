<?php
class RecettesController {
    public function liste() {
        $dbs = Recettes::liste();
        echo $dbs;
    }
    public function create() {
        // $txt = '{"recette":{"nbrPersonne":4,"category": 1, "name": "tarte aux pommes", "preparationTime":45,"instruction":"coucou voici la recette"},"ingredients":[{"name":"oeuf","amount":5,"unit":""},{"name":"farine","amount":500,"unit":"g"},{"name":"sucre","amount":1,"unit":"kg"}]}';
        $txt = $_POST['recette'];
        $obj = json_decode($txt);
        $dbs = Recettes::create($obj);
        echo($dbs);
    }
    public function delete() {
        $id = $_POST['id'];
        Recettes::delete($id);
    }
    public function search() {
        $q = $_GET['q'];
        // $category = $_GET['category'];
        $category = "";
        $obj = Recettes::search($q, $category);
        echo $obj;
    }

    public function getCategory() {
        $obj = Recettes::getCategory();
        echo $obj;
    }

    public function getById() {
        $recetteId = $_POST['id'];
        $obj = Recettes::getById($recetteId);
        echo $obj;
    }

    public function getAll() {
        $all_recettes = Recettes::getAll();

        header('Content-Type: application/json');
        echo json_encode($all_recettes);
    }

    public function upload() {
        print_r($_POST);
        if($_FILES['file_upload']['error'] > 0){
            die('An error ocurred when uploading.');
        }

        if(!getimagesize($_FILES['file_upload']['tmp_name'])){
            die('Please ensure you are uploading an image.');
        }

        // Check filetype
        // if($_FILES['file_upload']['type'] != 'image/png'){
        //     die('Unsupported filetype uploaded.');
        // }

        // Check filesize
        if($_FILES['file_upload']['size'] > 500000){
            die('File uploaded exceeds maximum upload size.');
        }

        // Check if the file exists
        if(file_exists('upload/' . $_FILES['file_upload']['name'])){
            die('File with that name already exists.');
        }

        // Upload file
        if(!move_uploaded_file($_FILES['file_upload']['tmp_name'], '../uploads/' . $_FILES['file_upload']['name'])){
            die('Error uploading file - check destination is writeable.');
        } else {
            Recettes::create(json_decode($_POST['recette']), '/marmiton/uploads/' . $_FILES['file_upload']['name']);
        }

        die('File uploaded successfully.');
    }
}
?>
