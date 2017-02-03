<?php
  class Db {
    private static $instance = NULL;
    private static $password = NULL;
    private function __construct() {}
    private function __clone() {}
    public static function getInstance() {
      $string = file_get_contents("./config.json");
      $config = json_decode($string);
      if (!isset(self::$instance)) {
        $pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
        self::$instance = new PDO("pgsql:host=$config->host;port=$config->port;dbname=$config->dbname;user=$config->user;password=$config->password");
      } else {
      }
      return self::$instance;
    }

    public static function connect($user, $password) {
      $string = file_get_contents("./config.json");
      $config = json_decode($string);
      $pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
      try {
        self::$instance = new PDO("pgsql:host=$config->host;port=$config->port;dbname=$config->dbname;user=$config->user;password=$config->password");
      } catch (Exception $e) {
        return;
      }
      return self::$instance;
    }

    public static function updateInstance($dbName) {
      $string = file_get_contents("./config.json");
      $config = json_decode($string);
      $pdo_options[PDO::ATTR_ERRMODE] = PDO::ERRMODE_EXCEPTION;
      self::$instance = new PDO("pgsql:host=$config->host;port=$config->port;dbname=$config->dbname;user=$config->user;password=$config->password");
      return self::$instance;
    }
  }
?>
