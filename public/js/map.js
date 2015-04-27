
function showBus( bus ) {

  var mapOptions = {
    zoom: 14,
    center: new google.maps.LatLng(45.523059, -122.667701)
  };

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var triangle = {
    path: 'M 0 -5 L -5 5 L 5 5 z',
    fillColor: 'green',
    fillOpacity: 0.8,
    scale: 1,
    strokeColor: 'green',
    strokeWeight: 0,
  }

  var circleLabel, maplabel, marker, i;

  // iterate through all the vehicles
  for (i = 0; i < bus.length; i++) {
    // Display Bus route number
    mapLabel = new MapLabel({
      text: bus[i][0],
      position: new google.maps.LatLng(bus[i][1], bus[i][2]),
      map: map,
      fontSize: 20,
      strokeWeight: 1,
      align: 'center',
      minZoom: 15
    });

    // Display bearing as a fancy arrow
    var lineSymbol = {
      path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
    };
    var arr = getBearingCoor(bus[i][1], bus[i][2], bus[i][3]);
    var lineCoordinates = [
      new google.maps.LatLng(bus[i][1], bus[i][2]),
      new google.maps.LatLng(arr[0], arr[1]),
    ];
    var line = new google.maps.Polyline({
        path: lineCoordinates,
        icons: [{
          icon: lineSymbol,
          offset: '100%'
        }],
        map: map
      });
  }

  // only show markers that are in the viewport
  // @todo needs to be implemented
  google.maps.event.addListener(map, 'idle', showMarkers);
}

// determine direction - KISS: N, S, E or W
//
function getBearingCoor( lat, lon, bearing ) {
  var shift = 0.000001;
  // heading north
  if (bearing > 315 || bearing <= 45 ) {
    return [lat + shift, lon];
  }
  // heading east
  if (bearing > 45 && bearing <= 135 ) {
    return [lat, lon + shift]; 
  }
  // heading south 
  if (bearing > 135 && bearing <= 225 ) {
    return [lat - shift, lon]; 
  }
  // heading west
  if (bearing > 225 && bearing <= 315 ) {
    return [lat, lon - shift]; 
  }
  return [lat, lon]; 
}

// Ask for data
//
function getJSON( uri, callback ) {
  var request = new XMLHttpRequest();
  request.open('GET', uri, true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      var data = JSON.parse(request.responseText);
      callback( data );
    } else {
      // We reached our target server, but it returned an error
      console.error(request.responseText);
    }
  };
  request.onerror = function(response) {
    console.error(response.target.responseText);
  };
  request.send();
}

// @todo
//
function showMarkers(){
}

google.maps.event.addDomListener(window, 'load', getJSON('bus', showBus));