<?php
header('Content-Description: File Transfer');
header('Content-type: text/csv');
header('Content-Disposition: attachment; filename="RibovisionDataTable.csv"');
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
$result = mb_convert_encoding($file_contents , 'UTF-16LE' , 'UTF-8');
//fclose($fp);
//echo "Saved to $file successfully!";
//ob_clean();
//flush();
//sleep(3);
//readfile($tmp_handle);
echo $result;
fclose($tmp_handle);

exit;

?>

