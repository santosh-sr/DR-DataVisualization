var gl_selectedObj = [];
var gl_hist_xaxis;
var gl_hist_yaxis;
var gl_hist_timeperiod;
var gl_data;

function initViz()
{
	var query = location.search.substring(1);
	var substrings = query.split(";");
	gl_hist_xaxis = substrings[1];
	gl_hist_yaxis = substrings[2];
	gl_hist_timeperiod = substrings[3];
	gl_selectedObj = substrings[0].split('=')[1].split(',');
	// document.write(gl_selectedObj.length + gl_hist_xaxis + gl_hist_yaxis + gl_hist_timeperiod);
}



/**
* These functions may not be necessary once I move to SQL and is only necessary while I use CSV file.
**/


function createObjectDataArrays(data,objectName)
{
	// alert("inside function");
	var objectData ='';
	for(var row in data) 
	{
		if(row == 0)
			continue;
		if(data[row][0] == objectName)
		{
			for(var item in data[row])
			{
				objectData = objectData + data[row][item] + ',';
			}
			objectData = objectData + ';';
		}
	}
	return objectData;
}

/**
* This is an integral part of the procedure to generate histogram.
**/


function groupByTimePeriod(op)
{
	var temp = op.split(';');
	var output='';
	var limit=parseInt('-1');
	for(var i in temp)
	{
		var temp2 = temp[i].split(',');
		if(parseInt(temp2[1]) > parseInt(limit))
		{
			limit = parseInt(gl_hist_timeperiod) + parseInt(temp2[1]);
			// gl_LimitList = gl_LimitList + limit + ",";
			output = output + '||' + temp[i] + ';;';	
		}
	    
		else if(parseInt(temp2[1]) <= parseInt(limit))
		{
			output = output + temp[i] + ';;';
		}
	
	}
	return output;
}


function calcDistTime(groupedOp)
{
	if(gl_hist_xaxis == "Distance" && gl_hist_yaxis == "Time")
	{
		var dist = 'Distance,Time\n';	
	}
	else
	{
		var dist = 'Time,Distance\n';		
	}	
	var X1 = parseFloat('0.0');
	var Y1 = parseFloat('0.0');
	var X2 = parseFloat('0.0');
	var Y2 = parseFloat('0.0');
	var T1 = parseInt('0');
	var T2 = parseInt('0');
	var grp = groupedOp.split('||');
	var timediff = parseInt('0');
	for(var i in grp)
	{
		var grpTemp = grp[i].split(';;');
		var period = parseInt('0');
		var temp3 = parseFloat('0.0');
		for(var j in grpTemp)
		{
			var temp2 = grpTemp[j].split(',');
			if(parseInt(period) == 0)
			{
				X1 = parseFloat(temp2[2]);
				Y1 = parseFloat(temp2[3]);
				T1 = parseInt(temp2[1]);
				period++;
			}
			else if(parseInt(period) == 1)
			{
				X2 = parseFloat(temp2[2]);
				Y2 = parseFloat(temp2[3]);
				T2 = parseInt(temp2[1]);
				period++;
			}
			else if(parseInt(period) == 2)
			{
				temp3 = parseFloat(temp3) + parseFloat(Math.sqrt(((X1-X2)*(X1-X2)) + ((Y2-Y1)*(Y2-Y1))));
				timediff = timediff + (Math.abs(T2-T1));
				//alert(lim);
				period = 0;
			}
			
		}
		if(temp3 == 0 || timediff == 0) {
		}
		else
		{
			if(gl_hist_xaxis == "Distance" && gl_hist_yaxis == "Time")
			{
				dist = dist + timediff + ',' + temp3 + '\r\n';	
			}
			else
			{
				dist = dist + temp3 + ',' + timediff + '\r\n';
			}			
			// dist = dist + '{ "Distance": "' + temp3 + '" , "Time": "' + timediff + '" },';
		}
		temp3 = 0;
		timediff = 0;
	}
	// dist = dist + '{"Distance": "0", "Time": "0"}]';
	alert(dist);
	return dist;
}


