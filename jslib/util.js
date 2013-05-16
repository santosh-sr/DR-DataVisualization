  function getMinDate(jsonData){
        var min_date;
        
      if(Object.keys(jsonData).length > 0){
        
          min_date = new Date($.datepicker.formatDate('dd/MM/yy', createDate(jsonData[0].timestamp)));
          for(var data in jsonData){
            //var new_date = new Date(jsonData[data].timestamp_without_tz);
            var new_date = new Date($.datepicker.formatDate('dd/MM/yy', createDate(jsonData[data].timestamp)));
       
            if(new_date < min_date){
              min_date = new_date;
            }
          }
        }

        return min_date;
      }

function getMaxDate(jsonData){
        
        var max_date;

        if(Object.keys(jsonData).length > 0){
          max_date = new Date($.datepicker.formatDate('dd/MM/yy', createDate(jsonData[0].timestamp)));
          
          for(var data in jsonData){
            var new_date = new Date($.datepicker.formatDate('dd/MM/yy', createDate(jsonData[data].timestamp)));
            
            if(new_date > max_date){
              max_date = new_date;
            }
          }
        }

      return max_date
}

 function printObj(obj){
          var printObj = typeof JSON != "undefined" ? JSON.stringify : function(obj) {
          var arr = [];
          $.each(obj, function(key, val) {
            var next = key + ": ";
            next += $.isPlainObject(val) ? printObj(val) : val;
            arr.push( next );
          });
          return "{ " +  arr.join(", ") + " }";
        };

        return printObj(obj);
      }

 Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }

  function createDate(date){
    return new Date(date).addHours(7); 
  }

  function isGeoSpatial(selectedDataSet){
    return (selectedDataSet == "Twitter" || selectedDataSet == "Campus Cruiser") ;
  }

  function isNonGeoSpatial(selectedDataSet){
    return (selectedDataSet == "BasketBall") ;
  }

  function filterOnObjects(jsonData, objectsSelected){
    var filterJsonData = [];

    for(index in objectsSelected){
      for(x in jsonData){
        if(jsonData[x].object_id == objectsSelected[index]){
          filterJsonData.push(jsonData[x]);
        }
      }
    }

    return filterJsonData;
  }


