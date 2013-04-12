<?php  

/*phpinfo();*/
//$query = $_GET['query'];

$connect = pg_connect("host=brain.isi.edu port=5432 dbname=drdata user=drreader password=drspr2013cbg") or die(pg_last_error());

$result = pg_query($connect, $query);

/*/*if(!$result){
	echo "rows are not found";
}*/
$resultArray = pg_fetch_all($result);
$json = json_encode($resultArray);

error_log(print_r($myArray,true));
error_log(print_r($json,true));

//print $json;

?>