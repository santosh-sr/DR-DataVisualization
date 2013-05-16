var markerOverlays = [];
function createGeoMap(selectedDataSet, mapElem, jsonData, dissipating, zoom){
    var map;
    if(jsonData.length <= 0 ){
        map = new google.maps.Map(d3.select(mapElem).node(), {
        zoom: 10,
        //center: new google.maps.LatLng(40.56370508, -74.42406423), //34.03420639038086
        center: new google.maps.LatLng(34.03420639038086, -118.27208709716797),
        mapTypeId: google.maps.MapTypeId.TERRAIN
      });

        return;
    }

		 map = new google.maps.Map(d3.select(mapElem).node(), {
			zoom: zoom,
			center: new google.maps.LatLng(jsonData[0].object_position_x, jsonData[0].object_position_y),
        //    center: new google.maps.LatLng(jsonData[0].latitude, jsonData[0].longitude),
			mapTypeId: google.maps.MapTypeId.TERRAIN
		});

		var heatmapData = [];
		$.each(jsonData, function(i, item) {
			heatmapData.push(new google.maps.LatLng(jsonData[i].object_position_x, jsonData[i].object_position_y));
		});


        google.maps.event.addListener(map, 'zoom_changed', function() {
         if(map.getZoom() == 15){
              $.each(jsonData, function(i, item) {
              placeMarker(map, new google.maps.LatLng(jsonData[i].object_position_x, jsonData[i].object_position_y), jsonData[i].count);
            });
         }else{
              removeMarkers();
         }
      });
		
	
         var gradient = [
            'rgba(0, 255, 255, 0)',
            'rgba(0, 255, 255, 1)',
            'rgba(0, 191, 255, 1)',
            'rgba(0, 127, 255, 1)',
            'rgba(0, 63, 255, 1)',
            'rgba(0, 0, 255, 1)',
            'rgba(0, 0, 223, 1)',
            'rgba(0, 0, 191, 1)',
            'rgba(0, 0, 159, 1)',
            'rgba(0, 0, 127, 1)',
            'rgba(63, 0, 91, 1)',
            'rgba(127, 0, 63, 1)',
            'rgba(191, 0, 31, 1)',
            'rgba(255, 0, 0, 1)'
          ]
        var heatmap_2 = new google.maps.visualization.HeatmapLayer({
            data: heatmapData,
            dissipating: dissipating,
            map: map,
            radius: 17,
            gradient: gradient
        });

	}

  function placeMarker(map, location, count) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });


       google.maps.event.addListener(marker, 'click', function() {

           geocoder = new google.maps.Geocoder();
        geocoder.geocode({'latLng': location}, function(results, status) {
          
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              content = 'Count: ' + count + "<br />" + 'Address: ' + results[0].formatted_address;
              var infowindow = new google.maps.InfoWindow(
              { 
                content: content,
                size: new google.maps.Size(50,50)
              });

              infowindow.open(map, marker);
            }
          } else {
            alert("Geocoder failed due to: " + status);
          }
        });

     });

     markerOverlays.push(marker);
  }

  function geoCoder(lat, lng){
     var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          map.setZoom(11);
          marker = new google.maps.Marker({
              position: latlng,
              map: map
          });
          infowindow.setContent(results[1].formatted_address);
          infowindow.open(map, marker);
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
  }

  function removeMarkers(){
    if (markerOverlays) {
      for (i in markerOverlays) {
        markerOverlays[i].setMap(null);
      }

      markerOverlays.length = 0;
    }
  }


  function createBasketBallMap_(mapElem, jsonData){

   // alert("in new map");
     var grid = d3.select(mapElem).append("div")
                    .attr("id", "grid")
                    .attr("position", "relative")
                   .style("width", 1000)
                   .style("height", 500)
                   .style('border', '1px solid black');
                   // .attr("class", "chart");

     var config = {
        element: document.getElementById("grid"),
        radius: 30,
        opacity: 50
    };
    
    //creates and initializes the heatmap
    var heatmap = h337.create(config);

      var xscale=d3.scale.linear();
    xscale.domain([-5, 100]);
    xscale.range([0,1000]);
    
  var yscale = d3.scale.linear()
        .domain([-5, 60])
        .range([20, 500]);

    var map = [];
    var counter = 0;
    for (index in jsonData) {
      x_pos = jsonData[index].object_position_x;
      y_pos = jsonData[index].object_position_y;
    
      var key;  
      var found;
      
      for(var obj in map) {
        var key = map[obj];
                
        found = false;
        if((x_pos >= (Math.floor(key.x) - 1)  && x_pos <= (Math.floor(key.x) + 1)) && (y_pos >= (Math.floor(key.y) - 1)  && y_pos <= (Math.floor(key.y) + 1))){
          
          var count = key.count;
          key.count = count + 1;
          
          found = true;
          break;
        }
      }

      if(!found){
        var point = new Object();
        point.x = x_pos;
        point.y = y_pos ;
        point.count = 1;
        

        map.push(point);
        counter++;
      }
    }

    var max = 0;
    for(i in map){
      var data = map[i];
      data.x = xscale(data.x);
      data.y = yscale(data.y);
      max = data.count;

      if(max < data.count){
        max = data.count;
      }
    }
 
    // let's get some data
    max = max * 2;
    var data = {
        max: max,
        data: map
    };
 
    heatmap.store.setDataSet(data);
  }

	function createBasketBallMap(mapElem, jsonData){

		var quantize = d3.scale.quantize()
	    .domain([0, 200])
	    .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

	    var colorgroup = d3.scale.ordinal()
   	 .domain(d3.range(3))
   		 .range([ 'blue', 'red', 'green' ]); 

		var brightrange = d3.scale.linear()
   	 .domain([0,100])
    	.range([0,3]);  


		var xscale=d3.scale.linear();
		xscale.domain([2, 100]);
		xscale.range([0,1000]);
		
		var yscale = d3.scale.linear()
        .domain([0, 60])
        .range([20, 500]);
	
		
	      var min = 0;
        var max = 0;

		var map = new Array();
		var counter = 0;
		for (obj in jsonData) {
			x_pos = jsonData[obj].object_position_x;
			y_pos = jsonData[obj].object_position_y;
		
			var key; 	
			var found;
			
			for(var obj in map)	{
				var key = map[obj];
								
				found = false;
				if((x_pos >= (Math.floor(key.x) - 1)  && x_pos <= (Math.floor(key.x) + 1)) && (y_pos >= (Math.floor(key.y) - 1)  && y_pos <= (Math.floor(key.y) + 1))){
					
					var count = key.count;
					key.count = count + 1;
					
					found = true;
					break;
				}
			}

			if(!found){
				var point = new Object();
				point.x= x_pos;
				point.y =y_pos ;
				point.count = 1;
				

				map[counter] = point;
				counter++;
			}
		}

    var ramp=d3.scale.linear().domain([min,max]).range(["#add8e6","#48d1cc", "#4169e1"]);

    createGrid(mapElem, 1000, 530, map, true);
	}

	function createGrid(id, width, height, map, square)
{

    var calData = randomData(width, height, map, square);

    var displayGrid = d3.select(id).append("svg")
                    .style("width", "100%")
                    .attr("height", height);

   // var text = displayGrid.selectAll("text").data([0]).enter().append("text").attr("x", 20).attr("y", 20).text("Heat Map Visualization for Basket Ball Game!!");
    var circle = displayGrid.append("circle")
                        .attr("cx", 170)
                      .attr("cy", 250)
                       .attr("r", 20)
                        .style("stroke", "black")
                        .style("fill", "white");
                      // .style("fill", ;
            //            return;

    //var grid = d3.select(id).append("svg")
     var grid = displayGrid.append("svg")
                    .attr("width", width)
                    .attr("height", height)
                     .attr("x", 180)
                    .attr("class", "chart");

      var circle = displayGrid.append("circle")
                .attr("cx", width + 190)
                .attr("cy", 250)
                .attr("r", 20)
                .style("stroke", "black")
               .style("fill", "white");


    var row = grid.selectAll(".row")
                  .data(calData)
                .enter().append("svg:g")
                  .attr("class", "row").attr("y", 20);

	  var max  = d3.max(map, function(d){return d.count;})

    var ramp=d3.scale.linear().domain([0, max]).range(["#FFCCFF", "#dda0dd","#da70d6", "#ba55d3", "#9932cc"]);
    var col = row.selectAll(".cell")
                 .data(function (d) { return d; })
                .enter().append("svg:rect")
                 .attr("class", "cell")
                 .attr("x", function(d) { return d.x; })
                 .attr("y", function(d) { return d.y; })
                 .attr("width", function(d) { return d.width; })
                 .attr("height", function(d) { return d.height; })
         
             
          		  .on('mouseover', function() {
	                 
		         		  d3.select(this)
						.append("div")
						.style("position", "absolute")
						.style("z-index", "10")
						.style("visibility", "visible")
						.text(function(d){ 
		         		if(d.datacount > 0){
		         			return d.datacount;
		         		}});
         			})
         
                 .on('mouseout', function() {
              	     d3.select(this)
						.select("div")
						.remove();
                 })
                
                 .style("fill", function(d) {

                 	if(d.datacount > 0){
                 	  
              			return ramp(d.datacount);
                  		
              		}else{
              	
              			return '#FFF';
              		}

                  })
                 .style("stroke", '#555')
                 .append("svg:title")
   				 .text(function(d) { return d.x + "," + d.y; });

         row.selectAll("text").data(function (d) { return d; }).enter().append("text").text(function(d){ 
         	if(d.datacount > 0){
         	return d.datacount;
         }
         })
                .attr("x", function(d) { return (d.x + d.width/2 - 5) ; })
                 .attr("y", function(d) { return (d.y + d.height/2 + 5);})
                .attr('fill', 'black');

    }


