# Trimet Bus and Train Location

Sinatra, Google Maps and Trimet API.

### Resources

* Trimet [Web Services API](http://developer.trimet.org/ws_docs/)
* [Google Maps Javascript API v3](https://developers.google.com/maps/documentation/javascript/)

## Running Locally:

**Aquire a token for your local app**

* Fill out form at [Trimet](http://developer.trimet.org/appid/registration/)
* Add this id to your .bash_profile or wherever you store ENV vars ```export TRIMET_APP_ID="***********"```

**Running the server**

``` bash
$ bundle install
$ shotgun app.rb
```

