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