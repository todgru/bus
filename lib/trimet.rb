module Trimet

  # return all vehicle locations and relative data
  #
  def self.get_all_vehicles
    response = Unirest.get( "http://developer.trimet.org/ws/v2/vehicles?appid=#{ENV['TRIMET_APP_ID']}" )
    
    if response.code > 200
      # if not a 200 throw the error
      halt response.code, {'Content-Type' => 'text/json'}, response.body.to_s
    end
    
    response.body
  end

  # test
  #
  def bus_array
    [
      ['bus1', 45.525303, -122.662899],
      ['bus2', 45.524499, -122.669550],
      ['bus3', 45.523059, -122.667701],
      ['bus4', 45.520778, -122.662748]
    ]
  end
end
