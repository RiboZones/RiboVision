<?php

// Prepare File
$file2 = "/var/www/data/rvStates/" . $_POST['username'] . "/" . $_POST['datasetname'] . ".zip";
$zip = new ZipArchive();
$zip->open($file2);
$zip->extractTo("/var/www/data/rvStates/" . $_POST['username'], 'Ribovision_State.rvs.txt');
$zip->close();

$json_data = file_get_contents("/var/www/data/rvStates/" . $_POST['username'] . '/Ribovision_State.rvs.txt');
echo $json_data;
//json_decode($json_data, true);

//sleep(4);

//$length_file = filesize($file2);
//header('Content-Length: ' . $length_file);
//$filenamesend = $_POST['datasetname'];
//header('Content-Disposition: attachment; filename="' . $filenamesend . '.zip"');

//readfile($file2);

//ob_clean();
//flush();
unlink("/var/www/data/rvStates/" . $_POST['username'] . '/Ribovision_State.rvs.txt'); 
exit;

?>

