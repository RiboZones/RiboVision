<?php
//header('Content-Description: File Transfer');
//header('Content-type: application/zip');
//header('Content-Transfer-Encoding: binary');
//header("Pragma: public");

//$dir1 = '/var/www/data/rvStates';
//$dir2 = '/var/www/data/rvStates/Guest';
//if ( !file_exists($dir1) ) {
//	mkdir ($dir1, 0755);
//}
//if ( !file_exists($dir2) ) {
//	mkdir ($dir2, 0755);
//}

//ob_start(); 

$data = $_POST['content'];
//$seed = rand();
$file = tempnam("/var/www/data/rvStates/" . $_POST['username'] ,"rvs");
$fp = fopen($file, "w") or die("Couldn't open $file for writing!");
fwrite($fp, $data) or die("Couldn't write values to file!");
fclose($fp);

// Prepare File
$file2 = "/var/www/data/rvStates/" . $_POST['username'] . "/" . $_POST['datasetname'] . ".zip";
$zip = new ZipArchive();
$zip->open($file2, ZipArchive::OVERWRITE);

// Staff with content
$zip->addFile($file, 'Ribovision_State.rvs.txt');

// Close and send to users
$zip->close();

//sleep(4);

//$length_file = filesize($file2);
//header('Content-Length: ' . $length_file);
//$filenamesend = $_POST['datasetname'];
//header('Content-Disposition: attachment; filename="' . $filenamesend . '.zip"');

//readfile($file2);

//ob_clean();
//flush();
unlink($file); 
exit;

?>

