HTML5 IRC Channel Logs
======================

This allows users to provide their own view-able channel logs online. While attempting to be simplistic,
it also adds new features such as streaming channel activity and providing user information compared to
other conventional IRC 2 HTML log converters out there.

Software
========

Requirements
------------
Server with Apache/Nginx + PHP
MySQL Database

Installation
------------
1. Copy everything to a public server directory.
2. Create a MySQL database with the schema provided.
3. Begin logging your channel activity to the MySQL database.
4. Edit 'config.php' with your MySQL database information.
5. Manually edit 'index.html' to add in channels monitored/logged.
6. Enjoy.

Disclaimer
----------
There are currently a few limitations with this code because of the source code itself. Furthermore, many
parts of the code is messy, requires rewrites, and hardcoded.

Database Schema
---------------
This can be found in the /install/database/ directory.

IRC Logger
----------
Any available public source code to allow logging of channels will be added to the /install/loggers/ directory.
The structure is explained in a file under the same directory.
