<?php 
	$data = file_get_contents("php://input");
	$filename = "parameters".time().".json";
    $myfile = fopen($filename, "w");
    fwrite($myfile, $data);
    fclose($myfile);
?>