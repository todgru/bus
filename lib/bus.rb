#
#
class Bus

  def initialize
  end

  # Get all vehicle locations
  #
  def locations
    result_set = Array.new
    Trimet::get_all_vehicles['resultSet']['vehicle'].each do |hash|
      result_set.push (Hash[hash.map{ |k, v| [k.to_sym, v] }])
    end

    body_filter(result_set)
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
  def bounds_filter( filter, locations )
    # if any of the bound are not set, we can not filter, return all locations.
    return locations if filter['nelat'].nil? || filter['nelon'].nil? || filter['swlat'].nil? || filter['swlon'].nil?

    final = Array.new
    locations.each do |loc|
      if filter['nelat'].to_f > loc[1].to_f &&
         loc[1].to_f > filter['swlat'].to_f &&
         filter['nelon'].to_f > loc[2].to_f &&
         loc[2].to_f > filter['swlon'].to_f
        final.push( loc )
      end
    end
    final
  end

  # Format the response from Trimet for our consumptions
  # @param body
  # @todo used keyed array
  #
  def body_filter(body)
    body.map {|v| [v[:routeNumber], v[:latitude], v[:longitude], v[:bearing], v[:signMessage]]}
  end

end
