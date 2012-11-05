<?php
header('Content-Description: File Transfer');
header('Content-type: application/png');
header('Content-Disposition: attachment; filename="RibovisionFigure.png"');
header('Content-Transfer-Encoding: binary');
header("Pragma: public");
$data = $_POST['content'];
$seed = rand();
$file = "/var/tmp/tmp" . $_SERVER['REQUEST_TIME'] . "_" . $seed;
$fp = fopen($file . ".svg", "w") or die("Couldn't open $file for writing!");
fwrite($fp, $data) or die("Couldn't write values to file!");
fclose($fp);
echo "Saved to $file successfully!";
system("inkscape -z --file=" . $file . ".svg  --export-png=" . $file . ".png" . " --export-width=5000  --export-height=6471");
ob_clean();
flush();
sleep(3);
readfile($file . ".png");
exit;

?>

