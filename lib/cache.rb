#
# Simple cache module
#
class Cache

  attr_writer :url, :expire, :round

  def initialize
    @redis = $redis

    # set default value of exipre time
    @expire = 300 if @expire.nil?

    # set default round down time
    @round = 5 if @round.nil?
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

  # Get value from redis, stored as JSON
  #
  def redis_lookup
    r = @redis.get( key )
    if r
      return JSON.parse(r)
    else
      return nil
    end
  end

  # Write JSON value to redis
  #
  def redis_write(value)
    @redis.setex( key, expire, JSON.generate(value) )
  end

  # Seconds to key expires
  def expire
    @expire
  end

  # Make http request for data for the givel url
  # @todo what if there are speacial headers that need to be set?
  # @note Unirest returns object NOT JSON.
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
    "bus:cache:#{field}"
  end

  # round down to the nearest 5 second increment
  # 1430443508 becomes 1430443505
  # 1430443503 becomes 1430443500
  #
  def round_off(timestamp, seconds = round)
    (( timestamp / seconds).floor) * seconds
  end

  # UTC timestamp
  #
  def now
    Time.now.to_i
  end

  def round
    @round
  end

end
