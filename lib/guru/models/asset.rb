module Guru
  class Asset

    def initialize(attributes)
      @attributes = attributes.clone
      sorted_events = @attributes["events"] ? @attributes["events"].sort { |a, b| a["timestamp"]<=>b["timestamp"] } : []
      if sorted_events.count > 1
        @attributes["time_first"] = sorted_events.first["timestamp"]
        @attributes["time_last"] = sorted_events.last["timestamp"]
        @attributes["process_duration_calc"] =((DateTime.parse(sorted_events.last["timestamp"]) - DateTime.parse(sorted_events.first["timestamp"])) * 24 * 60 * 60).to_i
      end
    end

    def self.get(asset_id)
      url = "http://rest.tv2.no/videoflow-dw-rest/cms/plugin/videoflow/videoclip/#{asset_id}"
      response = HTTParty.get(url)
      if response.code && !response.body.include?("500 Internal Server Error")
        Asset.new(response.parsed_response)
      else
        nil
      end
    end

    def to_hash
      @attributes
    end

    def to_json
      @attributes.to_json
    end

  end
end