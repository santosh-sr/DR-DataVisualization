<?php  

/*phpinfo();*/
$context = $_GET['context'];

$connect = pg_connect("host=brain.isi.edu port=5432 dbname=drdata user=drreader password=drspr2013cbg") or die(pg_last_error());
error_log(print_r($query,true));

if($context === "BasketBall"){
	$query = 'select distinct data_t.objectid as object_id from latest_bball_data_table data_t order by object_id';
}else{
	$query = 'select distinct data_t.object_id from ak_spatiotemporal_data_table data_t where data_t.context_id = (select context_t.context_id from ak_context_table context_t where context_t.context_name = ' . '\'' . $context . '\'' . ' order by object_id) limit 5000';
}
error_log(print_r($query,true));

$result = pg_query($connect, $query);

$resultArray = pg_fetch_all($result);
$json = json_encode($resultArray);

error_log(print_r($json,true));

print $json;

?>