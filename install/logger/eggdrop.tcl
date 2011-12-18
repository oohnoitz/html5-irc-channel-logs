# -----------------------------------------------------------
# Eggdrop IRC Logging Script v0.1 by TEAM SEPTiCORE
# -- Usage --------------------------------------------------
#  .chanset <channel> +logger
# -----------------------------------------------------------

# Packages / Flags
package require mysqltcl 3.0;
setudef flag logger;

# Core
namespace eval septicore {
	namespace eval logger {
		# Version
		variable version "septicore-logger-v0.1";

		# MySQL Database Information
		array set db {
			"hostname"	""
			"database"	""
			"username"	""
			"password"	""
			"logtable"	""
		};

		# Binds
		bind pubm - * log_pubm;
		bind notc - * log_notc;
		bind join - * log_join;
		bind part - * log_part;
		bind topc - * log_topc;
		bind kick - * log_kick;
		bind sign - * log_sign;
		bind nick - * log_kick;
		bind mode - * log_mode;
		bind ctcp - * log_ctcp;
		bind ctcr - * log_ctcr;
		bind splt - * log_splt;
		bind rejn - * log_rejn;

		# Core
		set logger_handle [mysql::connec -host $db(hostname) -user $db(username) -password $db(password) -db $db(database)];
		proc log_add { c n u t a } {
			if { ![channel get $c logger] } { return }

			# Initialize Variables
			global logger_handle; variable db;

			# Escape Variables
			set c [mysql::escape $logger_handle [string tolower $c]];
			set n [mysql::escape $logger_handle $n];
			set u [mysql::escape $logger_handle $u];
			set a [mysql::escape $logger_handle $a];

			# Generate Query
			set sql "INSERT INTO $db(logtable) (`unixtime`, `channel`, `nick`, `host, `type`, `text`) VALUES ([unixtime], '$c', '$n', '$u', '$t', '$a');";

			# Ping & Record Fails
			if { [mysql::state $logger_handle -numeric] == 0 || ![mysql::ping $logger_handle] } {
				if { ![catch { mysql::connec -host $db(hostname) -user $db(username) -password $db(password) -db $db(database); } logger_handle] } {
					set failed [open "septicore-logger-failed.sql" a+];
					puts $failed $sql;
					close $failed;
				}
			}

			# Exec & Record Fails
			set sqlexec [mysql::exec $logger_handle ""];
			if { $sqlexec != 1 } {
				putlog "error: septicore-logger -> unable to execute sql query on the server -> $sql";
				set failed [open "septicore-logger-failed.sql" a+];
					puts $failed $sql;
					close $failed;
			}
		}

		# Bind Procs
		proc log_pubm { n u h c t } {
			log_add $c $n $u "MESSAGE" $t;
		}

		proc log_notc { n u h t c } {
			log_add $c $n $u "NOTICE" $t;
		}

		proc log_join { n u h c t } {
			log_add $c $n $u "JOIN" "";
		}

		proc log_part { n u h c t } {
			log_add $c $n $u "PART" $t;
		}

		proc log_topc { n u h c t } {
			log_add $c $n $u "TOPIC" $t;
		}

		proc log_kick { n u h c v t } {
			log_add $c $n $u "KICK" "$v $t";
		}

		proc log_quit { n u h c t } {
			log_add $c $n $u "QUIT" $t;
		}

		proc log_nick { n u h c t } {
			log_add $c $n $u "NICK" $t;
		}

		proc log_mode { n u h c m v } {
			log_add $c $n $u "MODE" "$m $v";
		}

		proc log_ctcp { n u h c k t } {
			log_add $c $n $u "CTCP" "$k: $t";
		}

		proc log_ctcr { n u h c k t } {
			log_add $c $n $u "CTCP-REPLY" "$k: $t";
		}

		proc log_splt { n u h c } {
			log_add $c $n $u "SPLIT" "";
		}

		proc log_rejn { n u h c } {
			log_add $c $n $u "REJOIN" "";
		}
	}
}