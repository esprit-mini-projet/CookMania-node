-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  jeu. 15 nov. 2018 à 20:06
-- Version du serveur :  5.7.23
-- Version de PHP :  7.2.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `cookmania`
--

-- --------------------------------------------------------

--
-- Structure de la table `experience`
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

-- --------------------------------------------------------

--
-- Structure de la table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
CREATE TABLE IF NOT EXISTS `favorite` (
  `user_id` varchar(128) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `fav_recipe` (`recipe_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `following`
--

DROP TABLE IF EXISTS `following`;
CREATE TABLE IF NOT EXISTS `following` (
  `follower_id` varchar(128) NOT NULL,
  `followed_id` varchar(128) NOT NULL,
  PRIMARY KEY (`follower_id`,`followed_id`),
  KEY `followed_user` (`followed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `ingredient`
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `ingredient`
--

INSERT INTO `ingredient` (`id`, `step_id`, `name`, `quantity`, `unit`) VALUES
(1, 1, 'water', 2, 0),
(2, 2, 'spaghetti', 1, 1),
(3, 5, 'egg', 2, 3),
(4, 5, 'cheese', 1, 3),
(5, 6, 'egg', 2, 3),
(6, 6, 'cheese', 1, 3),
(9, 8, 'salt', 200, 2),
(10, 8, 'plate', 1, 0),
(11, 9, 'cheese', 1, 3),
(12, 9, 'egg', 2, 3);

-- --------------------------------------------------------

--
-- Structure de la table `label_recipe`
--

DROP TABLE IF EXISTS `label_recipe`;
CREATE TABLE IF NOT EXISTS `label_recipe` (
  `recipe_id` int(11) NOT NULL,
  `label_id` int(11) NOT NULL,
  PRIMARY KEY (`recipe_id`,`label_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `label_recipe`
--

INSERT INTO `label_recipe` (`recipe_id`, `label_id`) VALUES
(1, 0),
(1, 1),
(2, 2),
(2, 3),
(2, 5),
(3, 1),
(3, 2),
(3, 5),
(4, 1),
(4, 2),
(4, 5),
(5, 1),
(5, 2),
(5, 5);

-- --------------------------------------------------------

--
-- Structure de la table `recipe`
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
  `views` int(11) NOT NULL,
  `time` int(11) NOT NULL,
  `user_id` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `recipe`
--

INSERT INTO `recipe` (`id`, `name`, `description`, `calories`, `servings`, `image_url`, `date`, `views`, `time`, `user_id`) VALUES
(1, 'Spaghetti', 'awesome spaghetti', 253, 4, '1.jpg', '2018-11-11 20:16:19', 2, 30, 'au_1541965560996N3V6L'),
(2, 'Pizza Italienne', 'hey it\'s me mario!', 560, 1, '2.jpg', '2018-11-11 20:16:19', 65, 22, 'au_1541965560996N3V6L'),
(3, 'omelette', 'very yummy', 233, 1, '3.jpg', '2018-11-11 23:41:13', 3, 10, '1'),
(4, 'omelette', 'very yummy', 233, 1, '4.jpg', '2018-11-11 23:49:14', 3, 10, '1'),
(5, 'omelette', 'very yummy', 233, 1, '5.jpg', '2018-11-12 18:11:46', 3, 10, '1');

-- --------------------------------------------------------

--
-- Structure de la table `step`
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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `step`
--

INSERT INTO `step` (`id`, `recipe_id`, `description`, `time`, `image_url`) VALUES
(1, 1, 'boil water', 10, ''),
(2, 1, 'put spaghetti', 8, ''),
(5, 3, 'break eggs', 0, 'www.haha.com'),
(6, 4, 'break eggs', 0, 'www.haha.com'),
(8, 4, 'put in plate', 0, 'www.plate.com'),
(9, 5, 'break eggs', 0, 'www.haha.com'),
(10, 4, 'eat', 0, 'www.eat.com');

-- --------------------------------------------------------

--
-- Structure de la table `user`
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
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `date`, `image_url`, `following`, `followers`) VALUES
('au_1541965560996N3V6L', 'Seif Abdennadher', 'm.abdennadher.seif@gmail.com', '123456', '2018-11-11 19:46:01', 'test', 0, 0);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `exp_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exp_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `fav_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fav_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `following`
--
ALTER TABLE `following`
  ADD CONSTRAINT `followed_user` FOREIGN KEY (`followed_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `follower_user` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `ingredient`
--
ALTER TABLE `ingredient`
  ADD CONSTRAINT `ing_step` FOREIGN KEY (`step_id`) REFERENCES `step` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `label_recipe`
--
ALTER TABLE `label_recipe`
  ADD CONSTRAINT `labrec_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `step`
--
ALTER TABLE `step`
  ADD CONSTRAINT `step_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
