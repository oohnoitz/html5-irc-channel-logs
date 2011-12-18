MySQL Structure for Logging
===========================
The information found below will explain what should be stored in the MySQL database using your own logger or one
provided.

Structure
=========

id
--
auto-incrementing number, used for ordering as unixtime may have duplicates and causes ordering/display problems

unixtime
--------
standard unixtime for each record

channel
-------
the channel the raw input occurred on

nick
----
self-explained

host
----
contains the ident and hostmask

type
----
the type of raw input (e.g. MESSAGE, NOTICE, JOIN, PART, TOPIC, KICK, MODE, CTCP, CTCP-REPLY, SPLIT, REJOIN)

text
----
MESSAGE -> text

NOTICE -> text

JOIN -> null

PART -> text

TOPIC -> text

KICK -> victim text

MODE -> mode nick

CTCP -> command: text (the colon is required)

CTCP-REPLY -> command: text (the colon is required)

SPLIT -> null

REJOIN -> null
