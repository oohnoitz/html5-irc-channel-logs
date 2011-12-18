jQuery(document).ready(function() {
	// Bind Functions on Clicks
	jQuery("[data-function]").click(function() {
		var el = jQuery(this);
		switch (el.data("function")) {
			case 'view':
				loadLog(el.data("channel"), false);
				break;
			default:
				break;
		}
	});

	// Load Channel Logs
	var index = location.href.split(/#/);
	if (index[1]) {
		jQuery("#alert").html('');
		loadLog(index[1], false);
		return false;
	}
	loadLog('beta', false);
});

// Initialize Variables
var channel;
var lastLog;

// Load Channel Logs
var loadLog = function(chan, modal) {
	// Initialize & Clear
	jQuery("#channel").html('#' + chan);
	if (modal) jQuery("#modal").modal({ hide: true, backdrop: 'static', keyboard: true });

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
				//table.append('<tr><td colspan="2" id="users">Users: ' + data.users.text + '</td></tr>');

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
				//table.find("#users").html('Users: ' + data.users.text);

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
			var modal = jQuery("#modal");
			var output = '';
			if (data.lastseen != undefined) {
				switch (data.lastseen.type) {
					case 'JOIN':
						seen = '<time class="time-modal" datetime="' + data.lastseen.timestamp_w3c + '">' + data.lastseen.timestamp + '</time> Joined ' + data.lastseen.channel;
						break;
					case 'KICK':
						seen = '<time class="time-modal" datetime="' + data.lastseen.timestamp_w3c + '">' + data.lastseen.timestamp + '</time> Kicked from ' + data.lastseen.channel;
						break;
					case 'NICK':
						seen = '<time class="time-modal" datetime="' + data.lastseen.timestamp_w3c + '">' + data.lastseen.timestamp + '</time> Changed nicks to ' + data.lastseen.text + ' on ' + data.lastseen.channel;
						break;
					case 'PART':
						seen = '<time class="time-modal" datetime="' + data.lastseen.timestamp_w3c + '">' + data.lastseen.timestamp + '</time> Parted ' + data.lastseen.channel;
						break;
					case 'QUIT':
						seen = '<time class="time-modal" datetime="' + data.lastseen.timestamp_w3c + '">' + data.lastseen.timestamp + '</time> Quits ' + data.lastseen.channel;
						break;
				}

				modal.find(".user-lastseen").html('<h5>Last Seen:</h5>' + seen);
			}

			if (data.lastspoke != undefined) {
				modal.find(".user-lastspoke").html('<h5>Last Spoke on  ' + data.lastspoke.channel + ':</h5><time class="time-modal" datetime="' + data.lastspoke.timestamp_w3c + '">' + data.lastspoke.timestamp + '</time> ' + _format(data.lastspoke.text));
			}

			if (data.channels != undefined) {
				var chans = '';
				jQuery.each(data.channels, function(i, c) {
					if (i > 0) chans += ', ';
					chans += '<a href="' + c.chan + '" onclick="loadLog(\'' + c.chan.replace('#', '') + '\', true)">' + c.chan + '</a>';
				});
				modal.find(".user-channels").html('<h5>Channels:</h5>' + chans);
			}

			jQuery("time.time-modal").localize('mm.dd/HH:MM:ss');
			modal.modal({ show: true, backdrop: 'static', keyboard: true });
		},
		error: function(jqXHR, textStatus, errorThrown) {
		},
		complete: function(jqXHR, textStatus) {
		}
	});
	return false;
}
