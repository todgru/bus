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

# Test locations centered in downtown pdx, JSON string
#
def test_location_data
  '[[90,45.5181932,-122.6753792,290,"Red-Beaverton TC"],[90,45.5251823,-122.6713962,358,"Red to Airport"],[190,45.5272203,-122.6765699,358,"Yellow-Expo Ctr"],[200,45.5223582,-122.6768706,21,"Green-Clackamas"],[100,45.5246957,-122.6714386,179,"Blue to Hillsboro"],[90,45.5181932,-122.6753792,290,"Red-Beaverton TC"],[100,45.5246957,-122.6714386,179,"Blue to Hillsboro"],[190,45.5272203,-122.6765699,358,"Yellow-Expo Ctr"],[90,45.5251823,-122.6713962,358,"Red to Airport"],[200,45.5223582,-122.6768706,21,"Green-Clackamas"],[200,45.5215408,-122.6760597,201,"Green to City Ctr"],[200,45.5215408,-122.6760597,201,"Green to City Ctr"],[6,45.5193585,-122.6617899,180,"6  To Portland"],[35,45.5223071,-122.6768987,21,"35 Greeley to Univ Portland"],[12,45.5231174,-122.671012,271,"12 To Tigard TC"],[19,45.523637,-122.6594139,270,"19 Mt Scott-112th"],[8,45.5263401,-122.6755265,178,"8  OHSU-VA Hosp"],[44,45.5227094,-122.6766338,20,"44 Mocks Crest to St Johns"],[12,45.5229318,-122.6608737,90,"12 Parkrose TC"],[33,45.5222148,-122.6757153,198,"33 To Clackamas CC"]]'
end
