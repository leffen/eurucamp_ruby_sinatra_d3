require 'json'
require 'redis'
require 'httparty'
require 'fileutils'

require_relative '../string'
require_relative '../models/asset'
require_relative '../models/process_info'

module Guru
  Encoding.default_external = Encoding::UTF_8

  class AssetImporter
    SECTION = "demo_assets"

    def initialize(file_name)
      data = File.read(file_name, :encoding => 'UTF-8')
      @clip_data = JSON.parse(data)
      @redis = Redis.new

      @data_dir = "data/#{SECTION}"
      FileUtils::mkdir_p @data_dir
    end


    def process
      @override = true
      @clip_data.each do |asset|
        check_asset asset["assetId"]
      end
    end


    def check
      @clip_data.map do |asset|
        data = @redis.hget SECTION, asset["assetId"]
        jdata = JSON.parse(data) if data && data != 'null'
        puts "data = #{jdata}"
        Asset.new(jdata) if jdata
      end
    end

    def update_redis_from_file
      @clip_data.map do |asset|
        asset_hash = asset_from_file asset["assetId"]
        begin
          puts "Asset_hash = #{JSON.parse(asset_hash)}"
        rescue Exception => e
          puts "Exception : #{e}"
        end

          save_asset_to_redis  asset["assetId"], asset_hash
      end
    end


    def check_asset id
      save_asset(id, fetch_asset(id)) if @override || !get_asset(id)
    end

    def fetch_asset(id)
      url = "http://sumo.tv2.no/rest/assets/#{id}"
      response = HTTParty.get(url)
      if response.code && !response.body.include?("500 Internal Server Error")
        response.parsed_response
      else
        nil
      end
    end

    def get_asset(id)
      jdata = @redis.hget SECTION, id
      jdata = asset_from_file(id) unless jdata
      jdata
    end

    def save_asset(id, asset_hash)
      return unless asset_hash

      File.open(asset_file_name(id), "w:UTF-8") do |f|
        f.write asset_hash.to_json
      end

      save_asset_to_redis(id, asset_hash)
    end

    def save_asset_to_redis(id, asset_hash)
      @redis.hset SECTION, id, asset_hash.to_json
      puts "Redis>#{id}"
    end


    def asset_file_name(id)
      "#{@data_dir}/#{id}.json"
    end

    def asset_from_file id
      file_name = asset_file_name(id)
      File.readlines(file_name, :encoding => 'UTF-8') if File.exist?(file_name)
    end

  end
end
