<?php
$dsn = "mysql:host=localhost;dbname=Ribosome_View1";
$username = "website";
$pdo = new PDO($dsn, $username);

$rows = array();
if(isset($_GET['Residues'])) {
    $query = "SELECT * FROM " . $_GET['Residues'];
	$stmt = $pdo->query($query);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['SpeciesTable'])) {
	$stmt = $pdo->prepare("SELECT * FROM SpeciesTables2 WHERE SS_Table = ?");
	$stmt->execute(array($_GET['SpeciesTable']));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['FetchMapList'])){
	$query = "SELECT Species_Name, Species_Abr, Subunit, MapType, SS_Table FROM SpeciesTables2";
	$stmt = $pdo->query($query);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['TextLabels'])) {
    $query = "SELECT * FROM " . $_GET['TextLabels'];
	$stmt = $pdo->query($query);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['LineLabels'])) {
    $query = "SELECT * FROM " . $_GET['LineLabels'];
	$stmt = $pdo->query($query);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['BasePairs'])) {
    $query = "SELECT * FROM " . $_GET['BasePairs'];
	$stmt = $pdo->query($query);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['FullTable'])) {
    $query = "SELECT * FROM " . $_GET['FullTable'];
	$stmt = $pdo->query($query);
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
} else if(isset($_GET['ProtBasePairs'])) {
    $query = "SELECT * FROM " . $_GET['ProtBasePairs'];
	$stmt = $pdo->prepare($query . " WHERE ProteinName = ?");
	$stmt->execute(array($_GET['ProtChain']));
	$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
}
echo json_encode($rows);
?>
