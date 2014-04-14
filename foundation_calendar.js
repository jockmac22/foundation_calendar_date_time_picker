/*
Foundation Calendar Date Picker - Jocko MacGregor

Source available at: https://github.com/jockmac22/foundation_calendar_date_time_picker

Original Source Credit: Robert J. Patrick (rpatrick@mit.edu)
*/

$.fn.fcdp = function(opts, p1, p2) {
	var type = $.type(opts);
	if (type == 'object') {
		$(this).each(function() {
			$.fcdp.buildUI($(this), opts);
		});
	} else if (type == 'string') {
		$(this).each(function() {
			$.fcdp.execute($(this), opts, p1, p2);
		});
	}
}

$.fcdp = {
	init: function() {
		$('input[data-date-time]').add($('input[data-date]')).add($('input[data-time]')).each(function() {
			$.fcdp.buildUI($(this));
		});
		
		// Wireup the body to hide display elements when clicked.
		$(document).click(function(evt) {
			$('.calendar').not('.fixed').find('.date-picker').hide();
			$('.calendar').find('.time-picker').hide();
		});		
	},
	
	/***
		Date Manipulation Helper Methods
	 ***/
	getDateFromString: function(str, nullable) {
		nullable = nullable || true;
		return (!str && !nullable) ? null : (!str ? new Date() : new Date.parse(str));;		
	},
	
	moveMonth: function(date, months) {
		return date.add({ months: months });
	},
	
	daysInMonth: function(date) {
		lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0);
		return lastDay.getDate();
	},	
	
	dateParts: function(date) {
		var parts = {
			year: date.getYear(),
			month: date.getMonth(),
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds()
		}
		
		parts.year += parts.year < 2000 ? 1900 : 0;
		return parts;
	},
	
	/***
		UI Date Management Methods
	 ***/
	getFieldDate: function(opts) {
		var val = opts.input.val();
		date = opts.nullable && !val ? null : (!opts.nullable && !val ? new Date() : this.getDateFromString(val));
		return date;
	},
	
	// Sets the field date, date option must always be in UTC.
	setFieldDate: function(opts, date) {
		var inputVal = date ? date.format(opts.formats['value']) : '';

		opts.input.val(inputVal);

		date = date ? date.add(opts.utcOffset).hours() : date;
		this.setWorkingDate(opts, date);
	},
	
	getWorkingDate: function(opts) {
		var date_attr = opts.input.data('working-date');
		if (!date_attr || ('' + date_attr).length == 0) {
			date = new Date();
			this.setWorkingDate(opts, date, true);
		} else {
			date = this.getDateFromString(date_attr);
		}
		return date;
	},
	
	setWorkingDate: function(opts, date) {
		opts.input.data('working-date', date ? date.format('%Y-%m-%d %H:%M:%S') : '');		
		
		var dateVal = '--';
		var timeVal = '--';

		if (date) {
			dateVal = date.format(opts.formats['date']);
			timeVal = date.format(opts.formats['time']);
		}

		if (opts.dateSelector) { opts.dateSelector.find('.value').html(dateVal); }
		if (opts.timeSelector) { opts.timeSelector.find('.value').html(timeVal); }		
	},
		
	
	/***
		UI Construction and Event Handling
	 ***/
	buildUI: function(input, opts) {
		// Wrap the input, and hide it from display.
		input.wrap('<div class="calendar"></div>');
		input.wrap('<div class="hidden"></div>');
		input.addClass('value');
		
		// Generate the calendar container
		var cal = input.closest('.calendar');
		
		// Generate the date/time selector container and add it to the calendar
		var sel = $('<div class="selector"></div>');
		cal.append(sel);
		
		// Set UTC offset from the unobtrusive javascript
		var utcOffset = input.is('[data-utc-offset]') ? parseInt(input.data('utc-offset')) : 0;
		utcOffset = isNaN(utcOffset) ? 0 : utcOffset;
		
		// Determine if the time and datepicker states
		var hasTimePicker = (input.is('[data-time]') || input.is('[data-date-time]')) ? true : false;
		var hasDatePicker = (input.is('[data-date]') || input.is('[data-date-time]')) ? true : !hasTimePicker;
		
		// Establish a default set of options for the calendar based on unobtrusive tags in the
		// input field.
		var c_opts = {
			input: input,
			calendar: cal,
			formats: {
				'date': input.is('[data-date-format]') ? input.data('date-format') : '%A: %B %-d, %Y',
				'time': input.is('[data-time-format]') ? input.data('time-format') : '%-I:%M %p',
				'value': input.is('[data-value-format]') ? input.data('value-format') : '%Y-%m-%d %H:%M:%S'
			},
			hasTimePicker: hasTimePicker,
			hasDatePicker: hasDatePicker,
			nullable: input.is('[data-nullable]'),
			utcOffset: utcOffset,
			minDate: input.is('[data-min-date]') ? this.getDateFromString(input.data('min-date')) : null,
			maxDate: input.is('[data-max-date]') ? this.getDateFromString(input.data('max-date')) : null,
			fixed: input.is('[data-fixed]') ? true : false,
		};
		
		// Incorporate the options that were passed in with the build call if they
		// are present.
		if (opts) {
			opts = $.extend({}, c_opts, opts);
		} else {
			opts = c_opts;
		}		
		
		if (opts.fixed) {
			cal.addClass('fixed');
		}
		// If there's a date picker, generate its display.
		if (opts.hasDatePicker) {
			if (!opts.fixed) {
				var ds = $('<a class="date-selector"></a>');
				ds.append('<i class="fi-calendar"></i><span class="value"></span>');
				sel.append(ds);			
				sel.addClass('date');
			}
			
			var dp = $('<div class="date-picker"></div>');
			cal.append(dp);
			
			// Prevent click events on the date-picker from bubbling
			// up to the body.
			dp.click(function(evt) {
				evt.stopPropagation();
			});
		}

		// If there's a time picker, generate its display.
		if (opts.hasTimePicker && !opts.fixed) {
			var ts = $('<a class="time-selector"></a>');
			ts.append('<i class="fi-clock"></i><span class="value"></span>');
			sel.append(ts);	
			sel.addClass('time');
				
			var tp = $('<div class="time-picker"></div>');
			cal.append(tp);
			
			// Prevent click events on the time-picker from bubbling
			// up to the body.
			tp.click(function(evt) {
				evt.stopPropagation();
			});
		}
		
		if (opts.nullable) {
			var clear = $('<a class="clear"><i class="fi-x"></i></a>');
			sel.append(clear);
		}
		
		// Prevent click events on the selectors from bubbling
		// up to the body.
		sel.click(function(evt) {
			evt.stopPropagation();
		});
		
		// Add DOM element references to the options to reduce DOM queries in future calls.
		opts = $.extend(opts, {
			dateSelector: hasDatePicker ? cal.find('.date-selector') : null,
			datePicker: hasDatePicker ? cal.find('.date-picker') : null,
			timeSelector: hasTimePicker ? sel.find('.time-selector') : null,
			timePicker: hasTimePicker ? cal.find('.time-picker') : null,
			clearButton: opts.nullable ? cal.find('a.clear') : null,
		});
		
		cal.data('opts', opts);
		input.data('opts', opts);
		
		if (opts.dateSelector) {
			opts.dateSelector.click(function(evt) {
				evt.preventDefault();
				var cal = $(this).closest('.calendar');
				var tp =cal.find('.time-picker');
				var dp = cal.find('.date-picker');
				var ds = cal.find('.date-selector');
				dp.css({ top: ds.position().top + ds.outerHeight(), left: ds.position().left });
				tp.hide();
				dp.toggle();
			});
		};
		
		if (opts.timeSelector) {
			cal.find('a.time-selector').click(function(evt) {
				evt.preventDefault();
				var cal = $(this).closest('.calendar');
				var dp = cal.find('.date-picker');
				var tp = cal.find('.time-picker');
				var ts = cal.find('.time-selector');
				tp.css({ top: ts.position().top + ts.outerHeight(), right: ts.position().right });				
				dp.hide();
				tp.toggle();
			});
		};
		
		if (opts.clearButton) {
			opts.clearButton.click(function(evt) {
				evt.preventDefault();
				var opts = $(this).closest('.calendar').data('opts');
				opts.datePicker.add(opts.timePicker).hide();
				$.fcdp.setFieldDate(opts, null);
			});
		};

		this.setFieldDate(opts, this.getFieldDate(opts));
		this.buildCalendar(opts);
		this.buildTime(opts);
		this.updateTimePicker(opts);
	},
	
	buildTime: function(opts) {
		if (tp = opts.timePicker) {
		
			var header = $('<div class="header"></div>');
			var time_label = $('<div class="time">Time</div>');
			header.append(time_label);
		
			tp.append(header);
		
			var time = $('<div class="time"></div>');
		
			var ctlHour = $('<div class="value-control hour"><label>Hr</label><a class="value-change up"><span></span></a><input type="text" class="display" value="12" /><a class="value-change down"><span></span></a></div>');
			var ctlMinute = $('<div class="value-control minute"><label>Min</label><a class="value-change up"><span></span></a><input type="text" class="display" value="00" /><a class="value-change down"><span></span></a></div>');
			var ctlSecond = $('<div class="value-control second"><label>Sec</label><a class="value-change up"><span></span></a><input type="text" class="display" value="00" /><a class="value-change down"><span></span></a></div>');
			var ctlAmPm = $('<div class="value-control ampm"><label>A/P</label><a class="value-change up"><span></span></a><input type="text" class="display" value="AM" /><a class="value-change down"><span></span></a></div>');
		
			time.append(ctlHour);
			time.append(ctlMinute);
			time.append(ctlSecond);
			time.append(ctlAmPm);
		
			tp.append(time);
		
			this.wireupTime(opts);
		}
	},
	
	wireupTime: function(opts) {
		if (tp = opts.timePicker) {
			var hour = tp.find('.value-control.hour');
			this.wireupTimeValueControl(hour, 1, 12, 1);

			var minute = tp.find('.value-control.minute');
			this.wireupTimeValueControl(minute, 0, 59, 2);

			var second = tp.find('.value-control.second');
			this.wireupTimeValueControl(second, 0, 59, 2);
		
			var ampm = tp.find('.value-control.ampm');
			this.wireupTimeAmPmControl(ampm);
		}
	},
	
	wireupTimeAmPmControl: function(ampm) {
		ampm.find('.value-change').click(function(evt) {
			evt.preventDefault();
			
			var $this = $(this);
			var tvc = $this.closest('.value-control');
			var val = tvc.find('input.display').val().toLowerCase();

			val = val == 'am' ? 'PM' : 'AM';
			
			tvc.find('input.display').val(val);
			$.fcdp.updateTime($this.closest('.calendar').data('opts'));
		});
		
		ampm.find('input.display').change(function(evt) {
			var $this = $(this);
			var tvc = $this.closest('.value-control');
			var val = tvc.find('input.display').val().toLowerCase()[0];

			val = val == 'p' ? 'PM' : 'AM';
			
			tvc.find('input.display').val(val);
			$.fcdp.updateTime($this.closest('.calendar').data('opts'));
		});
	},
	
	wireupTimeValueControl: function(tvc, min, max, pad) {
		tvc.data('opts', {
			max: max,
			min: min,
			pad: pad
		});
		
		tvc.find('.value-change.up').click(function(evt) {
			evt.preventDefault();
			
			var $this = $(this);
			var tvc = $this.closest('.value-control');
			var opts = tvc.data('opts');
			var val = parseInt(tvc.find('input.display').val());
			
			val += 1;
			val = val > opts.max ? opts.min : val;
			
			tvc.find('input.display').val((''+val).lpad(pad));
			
			var calOpts = $this.closest('.calendar').data('opts');
			$.fcdp.updateTime(calOpts);			
		});
		
		tvc.find('.value-change.down').click(function(evt) {
			evt.preventDefault();
			
			var $this = $(this);
			var tvc = $this.closest('.value-control');
			var opts = tvc.data('opts');
			var val = parseInt(tvc.find('input.display').val());
			
			val -= 1;
			val = val < opts.min ? opts.max : val;
			
			tvc.find('input.display').val((''+val).lpad(pad));
			
			var calOpts = $this.closest('.calendar').data('opts');
			$.fcdp.updateTime(calOpts);			
		});
		
		tvc.find('input.display').change(function(evt) {
			var $this = $(this);
			var tvc = $this.closest('.value-control');
			var opts = tvc.data('opts');
			var val = parseInt(tvc.find('input.display').val());
			
			if (isNaN(val)) {
				val = opts.min;
			} else {
				val = val > opts.max ? opts.max : (val < opts.min ? opts.min : val);
			}
			
			tvc.find('input.display').val((''+val).lpad(pad));
			
			var calOpts = $this.closest('.calendar').data('opts');
			$.fcdp.updateTime(calOpts);			
		});
	},
	
	updateTimePicker: function(opts) {
		var tp;
		if (tp = opts.timePicker) {
			var fieldDate = this.getWorkingDate(opts);
		
			if (fieldDate) {
				tp.find('.value-control.hour').find('input.display').val(fieldDate.format('%-I'));
				tp.find('.value-control.minute').find('input.display').val(fieldDate.format('%M'));
				tp.find('.value-control.second').find('input.display').val(fieldDate.format('%S'));
				tp.find('.value-control.ampm').find('input.display').val(fieldDate.format('%p'));
			}
		}
	},
	
	updateTime: function(opts) {
		var tp;
		if (tp = opts.timePicker) {

			var hour = tp.find('.value-control.hour').find('input.display').val();
			hour = hour ? parseInt(hour) : 0;
		
			var minute = tp.find('.value-control.minute').find('input.display').val();
			minute = minute ? parseInt(minute) : 0;
		
			var second = parseInt(tp.find('.value-control.second').find('input.display').val());
			second = second ? parseInt(second) : 0;
		
			var ampm = tp.find('.value-control.ampm').find('input.display').val();


			hour = hour == 12 ? 0 : hour;
			if (ampm.toLowerCase() === 'pm') {
				hour += 12;
			}
	
			hour %= 24;

			var wDate = this.getWorkingDate(opts);
			var newDate = new Date(wDate.getFullYear(), wDate.getMonth(), wDate.getDate(), hour, minute, second);
			newDate = newDate ? newDate.add(-opts.utcOffset).hours() : newDate;
			this.setFieldDate(opts, newDate);
			
			opts.input.trigger('timeChange', [opts]);
		}
	},
	
	buildCalendar: function(opts) {
		var dp;
		if (dp = opts.datePicker){
			dp.empty();
		
			var workingDate = this.getWorkingDate(opts);
			var fieldDate = this.getFieldDate(opts);
			fieldDate = fieldDate ? fieldDate : new Date();
			
			var parts = this.dateParts(workingDate);
			var i = 0;
			var startingPos = new Date(parts.year, parts.month, 1).getDay();
			var days = this.daysInMonth(workingDate) + startingPos;
			var week = $('<div class="week"></div>');
			var previousMonth = this.moveMonth(this.getWorkingDate(opts), -1);
			var daysInPreviousMonth = this.daysInMonth(previousMonth);
						
			var header = $('<div class="header"></div>');
			header.append('<a href="#" class="month-nav prev"><span></span</a>');
			header.append('<a href="#" class="month-nav next"><span></span></a>');
			header.append('<div class="month">' + workingDate.format('%B %Y') + '</div>');
		
			dp.append(header);
		
			var labels = $('<div class="week labels"></div>');
			for (i=0;i<7;i++) {
				var ls = ['Su','Mo','Tu','We','Th','Fr','Sa'];
				labels.append('<div class="day">' + ls[i] + '</div>');
			}
			dp.append(labels);

			// Iterate the maximum 6 weeks of days (6 is the maximum number of weeks
			// on a calendar for any given month).
			for (i = 0; i < 42; i++) {
				var weekday_num = i % 7;
				
				var day_opts = {
					date: null,
					weekday_num: weekday_num,
					is_weekend: (weekday_num == 0) || (weekday_num == 6),
					is_current: false,
					day_number: 0
				}
				
				// If i is outside of the starting pos and the days in the
				// month, then we are in another month, so generate a non-link
				// display
				if (i < startingPos || i >= days) {
					if (i < startingPos) {
						day_opts.day_number = ((daysInPreviousMonth - (startingPos-1)) + i);
					} else if (i >= days) {
						day_opts.day_number = (i - days + 1);
					}
					
					week.append(this.buildOtherMonthDayUI(opts, day_opts));
				// Otherwise we are in the month, so generate a numbered current month display.
				} else {
					day_opts.day_number = i - startingPos + 1;
					day_opts.date = new Date(parts.year, parts.month, day_opts.day_number, parts.hour, parts.minute, parts.second);
					day_opts.is_current = (fieldDate.format('%Y%m%d') == day_opts.date.format('%Y%m%d')),
					week.append(this.buildDayUI(opts, day_opts));
				}
			
				// If we're at the end of the week, append the week to the display, and
				// generate a new week
				if (weekday_num == 6) {
					dp.append(week);
					week = $('<div class="week"></div>');
				}
			}
		
			this.wireupCalendar(opts);
		} 
	},
	
	buildOtherMonthDayUI: function(opts, day_opts) {
		var response = this.executeBehavior('buildOtherMonthDayUI', opts, day_opts);;

		// If no response from the custom bound behaviors, generate the default response.
		if (!response) {
			var clazz = "day other-month" + (day_opts.is_weekend ? " weekend" : "");
			response = '<div class="' + clazz + '">' + day_opts.day_number + '</div>';
		}

		return response;
	},
	
	buildDayUI: function(opts, day_opts) {
		day_opts.is_clickable = this.dateIsClickable(opts, day_opts);
		var day_num = day_opts.date.getDate();
		var response = this.executeBehavior('buildDayUI', opts, day_opts);
		
		// If no response from the custom method, generate the default response.
		if (!response) {
			var clazz = "day" + (day_opts.is_weekend ? " weekend" : "") + (day_opts.is_current ? " current" : "");
			if (day_opts.is_clickable) {
				response = '<a href="#' + day_num + '" class="' + clazz + '" data-date="' + day_opts.date.format() + '">' + day_num + '</a>';
			} else {
				response = '<span class="' + clazz + '" data-date="' + day_opts.date.format() + '">' + day_num + '</span>';
			}
		}
		
		return response;
	},
	
	dateIsClickable: function(opts, day_opts) {
		if ((opts.minDate && day_opts.date < opts.minDate) || (opts.maxDate && day_opts.date > opts.maxDate)) {
			return false;
		} 
		
		var response = this.executeBehavior('dateIsClickable', opts, day_opts);
		response = response === null ? true : response;
		
		return response;
	},
	
	wireupCalendar: function(opts) {
		var dp;
		if (dp = opts.datePicker) {
			dp.find('a.month-nav.prev').click(function(evt) {
				evt.preventDefault();

				var opts = $(this).closest('.calendar').data('opts');
				var prevMonth = $.fcdp.moveMonth($.fcdp.getWorkingDate(opts), -1);
				$.fcdp.setWorkingDate(opts, prevMonth);
				$.fcdp.buildCalendar(opts);
				
				opts.input.trigger('monthChange', [opts]);
				opts.input.trigger('monthPrev', [opts]);
			});

			dp.find('a.month-nav.next').click(function(evt) {
				evt.preventDefault();

				var opts = $(this).closest('.calendar').data('opts');
				var nextMonth = $.fcdp.moveMonth($.fcdp.getWorkingDate(opts), 1);
				$.fcdp.setWorkingDate(opts, nextMonth);
				$.fcdp.buildCalendar(opts);

				opts.input.trigger('monthChange', [opts]);
				opts.input.trigger('monthNext', [opts]);
			});

			dp.find('a.day').click(function(evt) {
				var $this = $(this);
				var opts = $this.closest('.calendar').data('opts');
				var dp = opts.datePicker;

				dp.find('a.current').removeClass('current');
				$this.addClass('current');

				var dayDate = $.fcdp.getDateFromString($this.attr('data-date'));
				var fieldDate = $.fcdp.getFieldDate(opts) || $.fcdp.getWorkingDate(opts);

				var newDate = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), fieldDate.getHours(), fieldDate.getMinutes(), fieldDate.getSeconds());
				$.fcdp.setFieldDate(opts, newDate);
				
				opts.input.trigger('dateChange', [opts]);
				dp.hide();
			});
		}
	},
	
	execute: function(input, cmd, p1, p2) {
		switch(cmd) {
		case 'bindBehavior':
			this.bindBehavior(input, p1, p2);
			break;
		};
	},
	
	bindBehavior: function(input, behavior, func) {
		if ($.isFunction(func)) {
			var behaviors = input.data('behaviors');
			behaviors = behaviors || {}
			behaviors[behavior] = behaviors[behavior] || [];
			behaviors[behavior].push(func);
			input.data('behaviors', behaviors);
		}
	},
	
	executeBehavior: function(behavior, opts, addl_opts) {
		var response = null;
		var behaviors = opts.input.data('behaviors');
		
		if (behaviors && behaviors[behavior]) {
			$.each(behaviors[behavior], function() {
				if ($.isFunction(this)) {
					response = this(opts, addl_opts, response);
				}
			});
		}
		return response;
	}
}

$(document).ready(function() { $.fcdp.init(); });
