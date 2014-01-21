Calendar
====================================

__A date and time picker for the Foundation CSS framework.__


##Introduction

Noting that the Foundation CSS Framework was lacking in the world of date and time picking, this project is an attempt to make the date and time picking process smoother and more considerate of the needs of both the user and the backend data handling system.

Having used the Date/Time picker for other frameworks, and noting that Foundation really only had one option that seemed functional, I decided to create one from the grond up. 

The most popular option out there has one issue that was always difficult to get over: __the input field was used as the display field__.  

This causes an issue because the user will want to see a more friendly, human readable date format (e.g. January 1, 1970 @ 2:00 pm), while the system managing the data will do better handling the date in a more easily parsed format (e.g. 1970-01-01 14:00:00).

Which is exactly why I created Calendar, for the Foundation CSS framework.

## Requirements

There are several requirements you will need to make the Calendar work.  Here's the list:

- __Foundation__ -- Well, this is a foundation plugin, so we might as well include that, because without it we're nothing.
- __Foundation Icon Fonts 3__ -- Another external dependency, but this one is used to create a better UI than would be available through my CSS skills.  The source can be [found here](http://zurb.com/playground/foundation-icon-fonts-3), but it's also included in this repository.
- __jQuery__ -- Well, it's jQuery, it's included in the repo.
- __date.js__ -- This is a date manipulation plugin that I didn't write myself.  It can be [found here](http://www.datejs.com/).  It's a pretty cool little tool for date manipulation.  Ideally, it would be nice to just build the date calculations necessary to make Calendar work, and leave the rest out, that way it's more light-weight not externally dependent.
- __date-helpers.js__ -- This is my own Date modification and manipulation helpers.  They are included in the repo, and built into the minified version of foundation_calendar.js.
- __string-helpers.js__ -- This is my own String modification and manipulation helpers.  They are included in the repo, and built into the minified version of foundation_calendar.js.

## Customization

If you want to customize the styles of the UI, you can do it directly through the foundation_calendar.css file, or you can add the _calendar.scss file to your Foundation SCSS components directory.  

If you're using SCSS, don't forget to make sure your foundation.scss file imports the _calendar.scss file appropriately. Have fun!!!
