/*global XMLHttpRequest*/

window.BM = window.BM || {};
window.BM.Api = (function () {
  "use strict";

  function Api(map, callback) {
    this.callback = callback;
    this.map = map;
    this.request = new XMLHttpRequest();
    this.request.onload = _.bind(this.loaded, this);
    this.request.onerror = _.bind(this.showError, this);
  }

  Api.prototype = {
    endPoint: '/locations',
    request: null,
    callback: null,

    // will eventually use this for polling,
    // will stay setup, just call refresh for another fetch
    fetch: function () {
      this.request.open('GET', this.url(), true);
      this.request.send();
    },

    isSuccess: function () {
      return this.request.status >= 200 && this.request.status < 400;
    },
    
    url: function () {
      return this.endPoint + '?nelat=' + this.map.getBounds().getNorthEast().lat() +
        '&nelon=' + this.map.getBounds().getNorthEast().lng() +
        '&swlat=' + this.map.getBounds().getSouthWest().lat() +
        '&swlon=' + this.map.getBounds().getSouthWest().lng();
    },

    loaded: function () {
      var data;

      if (this.isSuccess()) {
        data = JSON.parse(this.request.responseText);
        this.callback(data);
      } else {
        // We reached our target server, but it did not return a 200
        this.showError();
      }
    },

    showError: function () {
      console.error(this.request.responseText);
    }
  };

  return Api;
}());
