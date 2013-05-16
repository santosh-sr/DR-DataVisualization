<?php  

$objectString = $_GET['objects'];
$startTime = $_GET['startTime'];
$endTime = $_GET['endTime'];
$period = $_GET['period'];

$connect = pg_connect("host=brain.isi.edu port=5432 dbname=drdata user=drreader password=drspr2013cbg") or die(pg_last_error());

$whereQuery = '';

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

		//$whereQuery = $whereQuery . "t.object_id = " . $value;
		//$whereQuery = $whereQuery . "t.bb_objectid = " . $value;
		$whereQuery = $whereQuery . "t.objectid = " . $value;
	}
}

if(isset($startTime) && isset($endTime) && !empty($startTime) && !empty($endTime)){
	error_log(print_r($startTime,true));
	error_log(print_r($endTime,true));
	$whereQuery = "(" . $whereQuery . ")" . " and " . "\"gameClock\" >= " . "'" . $startTime . "'" . " and " . "\"gameClock\" <= " . "'" . $endTime . "'";
}

if(isset($period) && !empty($period)){
	error_log(print_r($period,true));
	$whereQuery = $whereQuery . " and " . "t.period=" . "'" . $period . "'";
}

//$query = 'select t.object_id, t.timestamp_without_tz, t.object_position_x, t.object_position_y from ak_spatiotemporal_data_table t where' . ' ' . $whereQuery;
$query = 'select t.objectid as object_id, "gameClock" as timestamp, t.period as period, t.object_position_x as object_position_x, t.object_position_y as object_position_y, t.eventtype as tag_text, t.points as points from latest_bball_data_table t limit 10000';

if(!empty($whereQuery)){
  $query = $query . ' where' . ' ' . $whereQuery;
}

error_log(print_r($query,true));

$result = pg_query($connect, $query);

$resultArray = pg_fetch_all($result);
$json = json_encode($resultArray);

error_log(print_r($json,true));

print $json;

?>