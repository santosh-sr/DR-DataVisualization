<?php  

/*phpinfo();*/
$objectString = $_GET['objects'];
$startTime = $_GET['startTime'];
$endTime = $_GET['endTime'];

$connect = pg_connect("host=brain.isi.edu port=5432 dbname=drdata user=drreader password=drspr2013cbg") or die(pg_last_error());

$whereQuery = '';
if(isset($objectString)  && !empty($objectString)){
	$firstIteration = true;
	error_log(print_r($objectString,true));
	$splitArray = spliti(",", $objectString);
	error_log(print_r($splitArray,true));
	foreach ($splitArray as $value) {
		if($firstIteration){
		    $firstIteration = false;
		}else{
		    $whereQuery = $whereQuery . " or ";
		}

		//$whereQuery = $whereQuery . "t.object_id = " . $value;
		$whereQuery = $whereQuery . "t.user_id = " . $value;
	}
}

if(isset($startTime) && isset($endTime) && !empty($startTime) && !empty($endTime)){
	error_log(print_r($startTime,true));
	error_log(print_r($endTime,true));
	$whereQuery = "(" . $whereQuery . ")" . " and " . "t.std_timestamp >= " . "'" . $startTime . "'" . " and " . "t.std_timestamp <= " . "'" . $endTime . "'";
}
//$query = 'select t.object_id, t.timestamp_without_tz, t.object_position_x, t.object_position_y from ak_spatiotemporal_data_table t where' . ' ' . $whereQuery;

if(!empty($whereQuery)){
	$whereQuery = "(" . $whereQuery . ")" . " and " . "t.extradata_id = e.twitter_extradata_id limit 2500";
}else{
	$whereQuery = "t.extradata_id = e.twitter_extradata_id limit 2500";
}

$query = 'select t.user_id as object_id, t.std_timestamp as timestamp, t.latitude as object_position_x, t.longitude as object_position_y, e.raw_tweet_text as tag_text from twitter_spatiotemporal_data_table t, twitter_extradata_table e' . ' where' . ' ' . $whereQuery;

//echo $query;
error_log(print_r($query,true));

$result = pg_query($connect, $query);

$resultArray = pg_fetch_all($result);
$json = json_encode($resultArray);

error_log(print_r($json,true));

print $json;

?>