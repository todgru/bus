/*global google, BM, MapLabel, navigator, GeolocationMarker*/

(function () {
  "use strict";
  window.BM = window.BM || {};
  window.BM.map = {

    map: null,
    api: null,
    labels: [],
    arrows: [],
    refreshInterval: 5000,

    // triangle: {
    //   path: 'M 0 -5 L -5 5 L 5 5 z',
    //   fillColor: 'green',
    //   fillOpacity: 0.8,
    //   scale: 1,
    //   strokeColor: 'green',
    //   strokeWeight: 0
    // },

    initialize: function () {
      var mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(45.523059, -122.667701),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      
      this.map  = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      this.api = new BM.Api('/bus', _.bind(this.showBus, this));
      this.findUserLocation();
      // this.api.fetch();

    },

    clearAll: function () {
      _.each(this.labels, function (label) {
        label.setMap(null);
      }, this);

      _.each(this.arrows, function (arrow) {
        arrow.setMap(null);
      }, this);

      this.labels = this.arrows = [];
    },

    showBus: function (buses) {
      var arrow, mapLabel, lineSymbol, arr, lineCoordinates;

      this.clearAll();
      // iterate through all the vehicles
      _.each(buses, function (bus) {
        // Display Bus route number
        mapLabel = new MapLabel({
          text: bus[0],
          position: new google.maps.LatLng(bus[1], bus[2]),
          map: this.map,
          fontSize: 20,
          strokeWeight: 1,
          align: 'center',
          minZoom: 15
        });

        // Display bearing as a fancy arrow
        lineSymbol = {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        };

        arr = this.getBearingCoor(bus[1], bus[2], bus[3]);

        lineCoordinates = [
          new google.maps.LatLng(bus[1], bus[2]),
          new google.maps.LatLng(arr[0], arr[1]),
        ];

        arrow = new google.maps.Polyline({
          path: lineCoordinates,
          icons: [{
            icon: lineSymbol,
            offset: '100%'
          }],
          map: this.map
        });

        this.labels.push(mapLabel);
        this.arrows.push(arrow);

      }, this);

      // _.delay(_.bind(this.refresh, this), this.refreshInterval);

      // only show markers that are in the viewport
      // @todo needs to be implemented
      google.maps.event.addListener(this.map, 'idle', this.showMarkers);
    },

    refresh: function () {
      this.api.fetch();
    },

    showMarkers: function () {
      // nothing here yet...
    },

    findUserLocation: function () {
      var marker, geolocate, initialLocation;
      
      alert('was called');
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(_.bind(function (position) {
          geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          this.map.setCenter(initialLocation);
          console.log(geolocate);
          // marker = new GeolocationMarker(this.map);
        }, this), function () {
          console.dir(arguments);
          alert('failed');
        });
      } else {
        alert('Please make sure that location services are enabled for your browser.');
      }
    },

    // determine direction - KISS: N, S, E or W
    getBearingCoor: function (lat, lon, bearing) {
      var shift = 0.000001;
      // heading north
      if (bearing > 315 || bearing <= 45) {
        return [lat + shift, lon];
      }
      // heading east
      if (bearing > 45 && bearing <= 135) {
        return [lat, lon + shift];
      }
      // heading south
      if (bearing > 135 && bearing <= 225) {
        return [lat - shift, lon];
      }
      // heading west
      if (bearing > 225 && bearing <= 315) {
        return [lat, lon - shift];
      }
      return [lat, lon];
    }
  };

  // when google map loads we kick off the module...
  google.maps.event.addDomListener(window, 'load', _.bind(BM.map.initialize, BM.map));

}());


