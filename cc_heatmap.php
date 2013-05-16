<?php  

/*phpinfo();*/
$objectString = $_GET['objects'];
$startTime = $_GET['startTime'];
$endTime = $_GET['endTime'];

$connect = pg_connect("host=brain.isi.edu port=5432 dbname=cruiser user=drreader password=drspr2013cbg") or die(pg_last_error());

$whereQuery = '';
set_time_limit(0);


if(isset($objectString) && !empty($objectString)){
	error_log(print_r($objectString,true));

	$splitArray = spliti(",", $objectString);
	error_log(print_r($splitArray,true));
	$firstIteration = true;
	foreach ($splitArray as $value) {
		if($firstIteration){
		    $firstIteration = false;
		}else{
		    $whereQuery = $whereQuery . " or ";
		}

		//$whereQuery = $whereQuery . "t.context_id=" . '1042' . " and " . "t.object_id = " . $value;
		$whereQuery = $whereQuery . "t.name = " . "'" . $value . "'";
	}
}

if(isset($startTime) && isset($endTime)  && !empty($startTime) && !empty($endTime)){
	error_log(print_r($startTime,true));
	error_log(print_r($endTime,true));
	//$whereQuery = "(" . $whereQuery . ")" . " and " . "to_timestamp(t.timestamp_double) >= " . "'" . $startTime . "'" . " and " . "to_timestamp(t.timestamp_double) <= " . "'" . $endTime . "'";
	$whereQuery = "(" . $whereQuery . ")" . " and " . "to_timestamp(t.\"timestamp\") >= " . "'" . $startTime . "'" . " and " . "to_timestamp(t.\"timestamp\") <= " . "'" . $endTime . "'";
}

//$query = 'select t.object_id, to_timestamp(t.timestamp_double) as timestamp, t.object_position_x, t.object_position_y from ak_spatiotemporal_data_table t where' . ' ' . $whereQuery;
$query = 'select t.name as object_id, to_timestamp(t."timestamp") as timestamp, t.latitude as object_position_x, t.longitude as object_position_y, e.tag as tag_text from cruiser t, edges e';


if(!empty($whereQuery)){
  $query = $query . ' where' . ' ' . $whereQuery . ' ' . ' and ' . 'e.id = t.cruiser_track_id limit 5000';
}else{
  $query = $query . ' where' . ' ' . 'e.id = t.cruiser_track_id limit 5000';
}

error_log(print_r($query,true));

$result = pg_query($connect, $query);

$resultArray = pg_fetch_all($result);
$json = json_encode($resultArray);

error_log(print_r($json,true));

print $json;

?>