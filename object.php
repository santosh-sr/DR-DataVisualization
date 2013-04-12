<?php  

/*phpinfo();*/
$objectString = $_GET['objects'];

$connect = pg_connect("host=brain.isi.edu port=5432 dbname=drdata user=drreader password=drspr2013cbg") or die(pg_last_error());

$splitArray = spliti(",", $objectString);
error_log(print_r($splitArray,true));

$whereQuery = '';
$firstIteration = true;
foreach ($splitArray as $value) {
	if($firstIteration){
	    $firstIteration = false;
	}else{
	    $whereQuery = $whereQuery . " or ";
	}

	$whereQuery = $whereQuery . "t.object_id = " . $value;
}

$query = 'select t.object_id, t.timestamp_without_tz, t.object_position_x, t.object_position_y from ak_spatiotemporal_data_table t where' . ' ' . $whereQuery;
error_log(print_r($query,true));

$result = pg_query($connect, $query);

$resultArray = pg_fetch_all($result);
$json = json_encode($resultArray);

error_log(print_r($json,true));

print $json;

?>