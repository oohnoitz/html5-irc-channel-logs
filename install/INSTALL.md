HTML5 IRC Channel Logs
======================


REQUIREMENTS
------------

- HTTP Web Server w/ PHP
- MySQL Server
- IRC Bot w/ MySQL Support


INSTALLATION
------------

1. Extract and upload contents to a public directory on server.
2. Create a MySQL Database with the schema provided (install/database/mysql_schema.sql).
3. Modify 'config.php' with your MySQL Database information.
4. Begin logging your channel activity with an IRC bot.
5. Enjoy.


NOTICE
------

Currently, the 'index.html' file must be modified manually each time a channel is added.
This is a feature that will be solved in a future release and contained in the 'config.php'
file. Until further notice, the following line must be added for each channel under the
<!-- List Channels --> comment.

* <li><a href="#irc-channel" data-function="view" data-channel="irc-channel">#irc-channel</a></li>

Replace all instances of 'irc-channel' with your actual channel without prefixing the hash
tag.