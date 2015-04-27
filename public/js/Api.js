/*global XMLHttpRequest*/

window.BM = window.BM || {};
window.BM.Api = (function () {
  "use strict";

  function Api(uri, callback) {
    this.callback = callback;
    this.request = new XMLHttpRequest();
    this.request.open('GET', uri, true);
    this.request.onload = _.bind(this.loaded, this);
    this.request.onerror = _.bind(this.showError, this);
    this.request.send();
  }

  Api.prototype = {
    request: null,
    callback: null,

    // will eventually use this for polling,
    // will stay setup, just call refresh for another fetch
    refresh: function () {
      this.request.send();
    },

    isSuccess: function () {
      return this.request.status >= 200 && this.request.status < 400;
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