function calcSpeedTime(groupedOp)
{
	if(gl_hist_xaxis == "Speed" && gl_hist_yaxis == "Time")
	{
		var speed = 'Speed,Time\r\n';	
	}
	else
	{
		var speed = 'Time,Speed\n';		
	}	
	var X1 = parseFloat('0.0');
	var Y1 = parseFloat('0.0');
	var X2 = parseFloat('0.0');
	var Y2 = parseFloat('0.0');
	var T1 = parseInt('0');
	var T2 = parseInt('0');
	var grp = groupedOp.split('||');
	var timediff = parseInt('0');
	for(var i in grp)
	{
		var grpTemp = grp[i].split(';;');
		var period = parseInt('0');
		var temp3 = parseFloat('0.0');
		for(var j in grpTemp)
		{
			var temp2 = grpTemp[j].split(',');
			if(parseInt(period) == 0)
			{
				X1 = parseFloat(temp2[2]);
				Y1 = parseFloat(temp2[3]);
				T1 = parseInt(temp2[1]);
				period++;
			}
			else if(parseInt(period) == 1)
			{
				X2 = parseFloat(temp2[2]);
				Y2 = parseFloat(temp2[3]);
				T2 = parseInt(temp2[1]);
				period++;
			}
			else if(parseInt(period) == 2)
			{
				temp3 = parseFloat(temp3) + parseFloat(Math.sqrt(((X1-X2)*(X1-X2)) + ((Y2-Y1)*(Y2-Y1))));
				timediff = timediff + (Math.abs(T2-T1));
				temp3 = parseFloat(temp3/timediff);
				//alert(lim);
				period = 0;
			}
			
		}
		if(temp3 == 0 || timediff == 0) {
		}
		else
		{
			if(gl_hist_xaxis == "Speed" && gl_hist_yaxis == "Time")
			{
				speed = speed + temp3 + ',' + timediff + '\r\n';
			}
			else
			{
				speed = speed + timediff + ',' + temp3 + '\r\n';
			}
			
			// dist = dist + '{ "Distance": "' + temp3 + '" , "Time": "' + timediff + '" },';
		}
		temp3 = 0;
		timediff = 0;
	}
	// dist = dist + '{"Distance": "0", "Time": "0"}]';
	alert(speed);
	return speed;
}


function calcAcclTime(groupedOp)
{
	if(gl_hist_xaxis == "Acceleration" && gl_hist_yaxis == "Time")
	{
		var accl = 'Acceleration,Time\r\n';
	}
	else
	{
		var accl = 'Time,Acceleration\r\n';	
	}
	
	var X1 = parseFloat('0.0');
	var Y1 = parseFloat('0.0');
	var X2 = parseFloat('0.0');
	var Y2 = parseFloat('0.0');
	var T1 = parseInt('0');
	var T2 = parseInt('0');
	var grp = groupedOp.split('||');
	var timediff = parseInt('0');
	for(var i in grp)
	{
		var grpTemp = grp[i].split(';;');
		var period = parseInt('0');
		var temp3 = parseFloat('0.0');
		for(var j in grpTemp)
		{
			var temp2 = grpTemp[j].split(',');
			if(parseInt(period) == 0)
			{
				X1 = parseFloat(temp2[2]);
				Y1 = parseFloat(temp2[3]);
				T1 = parseInt(temp2[1]);
				period++;
			}
			else if(parseInt(period) == 1)
			{
				X2 = parseFloat(temp2[2]);
				Y2 = parseFloat(temp2[3]);
				T2 = parseInt(temp2[1]);
				period++;
			}
			else if(parseInt(period) == 2)
			{
				temp3 = parseFloat(temp3) + parseFloat(Math.sqrt(((X1-X2)*(X1-X2)) + ((Y2-Y1)*(Y2-Y1))));
				timediff = timediff + (Math.abs(T2-T1));
				temp3 = parseFloat(temp3/timediff);
				temp3 = parseFloat(temp3/timediff);
				//alert(lim);
				period = 0;
			}
			
		}
		if(temp3 == 0 || timediff == 0) {
		}
		else
		{
			if(gl_hist_xaxis == "Acceleration" && gl_hist_yaxis == "Time")
			{
				accl = accl + temp3 + ',' + timediff + '\r\n';
			}
			else
			{
				accl = accl + timediff + ',' + temp3 + '\r\n';
			}
			
			// dist = dist + '{ "Distance": "' + temp3 + '" , "Time": "' + timediff + '" },';
		}
		temp3 = 0;
		timediff = 0;
	}
	// dist = dist + '{"Distance": "0", "Time": "0"}]';
	alert(accl);
	return accl;
}


