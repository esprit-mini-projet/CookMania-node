-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 24, 2018 at 03:24 PM
-- Server version: 5.7.23
-- PHP Version: 7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `cookmania`
--

-- --------------------------------------------------------

--
-- Table structure for table `experience`
--

CREATE TABLE `experience` (
  `user_id` varchar(128) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `rating` float NOT NULL,
  `comment` text NOT NULL,
  `image_url` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
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
('au_fgdfgd', 7, 2, 'd', 'd', '2018-11-14 19:11:28');

-- --------------------------------------------------------

--
-- Table structure for table `following`
--

CREATE TABLE `following` (
  `follower_id` varchar(128) NOT NULL,
  `followed_id` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `ingredient`
--

CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL,
  `step_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `quantity` float NOT NULL,
  `unit` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ingredient`
--

INSERT INTO `ingredient` (`id`, `step_id`, `name`, `quantity`, `unit`) VALUES
(1, 1, 'water', 2, 0),
(2, 2, 'spaghetti', 1, 1),
(13, 11, 'cheese', 1, 3),
(14, 11, 'egg', 2, 3),
(15, 12, 'egg', 2, 3),
(16, 12, 'cheese', 1, 3),
(17, 13, 'cheese', 1, 3),
(18, 13, 'egg', 2, 3),
(19, 14, 'egg', 2, 3),
(20, 14, 'cheese', 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `label_recipe`
--

CREATE TABLE `label_recipe` (
  `recipe_id` int(11) NOT NULL,
  `label_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `label_recipe`
--

INSERT INTO `label_recipe` (`recipe_id`, `label_id`) VALUES
(1, 0),
(1, 3),
(2, 2),
(2, 3),
(2, 5),
(6, 0),
(6, 1),
(6, 2),
(7, 0),
(7, 1),
(7, 2),
(8, 1),
(8, 2),
(8, 5),
(9, 1),
(9, 2),
(9, 5);

-- --------------------------------------------------------

--
-- Table structure for table `periodic_suggestions`
--

CREATE TABLE `periodic_suggestions` (
  `id` int(11) NOT NULL,
  `label_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `periodic_suggestions`
--

INSERT INTO `periodic_suggestions` (`id`, `label_id`, `title`) VALUES
(1, 1, 'Four Delicious Budget Friendly Recipes');

-- --------------------------------------------------------

--
-- Table structure for table `recipe`
--

CREATE TABLE `recipe` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `calories` int(11) NOT NULL,
  `servings` int(11) NOT NULL,
  `image_url` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `views` int(11) NOT NULL,
  `favorites` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `user_id` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `recipe`
--

INSERT INTO `recipe` (`id`, `name`, `description`, `calories`, `servings`, `image_url`, `date`, `views`, `favorites`, `time`, `user_id`) VALUES
(1, 'Spaghetti', 'awesome spaghetti', 253, 4, '2.jpg', '2018-11-11 20:16:19', 70, 34, 30, 'au_1541965560996N3V6L'),
(2, 'Pizza Italienne', 'hey it\'s me mario!', 560, 1, '3.jpg', '2018-11-11 20:16:19', 65, 22, 22, 'au_1541965560996N3V6L'),
(6, 'Veggies Burger Slider', 'very yummy', 233, 1, '1.jpg', '2018-11-14 18:32:31', 40, 30, 10, '1'),
(7, 'Scrambled Peppered Eggs', 'very yummy', 233, 1, '5.jpg', '2018-11-14 18:32:48', 53, 12, 10, '1'),
(8, 'Omelettes', 'very yummy', 233, 1, '4.jpg', '2018-11-14 18:32:54', 89, 20, 10, '1'),
(9, 'Meat and Raisins Couscous', 'very yummy', 233, 1, '6.jpg', '2018-11-14 18:33:11', 46, 18, 10, '1');

-- --------------------------------------------------------

--
-- Table structure for table `step`
--

CREATE TABLE `step` (
  `id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `description` text NOT NULL,
  `time` int(11) NOT NULL,
  `image_url` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `step`
--

INSERT INTO `step` (`id`, `recipe_id`, `description`, `time`, `image_url`) VALUES
(1, 1, 'boil water', 10, ''),
(2, 1, 'put spaghetti', 8, ''),
(11, 6, 'break eggs', 0, 'www.haha.com'),
(12, 7, 'break eggs', 0, 'www.haha.com'),
(13, 8, 'break eggs', 0, 'www.haha.com'),
(14, 9, 'break eggs', 0, 'www.haha.com');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(128) NOT NULL,
  `username` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` text NOT NULL,
  `following` int(11) NOT NULL DEFAULT '0',
  `followers` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `date`, `image_url`, `following`, `followers`) VALUES
('au_1541965560996N3V6L', 'Seif Abdennadher', 'm.abdennadher.seif@gmail.com', '123456', '2018-11-11 19:46:01', 'test', 0, 0),
('au_fgdfgd', 'elyes', 'elyes@gmail.com', '1234', '2018-11-14 19:07:40', 'dd', 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`user_id`,`recipe_id`),
  ADD KEY `exp_recipe` (`recipe_id`);

--
-- Indexes for table `following`
--
ALTER TABLE `following`
  ADD PRIMARY KEY (`follower_id`,`followed_id`),
  ADD KEY `followed_user` (`followed_id`);

--
-- Indexes for table `ingredient`
--
ALTER TABLE `ingredient`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ing_step` (`step_id`);

--
-- Indexes for table `label_recipe`
--
ALTER TABLE `label_recipe`
  ADD PRIMARY KEY (`recipe_id`,`label_id`);

--
-- Indexes for table `periodic_suggestions`
--
ALTER TABLE `periodic_suggestions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `step`
--
ALTER TABLE `step`
  ADD PRIMARY KEY (`id`),
  ADD KEY `step_recipe` (`recipe_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ingredient`
--
ALTER TABLE `ingredient`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `periodic_suggestions`
--
ALTER TABLE `periodic_suggestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `recipe`
--
ALTER TABLE `recipe`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `step`
--
ALTER TABLE `step`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

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
