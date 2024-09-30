# ************************************************************
# Sequel Pro SQL dump
# Version 5446
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.33)
# Database: alliance
# Generation Time: 2024-08-14 07:14:31 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table email
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email`;

CREATE TABLE `email` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `memo` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_attachment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_attachment`;

CREATE TABLE `email_attachment` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `filename` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `file` longblob NOT NULL,
  `content_type` varchar(128) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `filesize` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_config`;

CREATE TABLE `email_config` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `sender` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL COMMENT '1: Email 2: Telgram 3: Line',
  `setting` text COLLATE utf8mb4_general_ci,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `memo` varchar(512) COLLATE utf8mb4_general_ci DEFAULT 'Success',
  `max_transaction` bigint(11) NOT NULL DEFAULT '100',
  `encrypt_setting` mediumblob NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_info`;

CREATE TABLE `email_info` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `gender` tinyint(4) NOT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `picture` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`email_id`),
  KEY `email_info_01` (`user_id`,`email_id`) USING BTREE,
  KEY `email_info_02` (`user_id`) USING BTREE,
  KEY `email_info_03` (`modify_time`) USING BTREE,
  KEY `email_info_04` (`user_id`,`modify_time`) USING BTREE,
  KEY `email_info_05` (`email_id`) USING BTREE,
  CONSTRAINT `email_info_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `email_info_ibfk_2` FOREIGN KEY (`email_id`) REFERENCES `email` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marekting_schedule
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marekting_schedule`;

