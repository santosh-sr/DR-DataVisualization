//	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"/>
//	<script type="text/javascript">

	var selectedObj = [];
	var selectedViz = [];
	var selectedDataSet;
	var selectedVizualition;
	var jsonData;
	function fnSelectData(value)
	{
		selectedDataSet = value;
		document.getElementById("viz").style.visibility = 'visible';
		fnProduceObjectList(value);
	}

	function fnGenerateViz()
	{
		
			for(var i=0;i<selectedViz.length;i++)
			{
				
				if(selectedViz[i] == "HeatMap") {
					newWindow = window.open("heatmap.html","_blank","location=no,titlebar=no");
				
					newWindow.onload = function(){

					mapElem = newWindow.document.getElementById('map');

					dissipating = false;
					zoom = 5;
				
					if(selectedDataSet == "Campus Cruiser"){
						dissipating = true;
						zoom = 15;
					}

					//Create the map
					//createMap(mapElem, jsonData, dissipating, zoom);
					createBasketBallMap(mapElem, jsonData);
				}

			}
		
		}
	}

	function fnConfigureGraphOptions()
	{
	
		var output='<h2>Graph Configurations</h2>';
		for(var i=0;i<selectedViz.length;i++)
		{
			if(selectedViz[i].value == "Histogram") {
				output = output + '<h3>Histogram Configuration</h3><span><p>X-Axis&nbsp;<select id="hist_xaxis" onchange="checkValueHist()"><option value="select">--select--</option><option value="Time">Time</option><option value="Distance">Distance</option><option value="Speed">Speed</option><option value="Acceleration">Acceleration</option></select></p><p>Y-Axis&nbsp;<select id="hist_yaxis" onchange="checkValueHist()"><option value="select">--select--</option><option value="Time">Time</option><option value="Distance">Distance</option><option value="Speed">Speed</option><option value="Acceleration">Acceleration</option></select></p><p>Time Period (in seconds) &nbsp;<input type="text" id="hist_timeperiod" /></p></span>';
			}
			if(selectedViz[i].value == "ScatterPlot") {
				output = output + '<h3>Scatter Plot Configuration</h3><span><p>X-Axis&nbsp;<select id="scatt_xaxis"><option value="select">--select--</option><option value="Time">Time</option><option value="XDist">x-distance (latitude)</option><option value="YDist">y-distance (longitude)</option></select></p><p>Y-Axis&nbsp;<select id="scatt_yaxis"><option value="select">--select--</option><option value="Time">Time</option><option value="XDist">x-distance (latitude)</option><option value="YDist">y-distance (longitude)</option></select><p>Z-Axis&nbsp;<select id="scatt_zaxis"><option value="select">--select--</option><option value="Time">Time</option><option value="XDist">x-distance (latitude)</option><option value="YDist">y-distance (longitude)</option></select></p></span>';
			}
			if(selectedViz[i].value == "BubblePlot") {
				output = output + '<h3>Bubble Plot Configuration</h3><span><p>X-Axis&nbsp;<select id="bub_xaxis"><option value="select">--select--</option><option value="Time">Time</option><option value="XDist">x-distance (latitude)</option><option value="YDist">y-distance (longitude)</option></select></p><p>Y-Axis&nbsp;<select id="bub_yaxis"><option value="select">--select--</option><option value="Time">Time</option><option value="XDist">x-distance (latitude)</option><option value="YDist">y-distance (longitude)</option></select></p><p>Bubble Size&nbsp;<select id="bub_bubsize"><option value="select">--select--</option><option value="Time">Time</option><option value="XDist">x-distance (latitude)</option><option value="YDist">y-distance (longitude)</option></select>';
			}
			if(selectedViz[i].value == "HeatMap") {
				output = output + '<h3>Heat Map Configuration</h3>';
			}

		}
		output = output + '<br/><input type="button" id="generateViz" onclick="fnGenerateViz()" value="Generate Visualization!"/>'
		var Optionsdiv = document.getElementById("part1");
		Optionsdiv.innerHTML = output;
	}

	function fnGetSelectedObjects()
	{
		
		var chkList = document.getElementsByName("vizList");

		for(var i=0;i<chkList.length;i++)
		{
			if(chkList[i].checked){
				selectedViz.push(chkList[i].value);
			}
		}
	
			

		url ='object.php?objects=' + getSelectedObjects();
		console.log(url);
	 	$.ajax({

				url: url,
				type: 'GET',
				dataType: 'text',

				success: function(data){

					jsonData = jQuery.parseJSON(data);
					
					fnConfigureGraphOptions();


				},

				error: function(error, jqXHR)
				{
					alert(jqXHR);
				}

				
		});	
	}

	function fnProduceObjectList(option)
	{
		
		output = "<span><p>Select the objects that you want to trace</p><label for='ol'>Object List</label><br/>";
		output = output + '<select name="combo" id="combo" multiple="multiple"></select>';
		output = output + '</span><input type="button" name="btnObjSelect" id="btnObjSelect" value="Next" onclick="fnGetSelectedObjects()"/>'

		var url;
		
		url = 'data.php?context=' + option;

		$.ajax({

			url: url,
			type: 'GET',
			dataType: 'text',

			success: function(data){

				var objectsetdiv = document.getElementById("objectset");
				objectsetdiv.innerHTML = output;
				var combo = document.getElementById("combo");
				var x;

				jsonData = jQuery.parseJSON(data);
				for (x in jsonData) {
					 var option = document.createElement("option");
					    option.text = jsonData[x].object_id;
					    option.value = jsonData[x].object_id;
					   
					    combo.appendChild(option); 
				}

			},

			error: function(error, jqXHR)
			{
				alert("error: " + jqXHR);
			}

			
		});
	}
	
	//Returns the selected objects in the combo
	function getSelectedObjects(){
		var combo = document.getElementById("combo");
		var objects = "";
		var firstIteration = new Boolean(true);
		for (i=0;i<combo.length;  i++) {
		   if (combo[i].selected)
	        {
	           if(firstIteration){
	           	 firstIteration = false;
	           }else{
	           	 objects = objects + " , ";
	           }

	           objects = objects + combo[i].value;
	        }
		}

		return objects;
	}
	
	function createMap(mapElem, jsonData, dissipating, zoom){

		var map = new google.maps.Map(d3.select(mapElem).node(), {
			zoom: zoom,
			center: new google.maps.LatLng(jsonData[0].object_position_x, jsonData[0].object_position_y),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});

		var heatmapData = [];
		$.each(jsonData, function(i, item) {
			heatmapData.push(new google.maps.LatLng(jsonData[i].object_position_x, jsonData[i].object_position_y));
		});
		
		var heatmap = new google.maps.visualization.HeatmapLayer({
		    data: heatmapData,
		    dissipating: dissipating,
		    map: map
		});

	}

	function createBasketBallMap(mapElem, jsonData){
			var quantize = d3.scale.quantize()
	    .domain([0, .15])
	    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

		var xscale=d3.scale.linear();
		xscale.domain([2, 100]);
		xscale.range([0,1000]);
		
		var yscale = d3.scale.linear()
        .domain([10, 60])
        .range([0, 500]);
	
		
		/*var timeRange=d3.extent(t);
	// document.write(timeRange);
		
		var tscale = d3.scale.linear()
        .domain(timeRange)
        .range([10, 1150]);
		
		var rev_tscale=d3.scale.linear()
		.domain([10, 1150])
		.range(timeRange);*/
		//alert(jsonData);
		var svg = d3.select(mapElem).append("svg");
		svg.append("rect").attr("height", 500).attr("width", 1000).style("fill", "purple");

		 // or var map = {};
		var map = new Array();
		var counter = 0;
		for (obj in jsonData) {
			x_pos = jsonData[obj].object_position_x;
			y_pos = jsonData[obj].object_position_y;
			console.log(x_pos);
			console.log(y_pos);

			//var keysList = Object.getOwnPropertyNames(map);
			
			var key; 	
			var found;
			alert(map.length);
			for(var obj in map)	{
				var key = map[obj];
				alert(key);
				//alert(obj + ":" + map[obj] + ":" + obj.y);
				
				found = false;
				if((x_pos >= (Math.floor(key.x) - 1)  && x_pos <= (Math.floor(key.x) + 1)) && (y_pos >= (Math.floor(key.y) - 1)  && y_pos <= (Math.floor(key.y) + 1))){
					
					var count = key.count;
					key.count = count + 1;
					console.log("-----------------------------");
					console.log(key.count);
					console.log("-----------------------------");
					found = true;
					break;
				}
			}

			if(!found){
				var point = new Object();
				point.x= x_pos;
				point.y =y_pos ;
				point.count = 1;
				alert(point.y);
				map[counter] = point;
				counter++;
			}
		}
		
	
		for(var obj in map){
			alert(obj);
			var ci = map[obj];

			console.log("x: " + ci.x + "y: " + ci.y + "count:" + ci.count);
		}

	}
	