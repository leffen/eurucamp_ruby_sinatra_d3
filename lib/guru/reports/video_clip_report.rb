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
    end

    def report_transfer_times
      do_report :process_duration_seconds
    end

    def report_1
      do_report :duration_seconds
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