CREATE TABLE `email_marekting_schedule` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL,
  `cron` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `source` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `max_number` int(11) NOT NULL DEFAULT '100',
  `status` tinyint(4) NOT NULL COMMENT '0: 初始 1. 完成執行 2. 正在執行 3. 等待執行 4. 異常 5. 取消',
  `memo` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_marketing_id` (`email_marketing_id`),
  KEY `email_marekting_schedule_01` (`status`) USING BTREE,
  KEY `email_marekting_schedule_02` (`email_marketing_id`,`status`) USING BTREE,
  KEY `email_marekting_schedule_03` (`email_marketing_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marekting_schedule_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marekting_schedule_history`;

CREATE TABLE `email_marekting_schedule_history` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL,
  `memo` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email_marekting_schedule_02` (`email_marketing_id`,`status`) USING BTREE,
  KEY `email_marekting_schedule_history_01` (`status`) USING BTREE,
  KEY `email_marekting_schedule_history_03` (`email_marketing_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing`;

CREATE TABLE `email_marketing` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `subject` blob NOT NULL,
  `content` mediumblob,
  `blog` mediumblob,
  `status` tinyint(4) DEFAULT '0' COMMENT '1: 已發送完成 2: 郵件寄送中 4: 發生異常',
  `memo` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1: Normal 2: API',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing_attachment
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing_attachment`;

CREATE TABLE `email_marketing_attachment` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT '',
  `attachment_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `isdelete` tinyint(4) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing_dashboard
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing_dashboard`;

CREATE TABLE `email_marketing_dashboard` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `param` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `score` double NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_marketing_id` (`email_marketing_id`,`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing_group`;

CREATE TABLE `email_marketing_group` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `protocol_group_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_mareting_id` (`email_marketing_id`),
  UNIQUE KEY `email_marketing_id` (`email_marketing_id`),
  KEY `email_marketing_group_01` (`email_marketing_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing_group_email
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing_group_email`;

CREATE TABLE `email_marketing_group_email` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_upload_group_email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_marketing_id` (`email_marketing_id`,`user_upload_group_email_id`),
  KEY `email_marketing_group_email_01` (`user_upload_group_email_id`) USING BTREE,
  KEY `email_marketing_group_email_02` (`email_marketing_id`) USING BTREE,
  KEY `email_marketing_group_email_03` (`email_marketing_id`,`user_upload_group_email_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing_link
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing_link`;

CREATE TABLE `email_marketing_link` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `title` varchar(1024) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `link` varchar(1024) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email_marketing_link_01` (`email_marketing_id`) USING BTREE,
  KEY `email_marketing_link_02` (`user_id`) USING BTREE,
  CONSTRAINT `email_marketing_link_ibfk_1` FOREIGN KEY (`email_marketing_id`) REFERENCES `email_marketing` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_marketing_tag
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_marketing_tag`;

CREATE TABLE `email_marketing_tag` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_marketing_id` (`email_marketing_id`,`title`),
  KEY `email_marketing_tag_01` (`email_marketing_id`) USING BTREE,
  KEY `email_marketing_tag_02` (`user_id`,`email_marketing_id`) USING BTREE,
  KEY `email_marketing_tag_03` (`user_id`) USING BTREE,
  CONSTRAINT `email_marketing_tag_ibfk_1` FOREIGN KEY (`email_marketing_id`) REFERENCES `email_marketing` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_sent_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_sent_history`;

CREATE TABLE `email_sent_history` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `marketing_receiver_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_config_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `expense` bigint(20) NOT NULL DEFAULT '0',
  `status` int(10) NOT NULL DEFAULT '0',
  `message` text COLLATE utf8mb4_general_ci,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email_sent_history_01` (`email_config_id`,`created_time`) USING BTREE,
  KEY `email_sent_history_02` (`created_time`) USING BTREE,
  KEY `email_sent_history_03` (`email_config_id`) USING BTREE,
  KEY `email_sent_history_04` (`email_marketing_id`) USING BTREE,
  KEY `email_sent_history_05` (`email_marketing_id`,`status`) USING BTREE,
  KEY `email_sent_history_06` (`email_marketing_id`,`email_id`,`status`) USING BTREE,
  KEY `email_sent_history_07` (`email_marketing_id`,`email_id`) USING BTREE,
  KEY `email_sent_history_08` (`email_config_id`,`created_time`,`status`) USING BTREE,
  CONSTRAINT `email_sent_history_ibfk_4` FOREIGN KEY (`email_marketing_id`) REFERENCES `email_marketing` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_template
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_template`;

CREATE TABLE `email_template` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_template_class_id` int(11) NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `content` mediumblob NOT NULL,
  `demo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `isdelete` tinyint(4) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table email_template_class
# ------------------------------------------------------------

DROP TABLE IF EXISTS `email_template_class`;

CREATE TABLE `email_template_class` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table error
# ------------------------------------------------------------

DROP TABLE IF EXISTS `error`;

CREATE TABLE `error` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `locale` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'en_US',
  `code` int(11) NOT NULL,
  `description` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`locale`),
  UNIQUE KEY `code` (`code`,`locale`),
  KEY `error_01` (`name`) USING BTREE,
  KEY `error_02` (`name`,`locale`) USING BTREE,
  KEY `error_03` (`code`,`locale`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table event
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event`;

CREATE TABLE `event` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `calendar` date NOT NULL,
  `lunar` date DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT '1',
  `country` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table event_calendar
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event_calendar`;

CREATE TABLE `event_calendar` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `calendar` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table event_locale
# ------------------------------------------------------------

DROP TABLE IF EXISTS `event_locale`;

CREATE TABLE `event_locale` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `name` varchar(29) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `locale` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table image
# ------------------------------------------------------------

DROP TABLE IF EXISTS `image`;

CREATE TABLE `image` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `protocol` tinyint(1) NOT NULL DEFAULT '0',
  `host` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `path` varchar(200) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `abspath` varchar(200) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `filesize` int(11) NOT NULL DEFAULT '0',
  `filename` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `imagetype` varchar(25) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `createtime` (`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table mail_message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `mail_message`;

CREATE TABLE `mail_message` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `email_type` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `message` varchar(256) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `solution` mediumblob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table marketing_receiver
# ------------------------------------------------------------

DROP TABLE IF EXISTS `marketing_receiver`;

CREATE TABLE `marketing_receiver` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_upload_group_email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email_config_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `expense` int(20) unsigned NOT NULL DEFAULT '0',
  `message` text COLLATE utf8mb4_general_ci,
  `type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1: Normal Send 2: 測試發信',
  `status` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `isdelete` tinyint(4) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `sender_email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sender_name` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_id` (`email_id`,`email_marketing_id`),
  KEY `marketing_receiver_01` (`email_config_id`) USING BTREE,
  KEY `marketing_receiver_02` (`email_id`) USING BTREE,
  KEY `marketing_receiver_03` (`email_marketing_id`,`isdelete`) USING BTREE,
  KEY `email_marketing_id` (`email_marketing_id`),
  KEY `marketing_receiver_04` (`email_marketing_id`,`status`) USING BTREE,
  KEY `marketing_receiver_05` (`email_marketing_id`,`type`,`status`,`isdelete`) USING BTREE,
  CONSTRAINT `marketing_receiver_ibfk_2` FOREIGN KEY (`email_id`) REFERENCES `email` (`id`),
  CONSTRAINT `marketing_receiver_ibfk_3` FOREIGN KEY (`email_config_id`) REFERENCES `email_config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table marketing_receiver_click
# ------------------------------------------------------------

DROP TABLE IF EXISTS `marketing_receiver_click`;

CREATE TABLE `marketing_receiver_click` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email_marketing_link_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_upload_group_email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `marketing_receiver_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `client_ip` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_agent` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `device` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `os` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `browser` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `os_ver` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `browser_ver` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `marketing_receiver_click_01` (`user_id`) USING BTREE,
  KEY `marketing_receiver_click_02` (`email_marketing_id`) USING BTREE,
  KEY `marketing_receiver_click_03` (`email_marketing_link_id`) USING BTREE,
  KEY `marketing_receiver_id` (`marketing_receiver_id`),
  CONSTRAINT `marketing_receiver_click_ibfk_1` FOREIGN KEY (`marketing_receiver_id`) REFERENCES `marketing_receiver` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table marketing_receiver_open
# ------------------------------------------------------------

DROP TABLE IF EXISTS `marketing_receiver_open`;

CREATE TABLE `marketing_receiver_open` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_upload_group_email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `marketing_receiver_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `client_ip` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_agent` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `device` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `os` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `browser` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `os_ver` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `browser_ver` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `marketing_receiver_id` (`marketing_receiver_id`),
  CONSTRAINT `marketing_receiver_open_ibfk_1` FOREIGN KEY (`marketing_receiver_id`) REFERENCES `marketing_receiver` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table message
# ------------------------------------------------------------

DROP TABLE IF EXISTS `message`;

CREATE TABLE `message` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `oauth_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci,
  `status` tinyint(1) NOT NULL COMMENT '1: success 2: fail',
  `memo` varchar(512) COLLATE utf8mb4_general_ci NOT NULL,
  `expense_time` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `message_01` (`modified_time`) USING BTREE,
  KEY `message_02` (`created_time`) USING BTREE,
  KEY `message_03` (`oauth_id`,`created_time`) USING BTREE,
  KEY `message_04` (`oauth_id`,`modified_time`) USING BTREE,
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`oauth_id`) REFERENCES `oauth` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table message_sent_history
# ------------------------------------------------------------

DROP TABLE IF EXISTS `message_sent_history`;

CREATE TABLE `message_sent_history` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `protocol_type` tinyint(4) NOT NULL COMMENT '1: email 2: telegrame 3: line',
  `config_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `reference_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'telegram_chatroom ID / email_marketing ',
  `message_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT 'message ID / email_sent_history ID',
  `status` int(11) NOT NULL COMMENT '1: success 2: fail',
  `memo` text COLLATE utf8mb4_general_ci NOT NULL,
  `expense` bigint(20) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `message_sent_history_02` (`created_time`) USING BTREE,
  KEY `message_sent_history_03` (`reference_id`,`created_time`) USING BTREE,
  KEY `message_sent_history_04` (`reference_id`) USING BTREE,
  KEY `message_sent_history_01` (`config_id`) USING BTREE,
  KEY `message_sent_history_05` (`config_id`,`protocol_type`) USING BTREE,
  KEY `message_sent_history_06` (`config_id`,`protocol_type`,`status`) USING BTREE,
  KEY `message_sent_history_07` (`user_id`) USING BTREE,
  KEY `message_sent_history_08` (`user_id`,`created_time`) USING BTREE,
  KEY `message_sent_history_09` (`user_id`,`config_id`,`created_time`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table multiprotocol
# ------------------------------------------------------------

DROP TABLE IF EXISTS `multiprotocol`;

CREATE TABLE `multiprotocol` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `memo` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table oauth
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oauth`;

CREATE TABLE `oauth` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `auth_key` varchar(450) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `expired_time` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table oauth_ip
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oauth_ip`;

CREATE TABLE `oauth_ip` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `oauth_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `address` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_id` (`oauth_id`,`address`),
  KEY `oauth_ip_01` (`address`) USING BTREE,
  KEY `oauth_ip_02` (`oauth_id`) USING BTREE,
  CONSTRAINT `oauth_ip_ibfk_1` FOREIGN KEY (`oauth_id`) REFERENCES `oauth` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table oauth_multi_protocol
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oauth_multi_protocol`;

CREATE TABLE `oauth_multi_protocol` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `multiprotocol_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `oauth_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `oauth_id` (`oauth_id`),
  KEY `multiprotocol_id` (`multiprotocol_id`),
  CONSTRAINT `oauth_multi_protocol_ibfk_1` FOREIGN KEY (`oauth_id`) REFERENCES `oauth` (`id`),
  CONSTRAINT `oauth_multi_protocol_ibfk_2` FOREIGN KEY (`multiprotocol_id`) REFERENCES `multiprotocol` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table oauth_protocol_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `oauth_protocol_group`;

CREATE TABLE `oauth_protocol_group` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `protocol_group_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `oauth_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `protocol_group_id` (`protocol_group_id`,`oauth_id`),
  UNIQUE KEY `protocol_group_id_2` (`protocol_group_id`),
  CONSTRAINT `oauth_protocol_group_ibfk_1` FOREIGN KEY (`protocol_group_id`) REFERENCES `protocol_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table param
# ------------------------------------------------------------

DROP TABLE IF EXISTS `param`;

CREATE TABLE `param` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `content` text COLLATE utf8mb4_general_ci,
  `status` tinyint(2) NOT NULL,
  `type` tinyint(2) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `param_01` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table protocol_config_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `protocol_config_group`;

CREATE TABLE `protocol_config_group` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `protocol_group_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_email_config_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `sort` tinyint(4) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `protocol_group_id` (`protocol_group_id`,`user_email_config_id`),
  KEY `protocol_config_group_01` (`user_email_config_id`) USING BTREE,
  KEY `protocol_config_group_02` (`protocol_group_id`) USING BTREE,
  KEY `protocol_config_group_03` (`protocol_group_id`,`user_email_config_id`) USING BTREE,
  CONSTRAINT `protocol_config_group_ibfk_1` FOREIGN KEY (`user_email_config_id`) REFERENCES `user_email_config` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table protocol_group
# ------------------------------------------------------------

DROP TABLE IF EXISTS `protocol_group`;

CREATE TABLE `protocol_group` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `user_oauth_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `group_name` varchar(32) COLLATE utf8mb4_general_ci DEFAULT '',
  `sender` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `isdelete` tinyint(4) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table receiver_group_event
# ------------------------------------------------------------

DROP TABLE IF EXISTS `receiver_group_event`;

CREATE TABLE `receiver_group_event` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `protocol_group_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_upload_group_email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `title` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `event_id` int(11) NOT NULL,
  `user_template_catalogue_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_template_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `timer` varchar(12) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '08:00:000',
  `offset` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`user_upload_group_email_id`,`event_id`),
  KEY `protocol_group_id` (`protocol_group_id`),
  KEY `user_upload_group_email_id` (`user_upload_group_email_id`),
  KEY `user_template_catalogue_id` (`user_template_catalogue_id`),
  CONSTRAINT `receiver_group_event_ibfk_1` FOREIGN KEY (`protocol_group_id`) REFERENCES `protocol_group` (`id`),
  CONSTRAINT `receiver_group_event_ibfk_2` FOREIGN KEY (`user_upload_group_email_id`) REFERENCES `user_upload_group_email` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table telegram_chatroom
# ------------------------------------------------------------

DROP TABLE IF EXISTS `telegram_chatroom`;

CREATE TABLE `telegram_chatroom` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `chat_id` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `chat_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '1: private 2: group',
  `protocol` tinyint(4) DEFAULT '0' COMMENT '1: Telegram 2: Line',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `name` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `chat_id` (`chat_id`),
  KEY `user_id` (`user_id`),
  KEY `telegram_chatroom_01` (`chat_id`) USING BTREE,
  CONSTRAINT `telegram_chatroom_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table testing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `testing`;

CREATE TABLE `testing` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `gender` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL COMMENT '1: Google',
  `status` tinyint(1) NOT NULL,
  `secret_code` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `level` tinyint(4) NOT NULL DEFAULT '1',
  `public_key` mediumblob,
  `secret_key` mediumblob,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_id` (`email_id`),
  KEY `user_01` (`email_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_asset
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_asset`;

CREATE TABLE `user_asset` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `field` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`field`),
  KEY `user_asset_01` (`user_id`,`field`) USING BTREE,
  KEY `user_asset_02` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_asset_freeze
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_asset_freeze`;

CREATE TABLE `user_asset_freeze` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `field` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`field`),
  KEY `user_asset_freeze_01` (`user_id`,`field`) USING BTREE,
  KEY `user_asset_freeze_02` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_bank
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_bank`;

CREATE TABLE `user_bank` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `firstname` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `lastname` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `bankno` varchar(3) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `branchno` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `card5no` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '銀行卡後5碼',
  `vid` varchar(10) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '身份證',
  `mobile` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`bankno`,`branchno`,`card5no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_company_tax
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_company_tax`;

CREATE TABLE `user_company_tax` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `companyno` varchar(10) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `address` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `companyno` (`companyno`,`address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_dashboard
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_dashboard`;

CREATE TABLE `user_dashboard` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `field` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `times` int(11) NOT NULL DEFAULT '3000',
  `transaction` double NOT NULL DEFAULT '0',
  `created_time` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`field`,`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_email_config
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email_config`;

CREATE TABLE `user_email_config` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email_config_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`email_config_id`),
  KEY `user_email_config_01` (`user_id`) USING BTREE,
  KEY `user_email_config_02` (`email_config_id`) USING BTREE,
  CONSTRAINT `user_email_config_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_email_dashboard
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email_dashboard`;

CREATE TABLE `user_email_dashboard` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `config_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `field` varchar(15) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `times` bigint(20) NOT NULL,
  `created_time` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`config_id`,`field`,`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_email_group_radio
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email_group_radio`;

CREATE TABLE `user_email_group_radio` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL DEFAULT '',
  `group_id` varchar(32) NOT NULL DEFAULT '',
  `email_type` varchar(30) NOT NULL DEFAULT '',
  `number` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`group_id`,`email_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table user_email_marketing
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email_marketing`;

CREATE TABLE `user_email_marketing` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email_marketing_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `isdelete` tinyint(4) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_email_marketing_01` (`user_id`,`status`,`isdelete`) USING BTREE,
  KEY `user_email_marketing_02` (`email_marketing_id`) USING BTREE,
  CONSTRAINT `user_email_marketing_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_email_radio
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email_radio`;

CREATE TABLE `user_email_radio` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(32) NOT NULL DEFAULT '',
  `email_type` varchar(30) NOT NULL DEFAULT '',
  `number` int(11) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`email_type`),
  KEY `user_email_radio_01` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# Dump of table user_email_tag
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_email_tag`;

CREATE TABLE `user_email_tag` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_info_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `name` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `valuable` tinyint(4) NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '1',
  `isdelete` tinyint(4) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`email_info_id`,`name`),
  KEY `user_email_tag_01` (`user_id`,`email_info_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_image
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_image`;

CREATE TABLE `user_image` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `image_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `isdelete` tinyint(1) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `modify_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_key
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_key`;

CREATE TABLE `user_key` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL DEFAULT '1',
  `public_key` blob NOT NULL,
  `secret_key` blob NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_level_sendable
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_level_sendable`;

CREATE TABLE `user_level_sendable` (
  `id` tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
  `level` tinyint(4) NOT NULL,
  `number` int(11) NOT NULL,
  `config` tinyint(4) NOT NULL,
  `group` tinyint(4) NOT NULL,
  `max_mail_thread` tinyint(11) NOT NULL DEFAULT '5',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_oauth
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_oauth`;

CREATE TABLE `user_oauth` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `oauth_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL DEFAULT '2' COMMENT '1: subscribe',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_oauth_01` (`user_id`) USING BTREE,
  KEY `user_oauth_02` (`oauth_id`) USING BTREE,
  KEY `user_oauth_03` (`user_id`,`oauth_id`) USING BTREE,
  CONSTRAINT `user_oauth_ibfk_1` FOREIGN KEY (`oauth_id`) REFERENCES `oauth` (`id`),
  CONSTRAINT `user_oauth_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_order
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_order`;

CREATE TABLE `user_order` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `bank_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `company_tax_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `order_no` bigint(20) NOT NULL AUTO_INCREMENT,
  `type` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1: System Free',
  `price` double NOT NULL DEFAULT '0',
  `number` double NOT NULL DEFAULT '0',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0: Intital 1: Pass 4: Fail',
  `memo` varchar(256) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `order_no` (`order_no`),
  CONSTRAINT `user_order_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_template
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_template`;

CREATE TABLE `user_template` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `image_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `title` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1: Normal 2: Robot',
  `content` mediumblob NOT NULL,
  `status` tinyint(2) NOT NULL DEFAULT '1',
  `isdelete` tinyint(2) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_template_catalogue
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_template_catalogue`;

CREATE TABLE `user_template_catalogue` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `name` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `status` tinyint(2) NOT NULL DEFAULT '1',
  `isdelete` tinyint(2) NOT NULL DEFAULT '0',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modified_time` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_template_catalogue_book
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_template_catalogue_book`;

CREATE TABLE `user_template_catalogue_book` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_template_catalogue_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_template_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_template_tag
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_template_tag`;

CREATE TABLE `user_template_tag` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_template_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `name` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_trade
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_trade`;

CREATE TABLE `user_trade` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `order_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(2) NOT NULL DEFAULT '0',
  `status` tinyint(2) NOT NULL DEFAULT '1',
  `price` double NOT NULL,
  `number` double NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_transfer_bank
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_transfer_bank`;

CREATE TABLE `user_transfer_bank` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `bankdno` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `branchno` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `cardno` varchar(16) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_upload_group_email
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_upload_group_email`;

CREATE TABLE `user_upload_group_email` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `user_oauth_id` varchar(32) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type` varchar(5) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'UE',
  `name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `title` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `updated_number` int(11) NOT NULL DEFAULT '0',
  `description` blob,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1: 啟用 0: 關閉',
  `share` tinyint(4) NOT NULL DEFAULT '0',
  `isenable` tinyint(4) NOT NULL DEFAULT '0',
  `isdelete` tinyint(2) NOT NULL DEFAULT '0',
  `memo` varchar(512) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `modify_time` timestamp NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `name` (`name`,`isdelete`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_upload_group_email_info
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_upload_group_email_info`;

CREATE TABLE `user_upload_group_email_info` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_upload_group_email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_info_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` tinyint(2) NOT NULL DEFAULT '1' COMMENT '0 退出訂閱',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_upload_group_email_id` (`user_upload_group_email_id`,`email_id`),
  KEY `user_upload_group_email_info_01` (`email_id`) USING BTREE,
  KEY `user_upload_group_email_info_02` (`user_upload_group_email_id`,`email_id`) USING BTREE,
  KEY `user_upload_group_email_info_1` (`user_upload_group_email_id`) USING BTREE,
  KEY `user_upload_group_email_info_2` (`user_upload_group_email_id`,`status`) USING BTREE,
  CONSTRAINT `user_upload_group_email_info_ibfk_1` FOREIGN KEY (`email_id`) REFERENCES `email` (`id`),
  CONSTRAINT `user_upload_group_email_info_ibfk_2` FOREIGN KEY (`user_upload_group_email_id`) REFERENCES `user_upload_group_email` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table user_upload_receiver_status
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user_upload_receiver_status`;

CREATE TABLE `user_upload_receiver_status` (
  `id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `user_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `email_info_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `marketing_receiver_id` varchar(32) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `type` tinyint(4) NOT NULL DEFAULT '1',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `reason` varchar(512) COLLATE utf8mb4_general_ci DEFAULT '',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`email_info_id`,`marketing_receiver_id`,`type`),
  KEY `user_upload_receiver_status_01` (`type`,`status`) USING BTREE,
  KEY `user_upload_receiver_status_02` (`email_info_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table web_menu
# ------------------------------------------------------------

DROP TABLE IF EXISTS `web_menu`;

CREATE TABLE `web_menu` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `link` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `parent` int(11) unsigned NOT NULL DEFAULT '0',
  `sort` tinyint(3) unsigned NOT NULL,
  `icon` varchar(1024) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



# Dump of table web_menu_level
# ------------------------------------------------------------

DROP TABLE IF EXISTS `web_menu_level`;

CREATE TABLE `web_menu_level` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `web_menu_id` int(10) unsigned NOT NULL,
  `level` tinyint(3) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;




INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('SUCCESS','en_US',0,'SUCCESS'),
   ('TOKEN_EXPIRED','en_US',100,'Token expired'),
   ('SMTP_UNSETTING','en_US',101,'SMTP is not setting'),
   ('USER_ILLEGAL','en_US',102,'User is illegal'),
   ('SMTP_UNPASS','en_US',104,'Sender''s setting found error'),
   ('MAX_SEND_NUMBER_INFF','en_US',103,'Email is over max available number'),
   ('OAUTH_PRIVIAGE_FAIL','en_US',108,'Key''s priviage is illegal'),
   ('DUPLICATE_AUTHKEY','en_US',105,'Auth''s Key is generated'),
   ('DUPLICATE_AUTHADDRESS','en_US',106,'Auth''s Address is duplicated'),
   ('USER_PRIVIAGE_FAIL','en_US',107,'User''s priviage is illegal');
INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('ILLEGAL_ARGUMENT','en_US',225,'Illegal Argument Error'),
   ('ILLEGAL_MAIL_MARKETING_ID','en_US',226,'Email Marketing Id is illegal'),
   ('SENDING_MAIL_MARKETING_ID','en_US',227,'Preparing to send'),
   ('HANDING_RECEIVER_MAIL_MARKETIN','en_US',228,'Preparing to send'),
   ('EMAIL_MARKTING_FINISHED_SEND','en_US',229,'Email marketing was sent'),
   ('EMAIL_MARKTING_SCHEDULING','en_US',230,'Email marketing is scheduling'),
   ('OVER_NUM_MARKETING_ATTACHMENT','en_US',231,'Attachment is over limit number'),
   ('OVER_FILE_SIZE_MARKETING_ATTAC','en_US',232,'Attachment is over total limit size'),
   ('OVER_CONFIG_LIMIT','en_US',233,'Config is over limit'),
   ('EMAIL_MARKTING_SCHEDULING_FAIL','en_US',234,'Schedule is fail to setting');
INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('USER_UNAVALABLE_NUMBER','en_US',235,'Unavailable email number'),
   ('USER_SENDER_UNSETTING','en_US',236,'Sender is not setting'),
   ('MAIL_SENT_ALL','en_US',208,'All mails were sent successfully'),
   ('ASSETS_INSUFFICIENT','en_US',237,'Asset is insufficient'),
   ('USER_DUPLICIATED','en_US',238,'User Email is duplicated'),
   ('PROTOCOL_NOT_DEFINED','en_US',239,'Email Sender is not defined'),
   ('DATA_DUPLICATE','en_US',240,'Data is Duplicated'),
   ('RECEIVER_EMPTY','en_US',209,'Email Receiver is not upload'),
   ('FAIL_QUEUE_SEND_ERROR','en_US',997,'Fail to sent queue'),
   ('SQL_ERROR','en_US',998,'System Error');
INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('GENERAL_ERROR','en_US',999,'General Error'),
   ('SUCCESS','zh_TW',0,'成功'),
   ('TOKEN_EXPIRED','zh_TW',100,'Token 過期'),
   ('SMTP_UNSETTING','zh_TW',101,'SMTP 尚未設定'),
   ('USER_ILLEGAL','zh_TW',102,'用戶不合法'),
   ('SMTP_UNPASS','zh_TW',104,'寄件人設定異常'),
   ('MAX_SEND_NUMBER_INFF','zh_TW',103,'超出郵件可容許數量'),
   ('OAUTH_PRIVIAGE_FAIL','zh_TW',108,'使用的金鑰認證不合法'),
   ('DUPLICATE_AUTHKEY','zh_TW',105,'金鑰已產生過了'),
   ('DUPLICATE_AUTHADDRESS','zh_TW',106,'認證地址重覆');
INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('USER_PRIVIAGE_FAIL','zh_TW',107,'權限不夠，我們回首頁吧!'),
   ('ILLEGAL_ARGUMENT','zh_TW',225,'參數異常'),
   ('ILLEGAL_MAIL_MARKETING_ID','zh_TW',226,'郵件編號異常'),
   ('SENDING_MAIL_MARKETING_ID','zh_TW',227,'郵件寄出中'),
   ('HANDING_RECEIVER_MAIL_MARKETIN','zh_TW',228,'準備發送郵件'),
   ('EMAIL_MARKTING_FINISHED_SEND','zh_TW',229,'郵件發送已完成'),
   ('EMAIL_MARKTING_SCHEDULING','zh_TW',230,'郵件已進入排程'),
   ('OVER_NUM_MARKETING_ATTACHMENT','zh_TW',231,'附件超出數量了'),
   ('OVER_FILE_SIZE_MARKETING_ATTAC','zh_TW',232,'附件的檔案大小超出系統的要求了'),
   ('OVER_CONFIG_LIMIT','zh_TW',233,'寄件者數量已超出');
INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('EMAIL_MARKTING_SCHEDULING_FAIL','zh_TW',234,'排程設定失敗了'),
   ('USER_UNAVALABLE_NUMBER','zh_TW',235,'可用數量不足'),
   ('USER_SENDER_UNSETTING','zh_TW',236,'寄件人尚未設定'),
   ('MAIL_SENT_ALL','zh_TW',208,'郵件已全部寄出'),
   ('ASSETS_INSUFFICIENT','zh_TW',237,'資金不夠了，來充值吧'),
   ('USER_DUPLICIATED','zh_TW',238,'用戶已重覆'),
   ('PROTOCOL_NOT_DEFINED','zh_TW',239,'寄件人還沒定義'),
   ('DATA_DUPLICATE','zh_TW',240,'資料已經有了喔'),
   ('RECEIVER_EMPTY','zh_TW',209,'這裡沒有收件人資料'),
   ('FAIL_QUEUE_SEND_ERROR','zh_TW',997,'發生異常，送出Queue失敗了');
INSERT INTO alliance.error (name,locale,code,description) VALUES
   ('SQL_ERROR','zh_TW',998,'系統資料發生異常'),
   ('GENERAL_ERROR','zh_TW',999,'系統異常'),
   ('FILE_NOT_EXIST','en_US',650,'File is not exist'),
   ('FILE_NOT_EXIST','zh_TW',650,'檔案找不到');
INSERT INTO alliance.event_calendar (event_id,calendar) VALUES
   (2,'2022-09-09'),
   (3,'2022-06-03'),
   (8,'2022-10-10'),
   (7,'2022-09-28'),
   (6,'2022-12-25'),
   (5,'2023-01-01');
INSERT INTO alliance.event_locale (event_id,name,locale) VALUES
   (1,'生日','zh_TW'),
   (1,'Birthday','en_US'),
   (2,'中秋節','zh_TW'),
   (2,'Mid Autumn','en_US'),
   (3,'端午節','zh_TW'),
   (3,'Dragon Boat','en_US'),
   (4,'農曆新年','zh_TW'),
   (4,'Chinese New Year','en_US'),
   (5,'新年','zh_TW'),
   (5,'New Year','en_US');
INSERT INTO alliance.event_locale (event_id,name,locale) VALUES
   (6,'耶誕節','zh_TW'),
   (6,'Chrismax','en_US'),
   (7,'教師節','zh_TW'),
   (7,'Teacher Day','en_US'),
   (8,'台灣國慶日','zh_TW');
INSERT INTO alliance.param (name,content,status,`type`,created_time) VALUES
   ('revoke_email','<table class="btn btn-secondary" role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important;">
  <tbody>
    <tr>
      <td style="line-height: 24px; font-size: 14px; border-radius: 6px; margin: 0;" align="center" bgcolor="#718096">
        <a href="https://agitg.com/feedback/feedback-report/email/revoke/${id}" target="_blank" style="color: #ffffff; font-size: 14px; font-family: Helvetica, Arial, sans-serif; text-decoration: none; border-radius: 6px; line-height: 16px; display: block; font-weight: normal; white-space: nowrap; background-color: #718096; padding: 8px 12px; border: 1px solid #718096;">取消訂閱</a>
      </td>
    </tr>
  </tbody>
</table>',1,1,'2022-01-13 08:45:13'),
   ('open_mail','<br /><img width=''5px'' src=''https://agitg.com/feedback/feedback-report/email/open/agitg.png?id={{id}}'' />',1,1,'2022-01-13 08:45:13'),
   ('free_month','{
    bankId: "1",
    startTime: "yyyy-MM-01 00:00:00",
    endTime:  "yyyy-MM-dd 23:59:59",
    plusDay: -1,
    number: 1000,
    type: 99
}',1,2,'2022-02-04 07:24:54'),
   ('click_link','https://agitg.com/feedback/feedback-report/email/click/{{id}}/',1,2,'2022-02-13 07:48:33'),
   ('default_active','99',1,2,'2022-02-13 08:34:25'),
   ('agitg_email','<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-radius: 6px; border-collapse: separate !important;">
<tbody>
<tr><td align="center">
<div style="background-color:#fff;text-align:center;font-size:14px;color:#999">
    <div class="m_7262263711743907518footer-content-wrapper" style="font-size:14px;color:#999;padding:40px">
        
        <a class="m_7262263711743907518social" href="https://agitg.com" 
        style="line-height:1.4;font-size:14px;font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;display:inline-block;height:28px;width:28px;margin:0 3px;color:#999" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://easystore.us8.list-manage.com/track/click?u%3D24f52f3fd2391efbd3b31befa%26id%3D678afd5d22%26e%3D09eb54bc70&amp;source=gmail&amp;ust=1649724406289000&amp;usg=AOvVaw2cypPi9aFC_-GBh7d5WqBP">
            <img src="https://agitg.com/feedback/feedback-report/email/open/agitg.png?id=${id}" alt="Agitg" height="28" width="28" style="border:0;height:auto;outline:none;text-decoration:none;display:block;max-width:100%;font-size:14px;color:#999" class="CToWUd"></a>

        <a class="m_7262263711743907518social" href="https://www.facebook.com/Agitg-111686877810799" 
        style="line-height:1.4;font-size:14px;font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif;display:inline-block;height:28px;width:28px;margin:0 3px;color:#999" target="_blank" data-saferedirecturl="https://www.facebook.com/Agitg-111686877810799">
            <img src="https://cdn3.iconfinder.com/data/icons/free-social-icons/67/facebook_circle_color-256.png" alt="Facebook" height="28" width="28" style="border:0;height:auto;outline:none;text-decoration:none;display:block;max-width:100%;font-size:14px;color:#999" class="CToWUd"></a>
       
        <br style="font-size:14px;color:#999">
        <br style="font-size:14px;color:#999">
        © Agitg · <br style="font-size:14px;color:#999">
        
        <a style="color:#333;text-decoration:none;line-height:1.4;font-size:14px;font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Arial,sans-serif" href="https://agitg.com/feedback/feedback-report/email/revoke/${id}" target="_blank" data-saferedirecturl="https://agitg.com/feedback/feedback-report/email/revoke/${id}">取消訂閱</a>
    </div>
</div>
</td></tr>
</tbody>
</table>',1,1,'2022-03-07 03:07:35'),
   ('image_server','[{
    "host" : "http://127.0.0.1",
    "user" : "poscloud",
    "password" : "~DNlm)C]mA",
    "port" : 6222,
    "url" : "127.0.0.1:6232/poscloud",
    "path" : "/var/www/html/poscloud"

}]',1,1,'2022-06-15 08:28:15');
INSERT INTO alliance.user_level_sendable (`level`,`number`,config,`group`,max_mail_thread) VALUES
   (1,1000,3,1,3),
   (2,3000,8,3,10),
   (3,5000,10,5,15),
   (4,7000,15,10,20),
   (5,10000,20,15,25),
   (9,999999,100,20,10);
INSERT INTO alliance.web_menu (name,link,parent,sort,icon,status) VALUES
   ('郵件','mail',0,2,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-inbox align-middle mr-2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path></svg>',1),
   ('收件人','receiver',0,4,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-users align-middle mr-2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',1),
   ('寄件人','sender',0,5,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail align-middle mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',1),
   ('報表','report',0,6,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pie-chart align-middle mr-2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>',1),
   ('我的郵件','./mymail',1,1,NULL,1),
   ('收件群管理','./mymailgroup',2,1,NULL,1),
   ('我的收件人','./myuploadmail',2,2,NULL,1),
   ('寄件人設定','./mysmtp',3,1,NULL,1),
   ('寄件人群組','./mysmtpgroup',3,2,NULL,1),
   ('資料明細','./message',4,1,NULL,1);
INSERT INTO alliance.web_menu (name,link,parent,sort,icon,status) VALUES
   ('資訊','./',0,1,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sliders align-middle mr-2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>',1),
   ('設定','setting',0,8,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings align-middle mr-2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path><',0),
   ('郵件訂閱者','./setting',12,1,NULL,0),
   ('訂購','purchase',0,7,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-shopping-cart align-middle mr-2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',1),
   ('我的購買','./myorder',14,1,NULL,1),
   ('審核訂單','./checkorder',14,2,NULL,1),
   ('郵件版型','template',0,3,'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-settings align-middle mr-2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path><',0),
   ('版面','./mytemplate',17,1,NULL,0);
INSERT INTO alliance.web_menu_level (web_menu_id,`level`) VALUES
   (1,1),
   (2,1),
   (3,1),
   (4,1),
   (5,1),
   (6,1),
   (7,1),
   (8,1),
   (9,1),
   (10,1);
INSERT INTO alliance.web_menu_level (web_menu_id,`level`) VALUES
   (11,1),
   (12,1),
   (13,1),
   (14,1),
   (15,1),
   (16,9),
   (17,1),
   (18,1);

   
