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

  # Protected: Sets the return type JSON, status to 200 and transform the data to JSON for the return
  #
  # Returns Event
  def make_ok_return_with_json(data)
    content_type :json
    status 200
    data
  end


  configure do
    data = Guru::VideoClipReport.new('data/video_clip_data.json')
    set :report_data, data
  end

  get '/' do
    erb :index
  end

  get '/api/clip_data/r1' do
    make_ok_return(settings.report_data.report_transfer_times)
  end

  get '/api/clip_data/r2' do
    make_ok_return(settings.report_data.report_1)
  end


  get '/api/asset/:id/flow' do
    asset = settings.report_data.asset_get(params[:id])
    if asset
      make_ok_return_with_json(asset.to_json)
    else
      halt 404, "Error getting info about #{params[:id]}"
    end

  end

end

