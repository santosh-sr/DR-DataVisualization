//	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"/>
//	<script type="text/javascript">

	var selectedObj = [];
	var selectedViz = [];
	var selectedVizualition;
	var selectedDataSet;
	var objectDataList;

	function clearComboItems(comboElement)
	{
		comboElement.options.length = 0;
	}

	function fnProgressBar(selectedoption, objects){
			clearComboItems();
			fnProduceObjectList(selectedoption, objects);    

		    var progressbar = $('#progressbar'),  
		        max = progressbar.attr('max'),  
		        time = (1000/max)*5,      
		        value = progressbar.val();  

		    var loading = function() {  
		        value += 1;  
		        addValue = progressbar.val(value);  
		          
		        $('.progress-value').html(value + '%'); 
		      
		  
		        if (value == max) {  
		        	clearInterval(animate);   
		    //    	progressbar.val(0); 
		        }  
		    };  
		  
		    var animate = setInterval(function() {  
		        loading();  
		    }, time);  
 
	}


	function hideProgressBar(progressBarElement){
		progressBarElement.style.visibility = 'hidden';   
	    progressBarElement.style.display = 'none'; 
	}

	function showProgressBar(progressBarElement){
	   progressBarElement.style.visibility = 'visible';   
	   progressBarElement.style.display = 'block'; 
	}	

	function fnProduceObjectList(option)
	{
		
		var url;
		url = 'data.php?context=' + option;
		console.log(url);
		$.ajax({

			url: url,
			type: 'GET',
			dataType: 'text',

			success: function(data){
				var combo = document.getElementById("objects-combo");
				var progressbar = $('#progressbar');
				progressbar.val(0);
				var x;

				objectDataList = jQuery.parseJSON(data);
				
				for (x in objectDataList) {
					if(objectDataList[x].object_id != null && objectDataList[x].object_id.length > 0){
						var option = document.createElement("option");
					    option.text = objectDataList[x].object_id;
					    option.value = objectDataList[x].object_id;
					   
					    combo.appendChild(option); 
					}
				}

				$("#objects-combo").multiselect('refresh');
				$("#objects-combo").multiselect("checkAll");

			},

			error: function(error, jqXHR)
			{
				alert("error: " + jqXHR);
			}

			
		});
	}
	
	//Returns the selected objects in the combo
	function getSelectedObjects(comboElement){
		var objects = "";
		var firstIteration = new Boolean(true);
		for (i=0;i<comboElement.length;  i++) {
		   if (comboElement[i].selected)
	        {
	           if(firstIteration){
	           	 firstIteration = false;
	           }else{
	           	 objects = objects + ",";
	           }

	           objects = objects + comboElement[i].value;
	        }
		}

		return objects;
	}
	
	
	