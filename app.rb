require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)
Dotenv.load

get '/?' do
  erb :map
end

# Return bus locaton information within bounds set by SW and NE lat and long.
# optional params: nelat, nelon, swlat, swlon
#
get '/bus' do
  content_type :json
  json(filter( params, bus ))
end

def json(arg)
  JSON.generate(arg)
end

def bus
  #result_set = indifferent_params get['resultSet']['vehicle']
  #veh = result_set.map {|v| [v[:routeNumber], v[:latitude], v[:longitude], v[:bearing], v[:signMessage]]}
  #json(veh) 
  veh = Array.new
  vehicles = get['resultSet']['vehicle']
  vehicles.each do |v|
    # bus name, lat, long, bearing
    veh.push([v['routeNumber'], v['latitude'], v['longitude'], v['bearing'], v['signMessage']])
  end
  veh 
end

# Filter results to within the bounds provided
# ex: 
#   nelat 45.527346 nelon -122.658799
#   swlat 45.513875 swlon -122.677768
#   if location lat is less than ne lat and greater than swlat
#   AND
#   if location lon is less than nelon and greater than swlon
#   Keep.
#
def filter( params, locations )
  # if any of the bound are not set, we can not filter, return all locations.
  return locations if params['nelat'].nil? || params['nelon'].nil? || params['swlat'].nil? || params['swlon'].nil?

  final = Array.new
  locations.each do |loc|
    if params['nelat'].to_f > loc[1].to_f &&
       loc[1].to_f > params['swlat'].to_f && 
       params['nelon'].to_f > loc[2].to_f &&
       loc[2].to_f > params['swlon'].to_f 
      final.push( loc )
    end
  end
  final
end

# return raw bus schedule
#
def get
  response = Unirest.get( "http://developer.trimet.org/ws/v2/vehicles?appid=#{ENV['TRIMET_APP_ID']}" )
  
  if response.code > 200
    # if not a 200 throw the error
    halt response.code, {'Content-Type' => 'text/json'}, response.body.to_s
  end
  
  response.body
end

def bus_array
  [
    ['bus1', 45.525303, -122.662899],
    ['bus2', 45.524499, -122.669550],
    ['bus3', 45.523059, -122.667701],
    ['bus4', 45.520778, -122.662748]
  ]
end
