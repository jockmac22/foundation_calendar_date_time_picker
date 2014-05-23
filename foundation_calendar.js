/*
Foundation Calendar Date Picker - Jocko MacGregor

Source available at: https://github.com/jockmac22/foundation_calendar_date_time_picker

Original Source Credit: Robert J. Patrick (rpatrick@mit.edu)
*/

// FCalendar
// An object wrapper that handles event signaling for calendar navigation and selection.
//
// This object will update the visible calendar date, the selected calendar date, and feed
// back to and from the field that is tied to the calendar.
var FCalendar = function(field, opts) {
	// Extend the provided opts with the defaults, and store them.
	this.opts = $.extend({}, {
		selected: null,
		visible: new Date(),
		valueFormat: 'YYYY-MM-DD HH:mm:ss',
		dateFormat: 'MMMM D, YYYY',
		timeFormat: 'HH:mm:ss',
		dateChange: null
	}, opts);
	
	// Initialize the properties for this class.
	this.field = $(field);
	this.vDate = null;
	this.sDate = null;
	
	// The selected date in the calendar, defaults to opts value, unless a value is provided
	// in the field.
	var selectedVal = this.field.val() && this.field.val().length > 0 ? this.field.val() : this.opts.selected;
	this.selected(selectedVal);
	
	// The visible month in the calendar, default to the opts value, unless a value is provided
	// in the field.'
	var visibleVal = this.field.val() && this.field.val().length > 0 ? this.field.val() : this.opts.visible;
	this.visible(visibleVal);
	
	// store a reference to this calendar in the field DOM object.
	this.field.data('calendar', this);
	
	// Wireup the value change event of the field to update the selected date.
	this.field.change(function() {
		var $this = $(this);
		var cal = $this.data('calendar');
		cal.selected($this.val(), true);
	});
}

