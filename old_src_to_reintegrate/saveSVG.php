<?php
header('Content-Description: File Transfer');
header('Content-type: application/svg');
header('Content-Disposition: attachment; filename="RibovisionFigure.svg"');
header('Content-Transfer-Encoding: binary');
header("Pragma: public");
$data = $_POST['content'];
//$seed = rand();
//$file = "/var/tmp/tmp" . $_SERVER['REQUEST_TIME'] . "_" . $seed;
//$fp = fopen($file . ".svg", "w") or die("Couldn't open $file for writing!");
$tmp_handle = fopen('php://memory', 'r+');
fwrite($tmp_handle, $data);
rewind($tmp_handle);
$file_contents = stream_get_contents($tmp_handle);

//fclose($fp);
//echo "Saved to $file successfully!";
//ob_clean();
//flush();
//sleep(3);
//readfile($tmp_handle);
echo $file_contents;
fclose($tmp_handle);

exit;

?>

