require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
Dotenv.load
Dir[File.join(File.dirname(__FILE__), 'lib', '**', '*.rb')].each {|file| require file }

get '/?' do
  erb :map
end

# Return bus locaton information within bounds set by SW and NE lat and long.
# optional params(Sinatra): nelat, nelon, swlat, swlon
#
get '/locations' do
  content_type :json
  b = Bus.new
  json(b.bounds_filter( params, b.locations ))
end

# Create JSON
#
def json(arg)
  JSON.generate(arg)
end

