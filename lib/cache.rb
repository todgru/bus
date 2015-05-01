#
# Simple cache module
#
class Cache

  attr_writer :url

  def initialize
    @redis = $redis
  end

  # for this timestamp
  # round down to nearest 5 second
  # does the field exist in for this redis key?
  # NO:
  #   go get value from request object
  #   record value to redis for this round_off(timestamp)
  #   return the value
  # YES:
  #   return value from redis
  #
  def get
    v = redis_lookup
    return v if v

    value = get_request_data
    redis_write value
    value
  end

  private

  # Get value from redis
  #
  def redis_lookup
    @redis.hget( key, field )
  end

  # Write value to redis
  #
  def redis_write(value)
    @redis.hset( key, field, value )
  end

  # Make http request for data for the givel url
  # @todo what if there are speacial headers that need to be set?
  #
  def get_request_data
    response = Unirest.get( @url )
    if response.code > 200
      # if not a 200 throw the error
      halt response.code, {'Content-Type' => 'text/json'}, response.body.to_s
    end
    response.body
  end

  # Name of the field in redis key
  #
  def field
    round_off(now)
  end

  # Redis key name
  #
  def key
    'bus:cache'
  end

  # round down to the nearest 5 second increment
  # 1430443508 becomes 1430443505
  # 1430443503 becomes 1430443500
  #
  def round_off(timestamp, seconds = 5)
    (( timestamp / seconds).floor) * seconds
  end

  # UTC timestamp
  #
  def now
    Time.now.to_i
  end

end
