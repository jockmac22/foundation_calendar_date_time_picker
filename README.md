Calendar
====================================

__A date and time picker for the Foundation CSS framework.__

## Change Log

- 5/27/2014 -> I've added the v0.2b branch which has been overhauled from the original v0.1b version.  Read the v0.2b Branch section below.
- 3/5/2014 -> Added event triggers to the date and time picker, added a fixed display state for the calendar and updated the index.html docs.
- 2/13/2014 -> Fixed an issue with FF/Safari dates not parsing correctly.  (Thank you Date.js)
- 2/6/2014 -> Added a UTC offset calculation option that calculates the display time with an offset from UTC, and then stores the selected values as the properly calculated UTC time.

## Notes on the v0.2b Branch ##

I added a control "class" structure for the calendar management, and used it as an events handler for changes to and from the UI.  I also removed my custom date/string manipulators and date.js in favor of the moment.js library.  __This means you will have to update your format strings if you move to v0.2b__.  I apologize for the inconvenience in that respect, but moment is definitely a better way of managing the date/time values that are being manipulated.

I still have to update the docs in the v0.2b branch, particularly the library dependencies, but the implementation should still be the same.

##Introduction

Noting that the Foundation CSS Framework was lacking in the world of date and time picking, this project is an attempt to make the date and time picking process smoother and more considerate of the needs of both the user and the backend data handling system.

Having used the Date/Time picker for other frameworks, and noting that Foundation really only had one option that seemed functional, I decided to create one from the ground up. 

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

## Installation

The index.html file in the repository gives a full description of how to install and use the plugin.  Read the &lt;head&gt; section of the html to see the file requirements, and view the file to read about how to implement the plugin.

## Customization

If you want to customize the styles of the UI, you can do it directly through the foundation_calendar.css file, or you can add the _calendar.scss file to your Foundation SCSS components directory.  

If you're using SCSS, don't forget to make sure your foundation.scss file imports the _calendar.scss file appropriately. Have fun!!!

##License

The MIT License (MIT)

Copyright (c) 2014 John "Jocko" S. MacGregor Jr.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