function randomData(gridWidth, gridHeight, map, square)
{
    var data = new Array();
    var gridItemWidth = gridWidth / 24;
    var gridItemHeight = (square) ? gridItemWidth : gridHeight / 11;
    var startX = gridItemWidth / 2;
    var startY = gridItemHeight / 2;
    var stepX = gridItemWidth;
    var stepY = gridItemHeight;
    var xpos = startX;
    var ypos = startY;
    var newValue = 0;
    var count = 0;
    var dataCount = 0;

    var xscale=d3.scale.linear();
		xscale.domain([-5, 100]);
		xscale.range([0,1000]);
		
	var yscale = d3.scale.linear()
        .domain([-5, 60])
        .range([20, 500]);

    for (var index_a = 0; index_a < 11; index_a++)
    {
        data.push(new Array());
        for (var index_b = 0; index_b < 23; index_b++)
        {
        	dataCount = 0;
       
        	for(var obj in map){
        		
                var linear_xpos = xscale(map[obj].x);
        		var linear_ypos = yscale(map[obj].y);
        		                
        		if(linear_xpos >= xpos && linear_xpos <= (xpos + gridItemHeight) && linear_ypos >= ypos && linear_ypos <= (ypos + gridItemWidth)){
         
        			dataCount = map[obj].count;
        			break;
        		}
        	}
        	
            newValue = Math.round(Math.random() * (100 - 1) + 1);
            data[index_a].push({ 
                                time: index_b, 
                                value: newValue,
                                width: gridItemWidth,
                                height: gridItemHeight,
                                x: xpos,
                                y: ypos,
                                count: count,
                                datacount : dataCount
                            });
            xpos += stepX;
            count += 1;
        }
        xpos = startX;
        ypos += stepY;
    }
    return data;
}