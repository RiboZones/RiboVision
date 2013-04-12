<?php
header('Content-Description: File Transfer');
header('Content-type: application/jpg');
header('Content-Disposition: attachment; filename="Ribovision3DFigure.jpg"');
header('Content-Transfer-Encoding: binary');
header("Pragma: public");
$data = $_POST['content'];
$seed = rand();
$file = "/var/tmp/tmp" . $_SERVER['REQUEST_TIME'] . "_" . $seed . ".jpg";
$bin = base64_decode($data);
file_put_contents($file, $bin) or die("Couldn't write values to file!");
fclose($fp);
echo "Saved to $file successfully!";

ob_clean();
flush();
sleep(3);
readfile($file);
exit;

?>

