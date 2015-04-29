/*global XMLHttpRequest*/

window.BM = window.BM || {};
window.BM.Api = (function () {
  "use strict";

  function Api(uri, callback) {
    this.callback = callback;
    this.uri = uri;
    this.request = new XMLHttpRequest();
    this.request.onload = _.bind(this.loaded, this);
    this.request.onerror = _.bind(this.showError, this);
  }

  Api.prototype = {
    uri: '',
    request: null,
    callback: null,

    // will eventually use this for polling,
    // will stay setup, just call refresh for another fetch
    fetch: function () {
      this.request.open('GET', this.uri, true);
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
