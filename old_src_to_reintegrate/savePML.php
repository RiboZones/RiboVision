<?php
header('Content-Description: File Transfer');
header('Content-type: application/zip');
header('Content-Disposition: attachment; filename="RiboVision_PyMOL.zip"');
header('Content-Transfer-Encoding: binary');
header("Pragma: public");

require_once('FirePHPCore/FirePHP.class.php');

ob_start(); 

$firephp = FirePHP::getInstance(true);
$var = $_POST['pdbfiles'];
$pdb_files = explode(",", $var);

$data = $_POST['content'];
$seed = rand();
$file = "/var/tmp/tmp" . $_SERVER['REQUEST_TIME'] . "_" . $seed;
$fp = fopen($file . ".pml", "w") or die("Couldn't open $file for writing!");
fwrite($fp, $data) or die("Couldn't write values to file!");
fclose($fp);

// Prepare File
$file2 = tempnam("/var/tmp", "zip");
$zip = new ZipArchive();
$zip->open($file2, ZipArchive::OVERWRITE);

// Staff with content
//$zip->addFromString('pdbfile.pdb', $var);
$zip->addFile($file . ".pml", 'RiboVision.pml');
foreach ($pdb_files as $v) {
	if (strpos($v, '.pdb') !== false) {
		$zip->addFile("structures/pdb/" . $v , $v);
	} else {
		$zip->addFile("structures/mmcif/" . $v , $v);
	}
}

// Close and send to users
$zip->close();

sleep(3);

$length_file = filesize($file2);
header('Content-Length: ' . $length_file);

readfile($file2);

//echo "Saved to $file2 successfully!";
//ob_clean();
//flush();
//unlink($file2); 
exit;

?>