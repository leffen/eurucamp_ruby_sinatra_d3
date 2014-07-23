require 'sinatra'
require 'uri'
require 'httparty'
require 'json'
require 'sinatra/base'
require 'sinatra/config_file'
require 'sinatra/static_assets'
require_relative 'lib/guru'


class ClipReportApp < Sinatra::Base
  enable :sessions
  enable :logging

  use Sinatra::CommonLogger

  helpers Sinatra::Partials
  register Sinatra::StaticAssets
  register Sinatra::ConfigFile

  # Protected: Sets the return type JSON, status to 200 and transform the data to JSON for the return
  #
  # Returns Event
  def make_ok_return(data)
    content_type :json
    status 200
    data.to_json
  end

  configure do
    data = Guru::VideoClipReport.new('data/video_clip_data.json')
    set :report_data, data
  end

  get '/' do
    erb :index
  end

  get '/api/video_clip/report/:id' do
    make_ok_return(settings.report_data.report_1)
  end

  get '/api/video_clip/stats' do
    make_ok_return(settings.report_data.stats)
  end

  get '/api/video_clip/notifications' do
    ce = Guru::ClipEvents.new
    make_ok_return(ce.do_report)
  end

end

