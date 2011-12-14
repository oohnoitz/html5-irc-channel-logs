function _format(input) {
	var newText		= '';
	var input			= _escape(_sanitize(input));
	var pageF			= 'black';
	var pageB			= 'white';
	var length		= input.length;
	var bold			= false;
	var color			= false;
	var italics		= false;
	var reverse		= false;
	var underline	= false;
	var colorF		= '';
	var colorB		= '';
	
	// Format String
	for (i = 0; i < length; i++) {
		switch(input.charAt(i))
		{
			case String.fromCharCode(3):
				if (color) {
					newText += '</span>';
					color = false;
				}
				colorF = '';
				colorB = '';
				
				if ((parseInt(input.charAt(i+1)) >= 0) && (parseInt(input.charAt(i+1)) <= 9)) {
					color = true;
					
					if ((parseInt(input.charAt(++i+1)) >= 0) && (parseInt(input.charAt(i+1)) <= 9)) {
						colorF = _colors(parseInt(input.charAt(i)) * 10 + parseInt(input.charAt(++i)));
					} else {
						colorF = _colors(parseInt(input.charAt(i)));
					}
					if ((input.charAt(i+1) == ',') && (parseInt(input.charAt(++i+1)) >=0) && (parseInt(input.charAt(i+1)) <= 9)) {
						if ((parseInt(input.charAt(++i+1)) >= 0) && (parseInt(input.charAt(i+1)) <= 9)) {
							colorB = _colors(parseInt(input.charAt(i)) * 10 + parseInt(input.charAt(++i)));
						} else {
							colorB = _colors(parseInt(input.charAt(i)));
						}
					}
				}
				if (colorF) {
					newText += '<span style="color: ' + colorF;
					if (colorB) newText += '; background-color: ' + colorB;
					newText += '">';
				}
				break;
			
			case String.fromCharCode(2):
				if (bold) {
					newText += '</b>';
					bold = false;
				} else {
					newText += '<b>';
					bold = true;
				}
				break;
			
			case String.fromCharCode(4):
				if (italics) {
					newText += '</i>';
					italics = false;
				} else {
					newText += '<i>';
					italics = true;
				}
				break;
			
			case String.fromCharCode(22):
				if (reverse) {
					newText += '</span>';
					reverse = false;
				} else {
					newText += '<span style="color: ' + pageB + '; background-color: ' + pageF + '">';
					reverse = true;
				}
				break;
			
			case String.fromCharCode(31):
				if (underline) {
					newText += '</u>';
					underline = false;
				} else {
					newText += '<u>';
					underline = true;
				}
				break;
			
			case String.fromCharCode(15):
				if (underline) {
					newText += '</u>';
					underline = false;
				}
				if (reverse) {
					newText += '</span>';
					reverse = false;
				}
				if (italics) {
					newText += '</i>';
					italics = false;
				}
				if (color) {
					newText += '</span>';
					color = false;
				}
				if (bold) {
					newText += '</b>';
					bold = false;
				}
				break;
			
			default:
				newText += input.charAt(i);
		}
	}
	
	// Reset All Codes
	if (underline)	newText += '</u>';
	if (reverse)		newText += '</span>';
	if (italics)		newText += '</i>';
	if (color)			newText += '</span>';
	if (bold)				newText += '</b>';
	
	// Return Formatted String
	return newText;
}

// Get IRC Color
function _colors(number) {
	number = parseInt(number);
	switch (number) {
		case 0:		return 'white';
		case 1:		return 'black';
		case 2:		return 'navy';
		case 3:		return 'green';
		case 4:		return 'red';
		case 5:		return 'maroon';
		case 6:		return 'purple';
		case 7:		return 'olive';
		case 8:		return 'yellow';
		case 9:		return 'lime';
		case 10:	return 'teal';
		case 11:	return 'aqua';
		case 12:	return 'blue';
		case 13:	return 'fuchsia';
		case 14:	return 'gray';
		default:	return 'silver';
	}
}

// Escape HTML
function _escape(string) {
	return string
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

// Sanitize String
function _sanitize(string) {
	return string
		.replace(//g, "01")
		.replace(//g, "01") 
		.replace(/:/g, "01:")
		.replace(/([0-9])\,([0-9])([0-9])/g, "0\$1,\$2\$3")
		.replace(/([0-9])\,([0-9])/g, "0\$1,\$2")
		.replace(/([0-9])([a-zA-Z>\.<\* ])/gi, "0\$1\$2")
		.replace(/([a-zA-Z><\* ])/i, "01\$1")
		.replace(/, /g, " ,"); 
}

// LOG2HTML
function _log(data) {
	var output = '<tr id="' + data.id + '"><td class="log TIMESTAMP"><time datetime="' + data.timestamp_w3c + '">' + data.timestamp + '</time></td>';
			
	switch (data.type) {
		case 'MESSAGE':
			output += '<td class="log ' + data.type + '">&lt;<span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span>&gt; ' + _format(data.text) + '</td>';
			break;
		case 'NOTICE':
			return;
		case 'CTCP':
			var args = data.text.split(' ');
			if (args[0] == 'ACTION:') {
				args[0] = ''; args = args.join(' ');
				output += '<td class="log ' + data.type + '">* <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> ' + _format(args) + '</td>';
			}
			break;
		case 'MODE':
			if (data.text == '+a ') {
				return;
			}	else if (data.nick == '') {
				output += '<td class="log ' + data.type + '">irc.irchighway.net sets mode: ' + data.text + '</td>';
			} else {
				output += '<td class="log ' + data.type + '"><span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> sets mode: ' + data.text + '</td>';
			}
			break;
		case 'JOIN':
			output += '<td class="log ' + data.type + '">* Joins: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ')</td>';
			break;
		case 'KICK':
			var args = data.text.split(' ');
			var target = args[0];
			if (args[1] == '') {
				output += '<td class="log ' + data.type + '">* <span class="nick" onclick="userInfo(\'' + target + '\')">' + target + '</span> was kicked by <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span></td>';
			} else {
				args = args.splice(1,1).join(' ');
				output += '<td class="log ' + data.type + '">* <span class="nick" onclick="userInfo(\'' + target + '\')">' + target + '</span> was kicked by <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + args + ')</td>';
			}
			break;
		case 'NICK':
			output += '<td class="log ' + data.type + '">* <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> is now known as <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.text + '</span></td>';
			break;
		case 'PART':
			if (data.text == '')
				output += '<td class="log ' + data.type + '">* Parts: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ')</td>';
			else
				output += '<td class="log ' + data.type + '">* Parts: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ') (' + _format(data.text) + ')</td>';
			break;
		case 'QUIT':
			if (data.text == '')
				output += '<td class="log ' + data.type + '">* Quits: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ')</td>';
			else
				output += '<td class="log ' + data.type + '">* Quits: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ') (' + _format(data.text) + ')</td>';
			break;
		case 'TOPIC':
			if (data.nick !== '*') {
				output += '<td class="log ' + data.type + '">* <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> changes topic to \'' + _format(data.text) + '\'</td>';
			}
			break;
		case 'SPLIT':
			output += '<td class="log ' + data.type + '">* Quits: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ') (*.net *.split)</td>';
			break;
		case 'REJOIN':
			output += '<td class="log ' + data.type + '">* Joins: <span class="nick" onclick="userInfo(\'' + data.nick + '\')">' + data.nick + '</span> (' + data.host + ')</td>';
			break;
		default:
			return;
	}
	output += '</tr>';
	return output;
}
