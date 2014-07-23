require 'json'
require_relative '../models/asset'
require_relative '../models/process_info'

module Guru

  class VideoClipReport
    attr_reader :clip_data, :clip_map

    def initialize(file_name)
      data = File.read(file_name, :encoding => 'UTF-8')
      @clip_data = JSON.parse(data).map { |e| ProcessInfo.new(e) }.sort { |a, b| a.process_seconds_per_clip_minute <=> b.process_seconds_per_clip_minute }
      @clip_map = @clip_data.each_with_object({}) { |e, o| o[e.asset_id.to_i]=e }
      @transcoders = @clip_data.group_by()
    end

    def report_1
      do_report :duration_seconds
    end

    def report_2
      do_report :process_duration_seconds
    end

    def stats
      errors = Random.rand(1000).to_s.to_i
      {
        count: @clip_map.count,
        direct: @clip_data.select{|c|c.without_transcoding}.count,
        transcoded:  @clip_data.select{|c|!c.without_transcoding}.count,
        errors: errors,
        total_process_duration_seconds:  @clip_data.select { |e| e.process_duration_seconds>0 && !e.without_transcoding }.inject(0){|sum,c| sum += c.process_duration_seconds},
        total_duration_transcodet_seconds: @clip_data.select { |e| e.process_duration_seconds>0 && !e.without_transcoding }.inject(0){|sum,c| sum += c.duration_seconds}
      }
    end


    def do_report sort_field
      @clip_data.select { |e| e.process_duration_seconds>0 && !e.without_transcoding }
      .sort { |a, b| a.send(sort_field)<=>b.send(sort_field) }
      .map { |e| [e.asset_id, e.process_duration_seconds, e.duration_seconds] }

    end

    def show
      @clip_data.each { |element| puts element.inspect }
    end

    def asset_get(asset_id)
      basic_data = @clip_map[asset_id.to_i].to_hash || {}
      extended_data = Asset.get(asset_id.to_i) || {}
      basic_data.merge(extended_data)
    end



  end

end