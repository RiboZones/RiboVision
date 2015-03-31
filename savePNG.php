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

$paper_size=json_decode($_POST['PaperSize']);
system("inkscape -z --file=" . $file . ".svg  --export-png=" . $file . ".png" . " --export-width=" . $paper_size[0] . "  --export-height=" . $paper_size[1]);

ob_clean();
flush();
sleep(3);
readfile($file . ".png");
exit;

?>

