$:.push File.expand_path("../lib", __FILE__)

Gem::Specification.new do |s|
  s.name        = "foundation-datetime-picker-rails"
  s.version     = "1.0.0"
  s.authors     = ["jockmac22"]
  s.homepage    = "https://github.com/jockmac22/foundation_calendar_date_time_picker"
  s.summary     = "A date and time picker for the Foundation CSS framework with Rails"

  s.files       = `git ls-files`.split($\)

  s.add_dependency "railties", ">= 4.0.0"
end
