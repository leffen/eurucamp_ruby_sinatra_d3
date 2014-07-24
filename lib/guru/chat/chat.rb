require 'faker'

module Guru

  class GuruChat

    def initialize
      start_time = Time.now
      @data = (1..10).map{|i|
        start_time = start_time-(Random.rand(10)*60)
        user = random_user
        {time: start_time.iso8601,text: Faker::Hacker.say_something_smart, author: user[:name], img: user[:thumb] }
      }
    end

    def random_user
      @users ||= make_users
      @users[Random.rand(10)]
    end

    def make_users
      (0..9).map{|i| {name:  Faker::Name.name, thumb: "http://api.randomuser.me/portraits/thumb/lego/#{i}.jpg" }}
    end

    def do_report
      @data
    end
  end
end