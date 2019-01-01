-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 01, 2019 at 05:57 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cookmania`
--

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
CREATE TABLE IF NOT EXISTS `devices` (
  `uuid` varchar(36) NOT NULL,
  `user_id` varchar(128) CHARACTER SET latin1 NOT NULL,
  `token` text NOT NULL,
  `device_type` varchar(3) NOT NULL,
  PRIMARY KEY (`uuid`),
  KEY `user_devices` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`uuid`, `user_id`, `token`, `device_type`) VALUES
('0702AF52-2586-4D22-A46F-B9F8620C92EB', 'f_1491707600961513', 'f5yikuS2czo:APA91bHpjeqxvEjHMPnBzQPN2Vf7IesMOvmLVUqw9KwMzBEwa2ik9pQcYZyH5HSLEtaiXmZBulRe-KSkG2ioXNTt1pYjh_xk2G_Rdfw2vLW0KV67t54npS0EyzHVBetNspKvNsjcGaBw', 'ios'),
('1EE41D94-8FF3-4DFF-B317-1E1A4BAC1972', 'f_1491707600961513', 'f5yikuS2czo:APA91bHpjeqxvEjHMPnBzQPN2Vf7IesMOvmLVUqw9KwMzBEwa2ik9pQcYZyH5HSLEtaiXmZBulRe-KSkG2ioXNTt1pYjh_xk2G_Rdfw2vLW0KV67t54npS0EyzHVBetNspKvNsjcGaBw', 'ios');

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

DROP TABLE IF EXISTS `experience`;
CREATE TABLE IF NOT EXISTS `experience` (
  `user_id` varchar(128) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `rating` float NOT NULL,
  `comment` text NOT NULL,
  `image_url` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `exp_recipe` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `experience`
--

INSERT INTO `experience` (`user_id`, `recipe_id`, `rating`, `comment`, `image_url`, `date`) VALUES
('au_1541965560996N3V6L', 1, 5, 'f', 'f', '2018-11-14 19:09:53'),
('au_1541965560996N3V6L', 2, 1, 'f', 'd', '2018-11-14 19:10:21'),
('au_1541965560996N3V6L', 6, 4.5, 'f', 'f', '2018-11-14 19:10:51'),
('au_1541965560996N3V6L', 7, 3, 'd', 'd', '2018-11-14 19:11:28'),
('au_fgdfgd', 1, 5, 'f', 'f', '2018-11-14 19:09:53'),
('au_fgdfgd', 2, 2, 'd', 'd', '2018-11-14 19:10:21'),
('au_fgdfgd', 6, 4, 'd', 'd', '2018-11-14 19:10:51'),
('au_fgdfgd', 7, 2, 'd', 'd', '2018-11-14 19:11:28'),
('f_1491707600961513', 1, 3.5, 'Dfhdjfkfjd', '9bb7dd34-c0b3-4a25-a1b2-cfbc47d21e75.png', '2018-12-06 14:41:27'),
('f_1491707600961513', 2, 3.5, 'Fhjdhkkk', 'c914c935-f9fe-4fb3-94e6-033f7e627bbd.png', '2018-12-06 20:43:16'),
('f_1491707600961513', 7, 2.21111, 'Hkkdgdud', '9258f8ff-4ee1-4cd8-a535-a6a855e4ded4.png', '2018-12-13 10:40:14');

-- --------------------------------------------------------

--
-- Table structure for table `following`
--

DROP TABLE IF EXISTS `following`;
CREATE TABLE IF NOT EXISTS `following` (
  `follower_id` varchar(128) NOT NULL,
  `followed_id` varchar(128) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`,`followed_id`),
  KEY `followed_user` (`followed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `following`
--

INSERT INTO `following` (`follower_id`, `followed_id`, `date`) VALUES
('au_fgdfgd', 'au_1541965560996N3V6L', '2018-12-05 15:57:52'),
('au_fgdfgd', 'f_1491707600961513', '2018-12-05 15:57:52'),
('f_1491707600961513', 'au_1541965560996N3V6L', '2018-12-13 17:51:08'),
('f_1491707600961513', 'au_fgdfgd', '2018-12-18 02:16:14');

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
CREATE TABLE IF NOT EXISTS `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `step_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `quantity` float NOT NULL,
  `unit` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ing_step` (`step_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`id`, `step_id`, `name`, `quantity`, `unit`) VALUES
(1, 1, 'water', 2, 0),
(2, 2, 'spaghetti', 1, 1),
(13, 11, 'cheese', 1, 2),
(14, 11, 'egg', 2, 2),
(15, 12, 'egg', 2, 2),
(16, 12, 'cheese', 1, 2),
(19, 14, 'egg', 2, 2),
(20, 14, 'cheese', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `label_recipe`
--

DROP TABLE IF EXISTS `label_recipe`;
CREATE TABLE IF NOT EXISTS `label_recipe` (
  `recipe_id` int(11) NOT NULL,
  `label_id` int(11) NOT NULL,
  PRIMARY KEY (`recipe_id`,`label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `label_recipe`
--

INSERT INTO `label_recipe` (`recipe_id`, `label_id`) VALUES
(1, 0),
(1, 3),
(2, 1),
(2, 3),
(2, 5),
(6, 0),
(6, 1),
(6, 2),
(7, 0),
(7, 1),
(7, 2),
(9, 1),
(9, 2),
(9, 5),
(26, 0),
(26, 7),
(26, 9),
(26, 11);

-- --------------------------------------------------------

--
-- Table structure for table `periodic_suggestions`
--

DROP TABLE IF EXISTS `periodic_suggestions`;
CREATE TABLE IF NOT EXISTS `periodic_suggestions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `periodic_suggestions`
--

INSERT INTO `periodic_suggestions` (`id`, `label_id`, `title`) VALUES
(1, 1, 'Four Delicious Budget Friendly Recipes');

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
CREATE TABLE IF NOT EXISTS `recipe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `calories` int(11) NOT NULL,
  `servings` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `views` int(11) NOT NULL DEFAULT '0',
  `favorites` int(11) NOT NULL DEFAULT '0',
  `time` int(11) NOT NULL,
  `user_id` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`id`, `name`, `description`, `calories`, `servings`, `image_url`, `date`, `views`, `favorites`, `time`, `user_id`) VALUES
(1, 'Spaghetti', 'awesome spaghetti', 253, 4, '2.jpg', '2018-11-11 20:16:19', 156, 34, 30, 'au_1541965560996N3V6L'),
(2, 'Pizza Italienne', 'hey it\'s me mario!', 560, 1, '3.jpg', '2018-11-11 20:16:19', 75, 23, 22, 'au_1541965560996N3V6L'),
(6, 'Veggies Burger Slider', 'very yummy', 233, 1, '1.jpg', '2018-11-14 18:32:31', 392, 30, 10, 'f_1491707600961513'),
(7, 'Scrambled Peppered Eggs', 'very yummy', 233, 1, '5.jpg', '2018-11-14 18:32:48', 73, 12, 10, 'f_1491707600961513'),
(9, 'Meat and Raisins Couscous', 'very yummy', 233, 1, '6.jpg', '2018-11-14 18:33:11', 59, 18, 10, 'au_fgdfgd'),
(19, 'test', 'test', 3, 2, 'test1.jpg', '2018-12-18 00:41:44', 1, 0, 2, 'au_1541965560996N3V6L'),
(20, 'test', 'test', 3, 2, 'd1.jpg', '2018-12-18 00:59:01', 1, 0, 2, 'au_1541965560996N3V6L'),
(21, 'test', 'test', 3, 2, 'd1.jpg', '2018-12-18 00:59:13', 1, 0, 2, 'au_1541965560996N3V6L'),
(22, 'test', 'test', 3, 2, 'd6.jpg', '2018-12-18 01:33:52', 1, 0, 2, 'au_1541965560996N3V6L'),
(23, 'test', 'test', 3, 2, 'd4.jpg', '2018-12-18 14:48:06', 1, 0, 2, 'au_1541965560996N3V6L'),
(24, 'test', 'test', 3, 2, 'd5.jpg', '2018-12-18 14:48:21', 1, 0, 2, 'au_1541965560996N3V6L'),
(25, 'test', 'Yoo', 3, 2, 'd6.jpg', '2018-12-18 14:48:29', 1, 0, 2, 'au_1541965560996N3V6L'),
(26, 'Recette 10', 'dhdsjdj', 250, 10, '11eb9568-680b-451f-a953-7e9f8897136e.png', '2019-01-01 06:40:02', 0, 0, 120, 'f_1491707600961513');

-- --------------------------------------------------------

--
-- Table structure for table `step`
--

DROP TABLE IF EXISTS `step`;
CREATE TABLE IF NOT EXISTS `step` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recipe_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `time` int(11) NOT NULL,
  `image_url` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `step_recipe` (`recipe_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `step`
--

INSERT INTO `step` (`id`, `recipe_id`, `description`, `time`, `image_url`) VALUES
(1, 1, 'boil water', 10, 'boil.jpg'),
(2, 6, 'put spaghetti', 1, 'boil_spaghetti.jpg'),
(11, 6, 'break eggs', 0, ''),
(12, 7, 'break eggs', 0, 'crack_eggs.jpg'),
(14, 9, 'break eggs', 0, 'crack_eggs.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` varchar(128) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` text NOT NULL,
  `following` int(11) NOT NULL DEFAULT '0',
  `followers` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `date`, `image_url`, `following`, `followers`) VALUES
('au_1541965560996N3V6L', 'Aziz Kastali', 'kastali@gmail.om', '12345', '2018-11-11 19:46:01', 'https://scontent.ftun3-1.fna.fbcdn.net/v/t1.0-9/44259722_10212513243013399_7669647534259699712_n.jpg?_nc_cat=107&_nc_ht=scontent.ftun3-1.fna&oh=433b414b5da3722f5386a5dba0376d5f&oe=5C91E562', 28, 2),
('au_15457103218363531T', 'ff', '', 'gg', '2018-12-25 03:58:42', 'http://192.168.1.8:3000/public/images/profile/e23ea6fc-57e3-41a4-853c-22a2430a7680.png', 0, 0),
('au_15457103410913FGGP', 'ff', '', 'gg', '2018-12-25 03:59:01', '', 0, 0),
('au_15457103561825USGR', 'ff', 'SEDEEE', 'gg', '2018-12-25 03:59:16', '', 0, 0),
('au_1545711025867N279N', 'TEST', 'TES@gmail.com', '1234ffr', '2018-12-25 04:10:25', '', 0, 0),
('au_1545711322847TQ61K', 'FTEST', 'FFD@gmail.com', '12344', '2018-12-25 04:15:22', '', 0, 0),
('au_1545711462769M094J', 'ENFR', 'enfr@gmail.com', '@#$%', '2018-12-25 04:17:42', '', 0, 0),
('au_15457117156322HCG8', 'GRGR', 'grgr@gmail.com', '!@#$%%%', '2018-12-25 04:21:55', '', 0, 0),
('au_1545711970561AB5JA', 'FINAL TEST', 'final@gmail.com', '12345', '2018-12-25 04:26:10', 'http://192.168.1.8:3000/public/images/profile/c3163579-b2ec-4888-b7c2-9fbdf01b789a.png', 0, 0),
('au_fgdfgd', 'ff', 'sarah@gmail.com', 'gg', '2018-11-14 19:07:40', 'http://192.168.1.8:3000/public/images/profile/e203af8b-6e42-4887-a5c0-7201c99d54b2.png', 2, 1),
('f_1491707600961513', 'Seif Abdennadher', 'm.abdennadher.seif@gmail.com', 'placeholder password', '2018-12-05 15:49:02', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1491707600961513&height=200&width=200&ext=1546616942&hash=AeQZ-mJtBHgd_kp3', 2, 29),
('g_114634186067504128367', 'ABDENNADHER Seif', 'seif.abdennadher@esprit.tn', 'placeholder password', '2018-12-06 20:34:20', 'https://lh4.googleusercontent.com/-rs_8oANLVfI/AAAAAAAAAAI/AAAAAAAAAAA/AGDgw-jrOJAkiBZX1yvnDjysAz95UtOtbg/s200/photo.jpg', 0, 0);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `user_devices` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `exp_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exp_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `following`
--
ALTER TABLE `following`
  ADD CONSTRAINT `followed_user` FOREIGN KEY (`followed_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follower_user` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD CONSTRAINT `ing_step` FOREIGN KEY (`step_id`) REFERENCES `step` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `label_recipe`
--
ALTER TABLE `label_recipe`
  ADD CONSTRAINT `labrec_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `step`
--
ALTER TABLE `step`
  ADD CONSTRAINT `step_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
