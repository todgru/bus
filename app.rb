require 'rubygems'
require 'bundler/setup'
Bundler.require(:default)

get '/?' do
  erb :map
end

get '/bus' do
  content_type :json
  bus
end

def json(arg)
  JSON.generate(arg)
end

def bus
  result_set = indifferent_params get['resultSet']['vehicle']
  veh = result_set.map {|v| [v[:routeNumber], v[:latitude], v[:longitude], v[:bearing], v[:signMessage]]}
  json(veh) 
end

# return raw bus schedule
#
def get
  appid = ENV['TRIMET_APP_ID']
  response = Unirest.get( "http://developer.trimet.org/ws/v2/vehicles?appid=#{appid}" )
  
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
