CREATE TABLE IF NOT EXISTS `logs` (
  `id` int(12) NOT NULL AUTO_INCREMENT,
  `unixtime` int(11) NOT NULL,
  `channel` varchar(40) NOT NULL,
  `nick` varchar(40) NOT NULL,
  `host` varchar(256) NOT NULL,
  `type` varchar(40) NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `unixtime` (`unixtime`),
  KEY `channel` (`channel`),
  KEY `nick` (`nick`),
  KEY `host` (`host`),
  KEY `type` (`type`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8;
