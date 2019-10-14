require 'json'
package = JSON.parse(File.read(File.join(File.dirname(__FILE__), "package.json")))
version='v' + package["version"]
Pod::Spec.new do |s|
  s.name           = package["name"].split("/").last
  s.version        = package["version"]
  s.summary        = package['description']
  s.author         = package['author']
  s.license        = package["license"]
  s.homepage       = package["homepage"]
  s.platform       = :ios, "9.0"
  s.source         = { :git => "https://github.com/gleephDamien/react-native-leanplum.git", :tag => version }
  s.source_files   = 'ios/*.{h,m}'
  s.dependency 'React'
  s.dependency 'Leanplum-iOS-SDK', '2.6.2'

end
