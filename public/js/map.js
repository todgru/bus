/*global google, BM, MapLabel, alert, navigator, GeolocationMarker, MarkerClusterer*/

(function () {
  "use strict";
  window.BM = window.BM || {};
  window.BM.map = {

    map: null,
    api: null,
    labels: [],
    arrows: [],
    markers: [],
    refreshInterval: 5000,
    locationMarker: null,
    mapOptions: {
      zoom: 14,
      center: {}
    },

    // triangle: {
    //   path: 'M 0 -5 L -5 5 L 5 5 z',
    //   fillColor: 'green',
    //   fillOpacity: 0.8,
    //   scale: 1,
    //   strokeColor: 'green',
    //   strokeWeight: 0
    // },

    initialize: function () {
      // set to portland so that if we dont find a location it defaults to that...
      this.mapOptions.center = new google.maps.LatLng(45.523059, -122.667701);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(_.bind(this.locationSuccess, this), _.bind(this.locationError, this));
      } else {
        // dont have navigator.geolocation so continue on
        this.buildMap();
      }
    },

    locationSuccess: function (position) {
      this.mapOptions.center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.mapOptions.zoom = 16;
      // zoom in more, we know where user is
      this.buildMap();

      this.locationMarker = new google.maps.Marker({
        position: this.mapOptions.center,
        map: this.map
      });
    },

    locationError: function (error) {
      alert('ERROR(' + error.code + '): ' + error.message);
      this.buildMap();
    },

    buildMap: function () {
      this.map  = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);
      this.api = new BM.Api(this.map, _.bind(this.showBus, this));
      google.maps.event.addListener(this.map, 'idle', _.bind(this.refresh, this));
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
      document.getElementById('map-canvas').removeAttribute('class');
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
        // lineSymbol = {
        //   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
        // };

        //arr = this.getBearingCoor(bus[1], bus[2], bus[3]);

        //lineCoordinates = [
        //  new google.maps.LatLng(bus[1], bus[2]),
        //  new google.maps.LatLng(arr[0], arr[1]),
        //];

        //arrow = new google.maps.Polyline({
        //  path: lineCoordinates,
        //  icons: [{
        //    icon: lineSymbol,
        //    offset: '100%'
        //  }],
        //  map: this.map
        //});

        // this.arrows.push(arrow);

        var latLng = new google.maps.LatLng(bus[1], bus[2]);
        var marker = new google.maps.Marker({
          position: latLng
        });

        this.labels.push(mapLabel);
        this.markers.push(marker);

      }, this);

      // console.log(this.arrows);
      var markerCluster = new MarkerClusterer(this.map, this.markers);

      // After next refresh, only show markers that are in the viewport
      // @todo Where should this listener go? works here..
      //google.maps.event.addListener(this.map, 'idle', _.bind(this.getViewport, this));

      //_.delay(_.bind(this.refresh, this), this.refreshInterval);
    },

    // Get latest vehicle location data.
    refresh: function () {
      this.api.fetch();
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
  // @todo get viewport bounds here, so we only load whats needed
  google.maps.event.addDomListener(window, 'load', _.bind(BM.map.initialize, BM.map));

}());


