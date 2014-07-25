require_relative '../../lib/guru/asset/asset_importer'


desc "fetch asset data"
task :asset_import do
  importer = Guru::AssetImporter.new('data/video_clip_data.json')
  importer.process
end

desc 'Test imported assets'

task :check do
  importer = Guru::AssetImporter.new('data/video_clip_data.json')
  puts importer.check
end

task :fix_redis do
  importer = Guru::AssetImporter.new('data/video_clip_data.json')
  importer.update_redis_from_file
end