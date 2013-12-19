<?php
$dsn = "mysql:host=localhost;dbname=Ribosome_View2;charset=utf8";
$username = "Chad";
$password = "U74HvFKd7cxb8Bx4";
$pdo = new PDO($dsn, $username, $password);

$filename = $argv[1];
$start = strrpos($filename, "/");
if ($start == False) $start = -1;
$tablename = substr($filename, $start + 1, strlen($filename) - 5 - $start);
if(($handle = fopen($filename, "r")) !== FALSE) {
	$dropquery = "DROP TABLE IF EXISTS " . $tablename;
	$stmt = $pdo->query($dropquery);
	echo "DROPPED TABLE:\n";

	$columnNames = fgetcsv($handle, 1000, ',', '"');
	$columnTypes = fgetcsv($handle, 1000, ',', '"');
	$createquery = "CREATE TABLE IF NOT EXISTS " . $tablename . "(
	id INT NOT NULL AUTO_INCREMENT,
	PRIMARY KEY(id),";
	for($i = 0; $i < count($columnNames); $i++){
		if($i != 0){
			$createquery = $createquery . ",";
		}
		$createquery = $createquery . $columnNames[$i] . " " . $columnTypes[$i];
	}
	$createquery = $createquery . ");";
	$stmt = $pdo->query($createquery);
	echo "CREATED TABLE: " . $tablename ."\n";
}
	fclose($handle);
	echo "LOADING DATA:\n";
	
	$loadquery = 'LOAD DATA LOCAL INFILE \'' . $filename .
    '\' INTO TABLE ' . $tablename . 
	' FIELDS TERMINATED BY \',\' OPTIONALLY ENCLOSED BY \'"\' LINES TERMINATED BY \'\r\n\' IGNORE 2 LINES' . ' (' . implode(",",$columnNames) . ');';
	
	$stmt = $pdo->query($loadquery);
	//echo $loadquery;
	echo "COMPLETE!\n";

?>









