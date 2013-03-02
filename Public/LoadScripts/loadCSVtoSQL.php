<?php
mysql_connect("localhost", "RVUp", "BDcrystal48") or die(mysql_error());
mysql_select_db("Ribosome_View1") or die(mysql_error());
$filename = $argv[1];
$start = strrpos($filename, "/");
if ($start == False) $start = -1;
$tablename = substr($filename, $start + 1, strlen($filename) - 5 - $start);
if(($handle = fopen($filename, "r")) !== FALSE) {
	$dropquery = "DROP TABLE IF EXISTS " . $tablename;
	mysql_query($dropquery) or die(mysql_error());
	echo "DROPPED TABLE:\n";

	$columnNames = fgetcsv($handle, 1000, ",", "'");
	$columnTypes = fgetcsv($handle, 1000, ",", "'");
	$query = "CREATE TABLE IF NOT EXISTS " . $tablename . "(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),";
	for($i = 0; $i < count($columnNames); $i++){
		if($i != 0){
			$query = $query . ",";
		}
		$query = $query . $columnNames[$i] . " " . $columnTypes[$i];
	}
	$query = $query . ");";
	echo "CREATED TABLE:\n";
	echo "LOADING DATA:\n";
	//echo $query . "\n";
	mysql_query($query) or die(mysql_error());
	$baseQuery = "INSERT INTO " . $tablename . "(" . implode(",", $columnNames) . ") VALUES(";
	while(($data = fgetcsv($handle, 1000, ",", "'")) !== FALSE){
		$query = $baseQuery . "'" . implode("','", $data) . "');";
		//echo $query . "\n";
		mysql_query($query) or die(mysql_error());
		
	}
	echo "COMPLETE!\n";
}
?>