function renderChart(XPlaceHolder,YPlaceHolder) {
var data = d3.csv.parse(d3.select('#csv').text());
var valueLabelWidth = 40; // space reserved for value labels (right)
var barHeight = 20; // height of one bar
var barLabelWidth = 100; // space reserved for bar labels
var barLabelPadding = 5; // padding between bar and bar labels (left)
var gridLabelHeight = 18; // space reserved for gridline labels
var gridChartOffset = 3; // space between start of grid and first bar
var maxBarWidth = 420; // width of the bar with the max value
 
// accessor functions 
var barLabel = function(d) { return d[XPlaceHolder]; };
var barValue = function(d) { return parseFloat(d[YPlaceHolder]); };
 
// scales
var yScale = d3.scale.ordinal().domain(d3.range(0, data.length)).rangeBands([0, data.length * barHeight]);
var y = function(d, i) { return yScale(i); };
var yText = function(d, i) { return y(d, i) + yScale.rangeBand() / 2; };
var x = d3.scale.linear().domain([0, d3.max(data, barValue)]).range([0, maxBarWidth]);
// svg container element
var chart = d3.select('#chart').append("svg")
  .attr('width', maxBarWidth + barLabelWidth + valueLabelWidth)
  .attr('height', gridLabelHeight + gridChartOffset + data.length * barHeight);
// grid line labels
var gridContainer = chart.append('g')
  .attr('transform', 'translate(' + barLabelWidth + ',' + gridLabelHeight + ')'); 
gridContainer.selectAll("text").data(x.ticks(10)).enter().append("text")
  .attr("x", x)
  .attr("dy", -3)
  .attr("text-anchor", "middle")
  .text(String);
// vertical grid lines
gridContainer.selectAll("line").data(x.ticks(10)).enter().append("line")
  .attr("x1", x)
  .attr("x2", x)
  .attr("y1", 0)
  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
  .style("stroke", "#ccc");
// bar labels
var labelsContainer = chart.append('g')
  .attr('transform', 'translate(' + (barLabelWidth - barLabelPadding) + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
labelsContainer.selectAll('text').data(data).enter().append('text')
  .attr('y', yText)
  .attr('stroke', 'none')
  .attr('fill', 'black')
  .attr("dy", ".35em") // vertical-align: middle
  .attr('text-anchor', 'end')
  .text(barLabel);
// bars
var barsContainer = chart.append('g')
  .attr('transform', 'translate(' + barLabelWidth + ',' + (gridLabelHeight + gridChartOffset) + ')'); 
barsContainer.selectAll("rect").data(data).enter().append("rect")
  .attr('y', y)
  .attr('height', yScale.rangeBand())
  .attr('width', function(d) { return x(barValue(d)); })
  .attr('stroke', 'white')
  .attr('fill', 'steelblue');
// bar value labels
barsContainer.selectAll("text").data(data).enter().append("text")
  .attr("x", function(d) { return x(barValue(d)); })
  .attr("y", yText)
  .attr("dx", 3) // padding-left
  .attr("dy", ".35em") // vertical-align: middle
  .attr("text-anchor", "start") // text-align: right
  .attr("fill", "black")
  .attr("stroke", "none")
  .text(function(d) { return d3.round(barValue(d), 2); });
// start line
barsContainer.append("line")
  .attr("y1", -gridChartOffset)
  .attr("y2", yScale.rangeExtent()[1] + gridChartOffset)
  .style("stroke", "#000");
}

function updateViz()
{
	document.getElementById("chart").innerHTML = '';
	var op = createObjectDataArrays(gl_data,gl_selectedObj[0]);	
	var groupedOp = groupByTimePeriod(op);
	if((gl_hist_xaxis == "Distance" && gl_hist_yaxis == "Time") || (gl_hist_xaxis == "Time" && gl_hist_yaxis == "Distance"))
	{
		var csvVals = calcDistTime(groupedOp);
		var csvscript = document.getElementById("csv");
		csvscript.innerHTML = csvVals;
		renderChart(gl_hist_xaxis,gl_hist_yaxis);				
	}
	else if((gl_hist_xaxis == "Speed" && gl_hist_yaxis == "Time") || (gl_hist_xaxis == "Time" && gl_hist_yaxis == "Speed"))
	{
		var csvVals = calcSpeedTime(groupedOp);
		var csvscript = document.getElementById("csv");
		csvscript.innerHTML = csvVals;
		renderChart(gl_hist_yaxis,gl_hist_xaxis);				
	}
	else if((gl_hist_xaxis == "Acceleration" && gl_hist_yaxis == "Time") || (gl_hist_xaxis == "Time" && gl_hist_yaxis == "Acceleration"))
	{
		var csvVals = calcAcclTime(groupedOp);
		var csvscript = document.getElementById("csv");
		csvscript.innerHTML = csvVals;
		renderChart(gl_hist_yaxis,gl_hist_xaxis);				
	}		
	var sliderscript = document.getElementById("slider");
	sliderscript.innerHTML = '<p>Change TimePeriod:<input type="number" min="0" step="1500" value="'+parseInt(gl_hist_timeperiod)+'" onchange="showValue(this.value)" /></p>';
	
}

function showValue(newValue)
{
	gl_hist_timeperiod = newValue;
	updateViz();
}


function processData(data)
{
	gl_data = data;
	document.getElementById("inputs").style.visibility = 'hidden';
	var op = createObjectDataArrays(data,gl_selectedObj[0]);

	var groupedOp = groupByTimePeriod(op);
	if((gl_hist_xaxis == "Distance" && gl_hist_yaxis == "Time") || (gl_hist_xaxis == "Time" && gl_hist_yaxis == "Distance"))
	{
		document.getElementById("title").innerHTML = "<h3>"+gl_hist_xaxis+"(X) vs "+gl_hist_yaxis+"(Y) bar chart</h3><p>The graph shows the distribution of the distance the object(s) with (id="+gl_selectedObj[0]+") has travelled in certain units of time</p>";
		var csvVals = calcDistTime(groupedOp);
		var csvscript = document.getElementById("csv");
		csvscript.innerHTML = csvVals;
		renderChart(gl_hist_xaxis,gl_hist_yaxis);				
	}
	else if((gl_hist_xaxis == "Speed" && gl_hist_yaxis == "Time") || (gl_hist_xaxis == "Time" && gl_hist_yaxis == "Speed"))
	{
		document.getElementById("title").innerHTML = "<h3>"+gl_hist_xaxis+"(X) vs "+gl_hist_yaxis+"(Y) bar chart</h3><p>The graph shows the distribution of the Speed at which the object(s) (id="+gl_selectedObj[0]+") has travelled in certain units of time</p>";
		var csvVals = calcSpeedTime(groupedOp);
		var csvscript = document.getElementById("csv");
		csvscript.innerHTML = csvVals;
		renderChart(gl_hist_yaxis,gl_hist_xaxis);				
	}
	else if((gl_hist_xaxis == "Acceleration" && gl_hist_yaxis == "Time") || (gl_hist_xaxis == "Time" && gl_hist_yaxis == "Acceleration"))
	{
		document.getElementById("title").innerHTML = "<h3>"+gl_hist_xaxis+"(X) vs "+gl_hist_yaxis+"(Y) bar chart</h3><p>The graph shows the distribution of the Acceleration of object(s) (id="+gl_selectedObj[0]+") in certain units of time</p>";
		var csvVals = calcAcclTime(groupedOp);
		var csvscript = document.getElementById("csv");
		csvscript.innerHTML = csvVals;
		renderChart(gl_hist_yaxis,gl_hist_xaxis);				
	}
	var sliderscript = document.getElementById("slider");
	sliderscript.innerHTML = '<p>Change TimePeriod:<input type="number" min="0" step="1500" value="'+parseInt(gl_hist_timeperiod)+'" onchange="showValue(this.value)" /></p>';
	
}



