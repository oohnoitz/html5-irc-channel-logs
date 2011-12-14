jQuery(document).ready(function() {
	// Bind Functions on Clicks
	jQuery("[data-function]").click(function() {
		var el = jQuery(this);
		switch (el.data("function")) {
			case 'view':
				jQuery("#channel").html('#' + el.data("channel"));
				loadLog(el.data("channel"));
				break;
			default:
				break;
		}
	});
	
	// Load Channel Logs
	var index = location.href.split(/#/);
	if (index[1]) {
		jQuery("#channel").html('#' + index[1]);
		jQuery("#alert").html('');
		loadLog(index[1]);
		return false;
	}
	loadLog('beta');
});

// Initialize Variables
var channel;
var lastLog;

// Load Channel Logs
var loadLog = function(chan) {
	var table = jQuery("#log");
	table.html(''); // Clear Table
	
	channel = chan;
	jQuery.ajax({
		url: 'system.php',
		type: 'GET',
		dataType: 'json',
		async: false,
		data: {
			request: 'log',
			channel: channel
		},
		success: function(data, textStatus, jqXHR) {
			if (data.topic != undefined && data.users != undefined && data.log != undefined) {
				table.append('<tr><td colspan="2" id="topic">Topic: ' + _format(data.topic.text) + '</td></tr>');
				table.append('<tr><td colspan="2" id="users">Users: ' + data.users.text + '</td></tr>');
				
				jQuery.each(data.log, function(i, value) {
					table.append(_log(value));
				});
				
				// RealTime Data
				lastLog = data.log[data.log.length - 1].id;
				
				// Localize Time
				jQuery("time").localize('mm.dd/HH:MM:ss');
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
		},
		complete: function(jqXHR, textStatus) {
			streamLog();
		}
	});
	return false;
}

// RealTime System
var timeLapse = 10;
var currentLapse = 0;
var streamLog = function() {
	clearTimeout(currentLapse);
	jQuery.ajax({
		url: 'system.php',
		type: 'GET',
		dataType: 'json',
		async: false,
		data: {
			request: 'log-stream',
			channel: channel,
			lastLog: lastLog
		},
		success: function(data, textStatus, jqXHR) {
			if (data.topic != undefined && data.users != undefined && data.log != undefined) {
				var table = jQuery("#log");
				
				table.find("#topic").html('Topic: ' + _format(data.topic.text));
				table.find("#users").html('Users: ' + data.users.text);
				
				jQuery.each(data.log, function(i, value) {
					table.append(_log(value));
				});
				jQuery("#alert").html('<span class="label success">There are ' + data.log.length + ' new line(s) displayed!</span>');
				
				// RealTime Data
				lastLog = data.log[data.log.length - 1].id;
				timeLapse = 10;
				
				// Localize Time
				jQuery("time").localize('mm.dd/HH:MM:ss');
			} else {
				if (timeLapse < 30) {
					timeLapse += 10;
				}
				jQuery("#alert").html('<span class="label">You are currently viewing the latest log!</span>');
			}
			currentLapse = setTimeout(streamLog, timeLapse * 1000);
		},
		error: function(jqXHR, textStatus, errorThrown) {
		},
		complete: function(jqXHR, textStatus) {
		}
	});
	return false;
}

function userInfo(nick) {
	jQuery.ajax({
		url: 'system.php',
		type: 'GET',
		dataType: 'json',
		async: false,
		data: {
			request: 'user-info',
			nick: nick
		},
		success: function(data, textStatus, jqXHR) {
			if (data.lastseen != undefined && data.lastspoke != undefined && data.channels != undefined) {
				var modal = jQuery("#modal");
			}
		},
		error: function(jqXHR, textStatus, errorThrown) {
		},
		complete: function(jqXHR, textStatus) {
		}
	});
	return false;
}
