module Guru

  class ProcessInfo
    attr_accessor :asset_id, :duration, :duration_seconds, :process_duration, :process_duration_seconds, :process_seconds_per_clip_minute, :without_transcoding, :event_start, :event_end

    def initialize(attributes)
      attributes.each { |k, v| send("#{k.underscore}=", v) if respond_to?("#{k.underscore}=") }
    end

    def to_hash
      {
        :asset_id => asset_id,
        :duration => duration,
        :duration_seconds => duration_seconds,
        :process_duration => process_duration,
        :process_duration_seconds => process_duration_seconds,
        :process_seconds_per_clip_minute => process_seconds_per_clip_minute,
        :without_transcoding => without_transcoding,
        :event_start => event_start,
        :event_end => event_end
      }
    end

    def to_json
      to_hash.to_json
    end
  end
end
