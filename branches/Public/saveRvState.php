<?php
header('Content-Description: File Transfer');
header('Content-type: application/zip');
header('Content-Transfer-Encoding: binary');
header("Pragma: public");

ob_start(); 

$data = $_POST['content'];
$seed = rand();
$file = "/var/tmp/tmp" . $_SERVER['REQUEST_TIME'] . "_" . $seed;
$fp = fopen($file . ".rvs.txt", "w") or die("Couldn't open $file for writing!");
fwrite($fp, $data) or die("Couldn't write values to file!");
fclose($fp);

// Prepare File
$file2 = tempnam("/var/tmp", "zip");
$zip = new ZipArchive();
$zip->open($file2, ZipArchive::OVERWRITE);

// Staff with content
$zip->addFile($file . ".rvs.txt", 'Ribovision_State.rvs.txt');

// Close and send to users
$zip->close();

sleep(4);

$length_file = filesize($file2);
header('Content-Length: ' . $length_file);
$filenamesend = $_POST['datasetname'];
header('Content-Disposition: attachment; filename="' . $filenamesend . '.zip"');

readfile($file2);

//ob_clean();
//flush();
//unlink($file2); 
exit;

?>

