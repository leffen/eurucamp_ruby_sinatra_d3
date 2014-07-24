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
      @clip_data.each do |asset|
        check_asset asset["assetId"]
      end
    end


    def check
      @clip_data.map do |asset|
        data = @redis.hget SECTION, asset["assetId"]
        jdata =  JSON.parse(data) if data && data != 'null'
        puts "data = #{jdata}"
        Asset.new(jdata) if jdata
      end
    end

    def check_asset id
      jdata = @redis.hget SECTION, id

      file_name = asset_file_name(id)
      jdata = asset_from_file(id) unless jdata

      if !jdata
        url = "http://sumo.tv2.no/rest/assets/#{id}"
        response = HTTParty.get(url)
        if response.code && !response.body.include?("500 Internal Server Error")
          puts "Getting #{id} from WEB"

          jdata = response.parsed_response

          File.open(file_name, "w:UTF-8") do |f|
            f.write jdata.to_json
          end

          @redis.hset SECTION, id, jdata.to_json
        end

      end
    end

    def asset_file_name(id)
      "#{@data_dir}/#{id}.json"
    end

    def asset_from_file id
      file_name = asset_file_name(id)
      File.readlines(file_name, :encoding => 'UTF-8')if File.exist?(file_name)
    end

  end
end