FCalendar.prototype = {
	// Gets and/or sets the selected date with a standard Javascript date object.
	selected: function(date, stopPropagation) {
		if (date) {
			this.trigger('beforeSelectedDateChange', [date, stopPropagation]);
			this.sDate = moment(date);
			
			if (!stopPropagation) {
				this.field.val(this.sDate.format(this.opts.valueFormat));
			}
			
			this.saveState();
			this.trigger('selectedDateChange', [date, stopPropagation]);
		}
		
		return this.sDate ? this.sDate : null;
	},

	// Gets and/or sets the visible date with a standard Javascript date object.
	visible: function(date) {
		if (date) {
			this.trigger('beforeVisibleDateChange', [date]);
			this.vDate = moment(date);
			this.vDate.date(1);
			this.saveState();
			this.trigger('visibleDateChange', [date]);
		}
		
		return this.vDate ? this.vDate : null;
	},

	// Saves the current state of the calendar object to the field for later reference.
	saveState: function() {
		this.trigger('beforeSaveState')
		this.field.data('calender', this);
		this.trigger('saveState');
	},

	// Move the visible month forward or backward by a number of months
	moveMonth: function(months) {
		this.trigger('beforeMoveMonth', [months]);
		this.vDate.add('M', months);
		this.vDate.date(1);
		this.saveState();
		this.trigger('moveMonth', [months]);
	},
	
	// Move the visible year forward or backward by a number of years
	moveYear: function(years) {
		this.trigger('beforeMoveYear', [years]);
		this.vDate.add('y', years);
		this.vDate.date(1);
		this.saveState();
		this.trigger('moveYear', [years]);
	},
	
	moveTo: function(date) {
		this.trigger('beforeMoveTo', [date]);
		this.vDate = moment(date).date(1);
		this.saveState();
		this.trigger('moveTo', [date]);
	},
	
	moveToMonth: function(month) {
		this.trigger('beforeMoveToMonth', [month]);
		this.vDate.month(month);
		this.vDate.date(1);
		this.saveState();
		this.trigger('moveToMonth', [month]);
	},
	
	moveToYear: function(year) {
		this.trigger('beforeMoveToYear', [year]);
		this.vDate.year(year);
		this.vDate.date(1);
		this.saveState();
		this.trigger('moveToYear', [year]);
	},
	
	toString: function(part) {
		if (!this.sDate) {
			return '--';
		} else if (part && part[0].toLowerCase() == 'd') {
			return this.sDate.format(this.opts.dateFormat);
		} else if (part && part[0].toLowerCase() == 't') {
			return this.sDate.format(this.opts.timeFormat);
		} else {
			return this.sDate.format(this.opts.dateFormat) + " " + this.sDate.format(this.opts.timeFormat);
		}
	},
	
	trigger: function(event, params) {
		this.field.trigger(event, [this, this.opts].concat(params));
	}
}


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
			var input = $(this);
			$.fcdp.buildUI(input);
			$.fcdp.wireupInput(input);
			var opts = input.data('opts');
			input.trigger('selectedDateChange', [opts.calendar, opts.calendar.opts]);
		});
		
		// Wireup the body to hide display elements when clicked.
		$(document).click(function(evt) {
			$('.calendar').not('.fixed').find('.date-picker').hide();
			$('.calendar').find('.time-picker').hide();
		});
	},
	
	wireupInput: function(input) {
		input.bind('moveMonth', function(evt, calendar, opts, months) {
			var i_opts = $(this).data('opts');			
			$.fcdp.buildCalendar(i_opts);
		});
		
		input.bind('selectedDateChange', function(evt, calendar, opts, date) {
			var i_opts = $(this).data('opts');			
			i_opts.dom.dateSelector.find('.value').html(calendar.toString('d'));
			i_opts.dom.timeSelector.find('.value').html(calendar.toString('t'));
		});
	},
	
	/***
		UI Construction and Event Handling
	 ***/
	buildUI: function(input, opts) {
		// Build the FCalendar object
		var calendar = new FCalendar(input, {
			dateFormat: input.is('[data-date-format]') ? input.data('date-format') : 'MMMM D, YYYY',
			timeFormat: input.is('[data-time-format]') ? input.data('time-format') : 'h:mm:ss a',
			valueFormat: input.is('[data-value-format]') ? input.data('value-format') : 'YYYY-MM-DD HH:mm:ss'
		});
		
		// Wrap the input, and hide it from display.
		input.wrap('<div class="calendar"></div>');
		input.wrap('<div class="hidden"></div>');
		input.addClass('value');
		
		// Generate the calendar container
		var cal = input.closest('.calendar');
		
		// Generate the date/time selector container and add it to the calendar
		var sel = $('<div class="selector"></div>');
		cal.append(sel);
		
		// Determine if the time and datepicker states
		var hasTimePicker = (input.is('[data-time]') || input.is('[data-date-time]')) ? true : false;
		var hasDatePicker = (input.is('[data-date]') || input.is('[data-date-time]')) ? true : !hasTimePicker;
		
		// Establish a default set of options for the calendar based on unobtrusive tags in the
		// input field.
		var c_opts = {
			input: input,
			calendar: calendar,
			hasTimePicker: hasTimePicker,
			hasDatePicker: hasDatePicker,
			nullable: input.is('[data-nullable]'),
			minDate: input.is('[data-min-date]') ? this.getDateFromString(input.data('min-date')) : null,
			maxDate: input.is('[data-max-date]') ? this.getDateFromString(input.data('max-date')) : null,
			fixed: input.is('[data-fixed]') ? true : false,
			dom: {
				calendar: cal,
				dateSelector: null,
				datePicker: null,
				timeSelector: null,
				timePicker: null,
				clearButton: null
			}
		};
		
		// Incorporate the options that were passed in with the build call if they
		// are present.
		opts = $.extend({}, c_opts, opts);

		// Set the 'fixed' view class.
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
		opts.dom.dateSelector = hasDatePicker ? cal.find('.date-selector') : null;
		opts.dom.datePicker = hasDatePicker ? cal.find('.date-picker') : null;
		opts.dom.timeSelector = hasTimePicker ? sel.find('.time-selector') : null;
		opts.dom.timePicker = hasTimePicker ? cal.find('.time-picker') : null;
		opts.dom.clearButton = opts.nullable ? cal.find('a.clear') : null;
		
		cal.data('opts', opts);
		input.data('opts', opts);
		
		if (opts.dom.dateSelector) {
			opts.dom.dateSelector.click(function(evt) {
				evt.preventDefault();
				var cal = $(this).closest('.calendar');
				var tp = cal.find('.time-picker');
				var dp = cal.find('.date-picker');
				var ds = cal.find('.date-selector');
				dp.css({ top: ds.position().top + ds.outerHeight(), left: ds.position().left });
				tp.hide();
				dp.toggle();
			});
		};
		
		if (opts.dom.timeSelector) {
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
		
		if (opts.dom.clearButton) {
			opts.dom.clearButton.click(function(evt) {
				evt.preventDefault();
				var opts = $(this).closest('.calendar').data('opts');
				opts.dom.datePicker.add(opts.dom.timePicker).hide();
				$.fcdp.setFieldDate(opts, null);
			});
		};

		// this.setFieldDate(opts, this.getFieldDate(opts));
		this.buildCalendar(opts);
		this.buildTime(opts);
		this.updateTimePicker(opts);
	},
	
	buildTime: function(opts) {
		if (tp = opts.dom.timePicker) {

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
		if (tp = opts.dom.timePicker) {
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
		if (tp = opts.dom.timePicker) {
			var selectedDate = opts.calendar.selected();
		
			if (selectedDate) {
				tp.find('.value-control.hour').find('input.display').val(selectedDate.format('HH'));
				tp.find('.value-control.minute').find('input.display').val(selectedDate.format('mm'));
				tp.find('.value-control.second').find('input.display').val(selectedDate.format('ss'));
				tp.find('.value-control.ampm').find('input.display').val(selectedDate.format('A'));
			}
		}
	},
	
	updateTime: function(opts) {
		var tp;
		if (tp = opts.dom.timePicker) {

			var hour = tp.find('.value-control.hour').find('input.display').val();
			hour = hour ? parseInt(hour) : 0;
		
			var minute = tp.find('.value-control.minute').find('input.display').val();
			minute = minute ? parseInt(minute) : 0;
		
			var second = parseInt(tp.find('.value-control.second').find('input.display').val());
			second = second ? parseInt(second) : 0;
		
			var ampm = tp.find('.value-control.ampm').find('input.display').val();


			// Adjust the 24 hour value, based on the 12 hour am/pm selection.
			hour = hour == 12 ? 0 : hour;
			if (ampm.toLowerCase() === 'pm') {
				hour += 12;
			}
			hour %= 24;

			var newDate = opts.calendar.selected().hour(hour).minute(minute).second(second);
			opts.calendar.selected(newDate);
		}
	},
	
	buildCalendar: function(opts) {
		var dp = opts.dom.datePicker;
		if (dp){
			dp.empty();

			var visibleDate = moment(opts.calendar.visible());
			var selectedDate = moment(opts.calendar.selected());
			
			var week = $('<div class="week"></div>');
			var header = $('<div class="header"></div>');
			
			header.append('<a href="#" class="month-nav prev"><span></span</a>');
			header.append('<a href="#" class="month-nav next"><span></span></a>');
			header.append('<div class="month">' + moment(visibleDate).format('MMMM YYYY') + '</div>');

			dp.append(header);
		
			var labels = $('<div class="week labels"></div>');
			var ls = ['Su','Mo','Tu','We','Th','Fr','Sa'];
			for (i=0;i<7;i++) {
				labels.append('<div class="day">' + ls[i] + '</div>');
			}
			dp.append(labels);

			var i = 0;
			
			// Calculate the first Sunday date on the calendar, and set it to the currentDay
			var calendarMonth = moment(visibleDate).month();
			var lastDay = moment(visibleDate).date(visibleDate.daysInMonth());
			lastDay.add('d', (7-lastDay.day()));
			var currentDay = visibleDate.subtract('d', visibleDate.day());
			
			while (currentDay.isBefore(lastDay)) {
				for (i=0;i<7;i++) {
					var day_opts = {
						date: currentDay,
						is_current_month: currentDay.month() == calendarMonth,
						is_weekend: (currentDay.day() == 0) || (currentDay.day() == 6),
						is_today: currentDay.isSame(moment()),
						is_selected: currentDay.isSame(selectedDate),
					}
					
					week.append(this.buildDayUI(opts, day_opts));
					
					currentDay = currentDay.add('d', 1);
					currentMonth = currentDay.month();
					currentYear = currentDay.year();
				}
				
				dp.append(week);
			}

			this.wireupCalendar(opts, visibleDate);
		} 
	},
	
	buildDayUI: function(opts, day_opts) {
		day_opts.is_clickable = this.dateIsClickable(opts, day_opts);
		var response = this.executeBehavior('buildDayUI', opts, day_opts);
		// If no response from the custom method, generate the default response.
		if (!response) {
			var day_num = day_opts.date.date();
			var clazz = "day" + (day_opts.is_current_month ? "" : " other-month") + (day_opts.is_weekend ? " weekend" : "") + (day_opts.is_selected ? " selected" : "") + (day_opts.is_current ? " today" : "");
			if (!day_opts.is_current_month) {
				response = '<div class="' + clazz + '">' + day_num + '</div>';
			} else if (day_opts.is_clickable) {
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
	
	wireupCalendar: function(opts, date) {
		console.info('wireupCalendar');
		var dp  = opts.dom.datePicker;
		if (dp) {
			dp.find('a.month-nav.prev').unbind('click').click(function(evt) {
				evt.preventDefault();
				console.info('Previous Month');
				var opts = $(this).closest('.calendar').data('opts');
				opts.calendar.moveMonth(-1);
			});

			dp.find('a.month-nav.next').unbind('click').click(function(evt) {
				evt.preventDefault();
				console.info('Next Month');
				var opts = $(this).closest('.calendar').data('opts');
				opts.calendar.moveMonth(1);
			});

			dp.find('a.day').click(function(evt) {
				var $this = $(this);
				var opts = $this.closest('.calendar').data('opts');
				var dp = opts.dom.datePicker;

				dp.find('a.current').removeClass('current');
				$this.addClass('current');

				var dayDate = opts.calendar.selected($this.attr('data-date'));
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
