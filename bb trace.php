<!DOCTYPE html>
<html>
<?php session_start();?>
<?php 
$x=$_SESSION["JsonDataX"];
$y=$_SESSION["JsonDataY"];
$t=$_SESSION['JsonDataT'];


	//for($i=0; $i<count($x); $i++)
	//echo $x[$i]["bb_objectid"]."<br>";

// for($i=0; $i<count($y); $i++)
	// echo $y[$i]["bb_objectid"]."<br>";	

?>
<head>
	<script type="text/javascript" src="d3/d3.min.js"></script>
	<script type="text/javascript">

	function animate()
	{
	var x=new Array();
	var y=new Array();
	var t=new Array();
	
	
	<?php
	    for($i=0;$i<count($x); $i++)
        {
            echo "x[$i]='".$x[$i]["object_x"]."';\n";
        }
		for($i=0;$i<count($y); $i++)
        {
            echo "y[$i]='".$y[$i]["object_y"]."';\n";
        }
		for($i=0;$i<count($t); $i++)
        {
            echo "t[$i]='".$t[$i]["gameClock"]."';\n";
        }		
    ?>
	
	
    		
	var data =new Array();
	for(i=0;i< x.length; i++)
	{
	data[i]=new Array(2);
	//data.push( { "x":x[i], "y":y[i] } );
	data[i][0]=x[i];
	data[i][1]=y[i];
	//document.write(data[i].x+" "+data[i].y+"<br>");
	}
	
	

	i=-1; j=-1;
	
	w=1200;  	h=300; 	p=20;
	
	
	
		var xscale=d3.scale.linear();
		xscale.domain([2, 100]);
		xscale.range([0,1000]);
		
		var yscale = d3.scale.linear()
        .domain([10, 60])
        .range([0, 500]);
	
		
	var timeRange=d3.extent(t);
	// document.write(timeRange);
		
		var tscale = d3.scale.linear()
        .domain(timeRange)
        .range([10, 1150]);
		
		var rev_tscale=d3.scale.linear()
		.domain([10, 1150])
		.range(timeRange);
		
		var svg = d3.select("#viz").select("svg");
		svg.selectAll("circle").remove();
	
	//var g = svg.append("g")
    //.attr("transform", "translate(80,20)");
	
	
	
	
	
	/*svg.append("svg:image") 
    .attr("xlink:href", "bball_image.jpg")
		.attr("x",10) 
		.attr("y",0) 
		.attr("width", "1100") 
		.attr("height", "540") */
//		.attr("transform", "translate(0, 0)") 
/*CIRCLE*/
	
	i=0; j=0;
	function xx(e) { i++; return xscale(e[i][0]); };
	function yy(e) { j++; return yscale(e[i][1]); };
	function ff(e) { return xscale(100); };

	/*
	//To view initial graph
	var lineFunction = d3.svg.line()
	 .x(function(d) { return xscale(d[0]); })
	 .y(function(d) { return yscale(d[1]); })
	 .interpolate("linear");
	 
	var lineGraph = svg.append("path")
	.attr("d", lineFunction(data))
	.attr("stroke", "blue")
	.attr("stroke-width", 2)
	.attr("fill", "none")
	; */
	animation=true;

	function findXY(time)
	{
	animation=false;
	
	
	var index=(d3.bisect(t,time));
	//svg.append("circle")
	circle
	.attr("id","thiscircle")
	.attr("cx", xscale(data[index][0]))
    .attr("cy", yscale(data[index][1]))
	.attr("r", 5);	
	}

	var xAxis = d3.svg.axis()
	.scale(tscale)
	.orient("bottom")
	.ticks(20);
	
	svg.append("g")
	.attr("class", "axis")
	 .attr("transform", "translate(0," + (500) + ")")
	 .on("mousemove", function(){findXY(rev_tscale(d3.mouse(this)[0]));})
    .call(xAxis);
	
	var circle=svg.append("circle");
	
	
	count=1;
	
	
	
	circle
      //.enter().append("circle")
         .attr("r", 1)
         .attr("cx", xscale(data[0][0]))
         .attr("cy", yscale(data[0][1]))
		 .call(enableInteraction)
		 ;
		 
	
	
function enableInteraction()
	{
	
	if(i<x.length && animation)
	{
	i++;
	
	count++;

	if(count<=50)
	{
	
	//document.write("less"+count+"\t");
	//document.write("less-i"+i+"\t");
	
	svg.append("circle").transition()
	.duration(5)
	//.delay(function(d, dd) { return dd / n * duration; })
	.delay(20)
    .ease("linear")
    .attr("cx", xscale(data[i][0]))
    .attr("cy", yscale(data[i][1]))
    .attr("r", 2)
	.attr("fill","red")
	.attr("stroke","black")
	.each("end",enableInteraction);
	
	if (i >50)
	svg.select("circle").remove();
	
	if(count==50)
	{
	//document.write("less"+i+"\t");
	temp=i;
	i=i-50;
	svg.select("circle").remove();
	i=temp;	
	//document.write("less"+i+"\t");
	count=0;
	}
	
	}
	
	else
	{
	
	//document.write(i+"\t");
	
	/*circle.transition()	
	.duration(5)
	//.delay(function(d, dd) { return dd / n * duration; })
	// .delay(20)
    .ease("linear")
    .attr("cx", xscale(data[i][0]))
    .attr("cy", yscale(data[i][1]))
    .attr("r", 5)
	.attr("fill","red")
	.attr("stroke","black")
	.each("end",enableInteraction);
	*/
	}
	}
	
}
//alert("done");
/*CIRCLE*/


    }
    </script>
	
	 <style type="text/css">
 svg {
  
  background-image: url('bball_image.jpg');
  fill: red;
}

.points circle {
  stroke: red;
  stroke-width: 1px;
  fill: #fcdfff;
}

.axis path,
.axis line {
    fill: none;
    stroke: black;
    shape-rendering: crispEdges;
}

.axis text {
    font-family: sans-serif;
    font-size: 11px;
	font-weight: bold;
}


}
 
    </style>
</head>
<body >
<div id="viz">

<svg  width="1000" height="540" x="0" y="0">
  <!--circle cx="100" cy="100" r="2" stroke="black" stroke-width="2" fill="red"-->
</svg>
<button onClick="animate()">Click</button>

</div>


    
</body>
</html>