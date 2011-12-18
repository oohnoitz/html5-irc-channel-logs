<?php

/**
 * JSON Output for HTML5 IRC Channel Logs
 */

require_once('config.php');

// PHP Headers
header("HTTP/1.1 200 OK");
header('Content-type: application: application/json');
header("Cache-Control: no-cache");
header("Expires: 0");
ob_start();

// MySQL Connection
mysql_connect($mysql['localhost'], $mysql['username'], $mysql['password']) or die('Error: MySQL access denied.');
mysql_select_db($mysql['database']) or die(mysql_error());

// Initialize JSON Array
$JSON = array();

if (!isset($_GET['channel'])) die();
$channel = mysql_real_escape_string('#' . $_GET['channel']);

switch ($_GET['request']) {
	case 'log':
		// Log
		$SQL = mysql_query("SELECT * FROM (SELECT * FROM `logs` WHERE `channel` = '{$channel}' ORDER BY `id` DESC LIMIT 500) AS `source` ORDER BY `id` ASC");
		while ($r = mysql_fetch_assoc($SQL)) {
			$r['timestamp'] = date('H:i:s', $r['unixtime']);
			$r['timestamp_w3c'] = date(DATE_W3C, $r['unixtime']);
			$JSON['log'][] = $r;
		}
		mysql_free_result($SQL);

		// Topic
		$SQL = mysql_query("SELECT `text` FROM `logs` WHERE `channel` = '{$channel}' AND `type` = 'TOPIC' ORDER BY `id` DESC LIMIT 1");
		$JSON['topic'] = mysql_fetch_assoc($SQL);
		mysql_free_result($SQL);

		// Users (Empty)
		$JSON['users']['text'] = '';

		break;

	case 'log-stream';
		if (!isset($_GET['lastLog'])) die();

		$lastLog = mysql_real_escape_string($_GET['lastLog']);
		$SQL = mysql_query("SELECT * FROM (SELECT * FROM `logs` WHERE `channel` = '{$channel}' AND `id` > {$lastLog} ORDER BY `id` DESC LIMIT 100) AS `source` ORDER BY `id` ASC");
		while ($r = mysql_fetch_assoc($SQL)) {
			$r['timestamp'] = date('H:i:s', $r['unixtime']);
			$r['timestamp_w3c'] = date(DATE_W3C, $r['unixtime']);
			$JSON['log'][] = $r;
		}
		mysql_free_result($SQL);

		if (count($JSON['log'])) {
			// Topic
			$SQL = mysql_query("SELECT `text` FROM `logs` WHERE `channel` = '{$channel}' AND `type` = 'TOPIC' ORDER BY `id` DESC LIMIT 1");
			$JSON['topic'] = mysql_fetch_assoc($SQL);
			mysql_free_result($SQL);

			// Users (Empty)
			$JSON['users']['text'] = '';
		}

		break;

	case 'user-info':
		if (!isset($_GET['nick'])) die();

		$nick = mysql_real_escape_string($_GET['nick']);
		$SQL = mysql_query("SELECT * FROM `logs` WHERE `nick` = '{$nick}' AND (`type` = 'JOIN' OR `type` = 'PART' OR `type` = 'QUIT' OR `type` = 'KICK' OR `type` = 'NICK' OR `type` = 'SPLIT' OR `type` = 'REJOIN') ORDER BY `id` DESC LIMIT 1");
		while ($r = mysql_fetch_assoc($SQL)) {
			$r['timestamp'] = date('H:i:s', $r['unixtime']);
			$r['timestamp_w3c'] = date(DATE_W3C, $r['unixtime']);
			unset($r['unixtime']);
			$JSON['lastseen'] = $r;
		}
		mysql_free_result($SQL);

		$SQL = mysql_query("SELECT * FROM `logs` WHERE `nick` = '{$nick}' AND `type` = 'MESSAGE' ORDER BY `id` DESC LIMIT 1");
		while ($r = mysql_fetch_assoc($SQL)) {
			$r['timestamp'] = date('H:i:s', $r['unixtime']);
			$r['timestamp_w3c'] = date(DATE_W3C, $r['unixtime']);
			$JSON['lastspoke'] = $r;
		}
		mysql_free_result($SQL);

		break;

	default:
		die();
}

print json_encode($JSON);
