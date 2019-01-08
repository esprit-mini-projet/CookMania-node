-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mar. 08 jan. 2019 à 22:55
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
-- Structure de la table `devices`
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
-- Déchargement des données de la table `devices`
--

INSERT INTO `devices` (`uuid`, `user_id`, `token`, `device_type`) VALUES
('009d1a9a-4732-4c38-ac2f-ca6a92cf710d', 'au_1546981529351QW2JT', 'dDXCX6by1AU:APA91bHqqwu8u2d796ZP_I2ariNUD4UEiojMhiIh9vqAgGShhGiNgk7FiX3TPmamow_12MzAzm3Ks4GvI9Xz80GdGTcOXmwiZPmhNImPhBsq3uYjrp1rUXHi_TQIu6I8Sg8iif6If3_R', 'and');

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
-- Structure de la table `following`
--

DROP TABLE IF EXISTS `following`;
CREATE TABLE IF NOT EXISTS `following` (
  `follower_id` varchar(128) NOT NULL,
  `followed_id` varchar(128) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `ingredient`
--

INSERT INTO `ingredient` (`id`, `step_id`, `name`, `quantity`, `unit`) VALUES
(21, 15, 'Banana', 2, 2),
(22, 16, 'Almond Butter', 500, 1),
(23, 16, 'Eggs', 4, 2),
(24, 17, 'Coconut oil', 430, 1),
(25, 18, 'Batter', 22, 0),
(26, 19, 'Pistachios', 150, 1),
(27, 19, 'Lenmo Juice', 200, 1),
(28, 19, 'Extra-virgin olive oil', 400, 1),
(29, 20, 'Arugula', 250, 0),
(30, 20, 'Fuyu persimmons', 2, 2),
(31, 21, 'Oil', 100, 1),
(32, 22, 'Noodles', 1000, 0),
(33, 22, 'Sour cream', 200, 1),
(34, 23, 'Ground beef', 3500, 0),
(35, 23, 'Bell peppers', 4, 1),
(36, 23, 'Tomato paste', 500, 0),
(37, 24, 'Grated Cheddar', 550, 0),
(38, 25, 'Tortellini', 600, 0),
(39, 25, 'Water', 250, 1),
(40, 26, 'Kale', 600, 1),
(41, 26, 'Garlic', 4, 2),
(42, 26, 'Parmesan', 120, 1),
(43, 27, 'Tomatoes', 4, 1),
(44, 27, 'Mozzarella', 250, 0),
(45, 28, 'Panko', 100, 0),
(46, 28, 'Pine nuts', 150, 0),
(47, 28, 'Parsely', 2, 2),
(48, 29, 'Olive oil', 50, 1),
(49, 30, 'Chicken', 500, 0),
(50, 31, 'Butter', 100, 0),
(51, 31, 'Buffalo wing sauce', 180, 1),
(52, 32, 'Vegetable oil', 50, 1),
(53, 32, 'Mozzarella', 150, 1),
(54, 33, 'Brussels sprouts', 500, 0),
(55, 33, 'Vegetable oil', 25, 1),
(56, 33, 'Salt', 20, 0),
(57, 34, 'Vinegar', 80, 1),
(58, 34, 'Sriracha', 150, 0),
(59, 35, 'Pork chops', 1500, 0),
(60, 35, 'Parsley', 1, 2),
(61, 36, 'Honey', 100, 1),
(62, 37, 'Grape Tomatoes', 300, 1),
(63, 37, 'Extra virgin oil', 200, 1),
(64, 37, 'Cloves garlic', 3, 2),
(65, 38, 'Ground pepper', 100, 0),
(66, 38, 'Fresh thyme', 500, 0),
(67, 39, 'Polenta', 260, 1),
(68, 40, 'Ground Beef', 500, 0),
(69, 40, 'Egg', 1, 2),
(70, 41, 'Onions', 2, 1),
(71, 41, 'Flour', 500, 0),
(72, 42, 'Black pepper', 2, 2),
(73, 43, 'Marinara sauce', 440, 1),
(74, 43, 'Balsamic vinegar', 200, 1),
(75, 44, 'Eggs', 2, 1),
(76, 44, 'Salt', 50, 0),
(77, 45, 'Pasta', 500, 0),
(78, 46, 'Brussel sprouts', 500, 0),
(79, 46, 'Pepper', 250, 0),
(80, 47, 'Kosher salt', 100, 0),
(86, 50, 'Flour', 250, 0),
(87, 50, 'Garlic', 2, 1),
(88, 50, 'Onion power', 200, 0),
(89, 51, 'Olive oil', 200, 1),
(90, 51, 'Zucchini', 1, 2),
(91, 52, 'Chicken', 750, 0),
(92, 53, 'Orange juice', 300, 1),
(93, 53, 'Vinegar', 100, 1),
(94, 53, 'Mustard', 25, 0),
(95, 54, 'Artichockes', 4, 1),
(96, 54, 'Chickpeas', 200, 0),
(97, 54, 'Pepperoni', 500, 0),
(98, 55, 'Lettuce', 2, 1),
(99, 55, 'Cheese', 200, 0),
(100, 55, 'Radicchio', 4, 2);

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
(27, 0),
(27, 2),
(27, 4),
(27, 6),
(27, 9),
(28, 0),
(28, 1),
(28, 2),
(28, 6),
(29, 7),
(29, 9),
(29, 10),
(29, 11),
(30, 0),
(30, 4),
(30, 7),
(30, 8),
(30, 9),
(30, 10),
(31, 7),
(31, 8),
(31, 9),
(31, 10),
(31, 11),
(32, 1),
(32, 2),
(32, 7),
(32, 8),
(32, 9),
(32, 11),
(33, 0),
(33, 2),
(33, 3),
(33, 8),
(33, 11),
(34, 0),
(34, 2),
(34, 3),
(34, 7),
(34, 9),
(35, 0),
(35, 1),
(35, 3),
(35, 9),
(35, 11),
(36, 0),
(36, 4),
(36, 7),
(36, 8),
(36, 10),
(36, 11),
(38, 0),
(38, 7),
(38, 8),
(38, 9),
(38, 10),
(38, 11),
(39, 0),
(39, 1),
(39, 2),
(39, 3),
(39, 4),
(39, 7),
(39, 8),
(39, 11);

-- --------------------------------------------------------

--
-- Structure de la table `periodic_suggestions`
--

DROP TABLE IF EXISTS `periodic_suggestions`;
CREATE TABLE IF NOT EXISTS `periodic_suggestions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `periodic_suggestions`
--

INSERT INTO `periodic_suggestions` (`id`, `label_id`, `title`) VALUES
(1, 1, 'Four Delicious Budget Friendly Recipes');

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
  `views` int(11) NOT NULL DEFAULT '0',
  `favorites` int(11) NOT NULL DEFAULT '0',
  `time` int(11) NOT NULL,
  `user_id` varchar(128) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `recipe`
--

INSERT INTO `recipe` (`id`, `name`, `description`, `calories`, `servings`, `image_url`, `date`, `views`, `favorites`, `time`, `user_id`) VALUES
(27, 'Almond Butter and Banana Pancakes', 'Pancakes made of bananas and almond butter?? Enough said. The protein here comes from the eggs, which also give these sweet, nutty pancakes a light, crepe-like texture.', 956, 10, '939ada73-1a36-4f8a-b9c9-bacdcc76b95c.png', '2019-01-08 21:31:21', 1, 0, 20, 'au_1546981529351QW2JT'),
(28, 'Arugula and Persimmon Salad with Pistachio Vinaigrette', 'For this gorgeous salad, choose persimmons that are super soft. The riper the fruit, the sweeter the flavor. High in fiber, B and C vitamins, and plenty of antioxidants, the sweet persimmons pair perfectly with the arugula’s snap and the complexity of the pistachio dressing.', 780, 10, 'bac4f209-a81b-4c29-bf94-b818a7b926c6.png', '2019-01-08 21:42:46', 1, 0, 15, 'au_1546981529351QW2JT'),
(29, 'Beef and Cheddar Casserole', 'A good recipe for the family to enjoy over dinner or lunch.', 1600, 10, '706c7e83-8001-479d-b2af-77c47f7605ee.png', '2019-01-08 21:52:23', 1, 0, 55, 'au_1546981529351QW2JT'),
(30, 'Baked Tortellini with Kale Pesto', 'A recipe for those who enjoy eating healthy and keeping fit. Nice to have on a chill evening with friends.', 642, 10, '9149e25a-95ee-43cc-ad99-ca42291164b7.png', '2019-01-08 21:59:09', 1, 0, 40, 'au_1546981529351QW2JT'),
(31, 'Buffalo Chicken Calzone', 'This recipe is tasty and very easy to make. Great to slice up for a party or for Sunday football. Serve with blue cheese dressing for dipping sauce.', 572, 10, 'ac8be8a6-e925-4dda-bf4d-0cf54b90f6ab.png', '2019-01-08 22:05:26', 1, 0, 55, 'au_1546981529351QW2JT'),
(32, 'Crispy Pork Chops with Sriracha Brussels Sprouts', 'A recipe for meat lovers. Enjoy this one with family and friends during weekends or even on a date.', 1200, 10, 'b862f56c-1278-4a4e-8e0a-2a4193f72c83.png', '2019-01-08 22:15:46', 1, 0, 40, 'au_1546981529351QW2JT'),
(33, 'Grilled Salmon and Polenta', 'Fish lovers dig this recipe. I eat every weekend with the kids to make them have a nice day.', 1430, 10, 'a9b89ef4-d3dc-45ed-9d8e-14ec39c6ad34.png', '2019-01-08 22:23:48', 1, 0, 35, 'au_1546981529351QW2JT'),
(34, 'Hamburger Steak with Onions and Gravy', 'An easy-to-make classic featuring tasty hamburger \'steaks\' smothered in gravy and onions. Traditionally served with hot white rice or potatoes, it\'s a great way to dress up a pound of ground beef and you probably have all the ingredients on hand!', 319, 10, '57e00316-4551-4c34-adf6-d0a33646dc46.png', '2019-01-08 22:27:20', 1, 0, 40, 'au_1546981529351QW2JT'),
(35, 'Lighter Chicken Parmesan', 'Nice lunch for the kids to make them grow and enjoy the healthiest life possible. I encourage you to try it :D', 542, 10, '664e06ed-71ef-48ca-9958-5f8574df3b7f.png', '2019-01-08 22:31:17', 1, 0, 16, 'au_1546981529351QW2JT'),
(36, 'Roasted Brussels Sprouts', 'This recipe is from my mother. It may sound strange, but these are really good and very easy to make. The Brussels sprouts should be brown with a bit of black on the outside when done. Any leftovers can be reheated or even just eaten cold from the fridge. I don\'t know how, but they taste sweet and salty at the same time!', 104, 10, '47136462-0c87-404e-9e82-9116f688328b.png', '2019-01-08 22:33:33', 1, 0, 60, 'au_1546981529351QW2JT'),
(38, 'Mediterranean Chicken Medley with Eggplant and Feta', 'Low-calorie, low-carb dinners can be absolutely delicious if done right! This one is full of color, flavor, and texture. I make this one often and it is always a hit! Hope you will enjoy as well.', 349, 10, 'fee30afc-7d97-48bd-b375-a3e5cf3c514b.png', '2019-01-08 22:41:52', 1, 0, 100, 'au_1546981529351QW2JT'),
(39, 'Winter Italian Chopped Salad', 'Pepperoni, marinated artichoke hearts, and canned chickpeas are roasted together to make a warm and crisp foundation for this wintry riff on an Italian chopped salad. Fresh oranges balance out the salty and savory flavors.', 560, 10, 'fb5aa1de-119f-4229-90f6-18f69312f597.png', '2019-01-08 22:49:24', 1, 0, 45, 'au_1546981529351QW2JT');

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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=latin1;

--
-- Déchargement des données de la table `step`
--

INSERT INTO `step` (`id`, `recipe_id`, `description`, `time`, `image_url`) VALUES
(15, 27, 'In a large bowl, mash the bananas until smooth. ', 0, ''),
(16, 27, 'Whisk in the almond butter, then add eggs one at a time, making sure each is thoroughly incorporated into the mixture. ', 0, ''),
(17, 27, 'Heat a large cast-iron (or ceramic skillet) over medium-high heat. When the skillet is hot enough that a drop of water splashed on it sizzles and bounces, add the coconut oil.', 2, ''),
(18, 27, 'Cook 2 to 3 minutes, or until the bottom is set, before flipping. Cook on the opposite side for an additional 2 to 3 minutes. ', 3, ''),
(19, 28, 'In a blender, puree all the vinaigrette ingredients until the mixture is smooth and well incorporated.', 0, ''),
(20, 28, 'Toss the arugula in a large bowl with the vinaigrette until the leaves are well coated. Arrange the persimmon slices on two serving plates, then top them with the dressed greens and serve.', 0, ''),
(21, 29, 'Preheat the oven to 425 degrees F. Oil a 2-quart baking dish. ', 0, ''),
(22, 29, 'Bring a large pot of salted water to a boil. Add the noodles and cook to al dente according to the package directions. Drain and put in the prepared baking dish. Toss with the sour cream, Parmesan and 1/4 teaspoon salt.', 5, ''),
(23, 29, 'Meanwhile, heat the olive oil in a large skillet over medium-high heat. Add the ground beef and cook, stirring, until no longer pink, about 4 minutes. Add the bell peppers and scallions and cook until crisp-tender, about 3 minutes. Make a space in the pan, add the tomato paste and toast for a minute. Sprinkle with the Italian seasoning and 1/4 teaspoon salt. Add the diced tomatoes, stir and bring to a simmer. Cook until slightly thickened, about 2 minutes. ', 2, ''),
(24, 29, 'Pour the beef mixture over the noodles and sprinkle with the grated Cheddar. Bake on the middle rack until the cheese is melted and the edges are bubbling, 15 to 20 minutes. Let stand for 10 minutes before serving. ', 15, ''),
(25, 30, 'Preheat the oven to 425 degrees F. Bring a large pot of salted water to a boil. Add the tortellini and cook as the label directs. Reserve ¼ cup cooking water, then drain. Reserve the pot. ', 5, ''),
(26, 30, 'Meanwhile, puree 4 cups kale, the olive oil and garlic in a blender or food processor until almost smooth. Add ¼ cup parmesan and season with salt and pepper. Pulse until smooth, adding up to 1/4 cup tap water if needed.', 0, ''),
(27, 30, 'Transfer the pesto to the reserved pot along with the heavy cream; stir to combine. Bring to a boil over medium heat, then reduce the heat to medium low; stir in the tortellini, sun-dried tomatoes and the remaining 3 cups kale, adding the reserved cooking water as needed to loosen. Transfer to a 9-by-13-inch baking dish and sprinkle with the mozzarella. ', 0, ''),
(28, 30, 'Combine the panko, pine nuts, parsley and the remaining 2 tablespoons parmesan in a small bowl; season with salt and pepper. Sprinkle over the tortellini and bake until golden brown, about 12 minutes. Let cool slightly before serving. ', 12, ''),
(29, 31, 'Preheat oven to 410 degrees F (210 degrees C). Grease a pizza pan. ', 0, ''),
(30, 31, 'Place chicken into a large pot and cover with salted water; bring to a boil. Cook the chicken breasts until no longer pink in the center and the juices run clear, about 15 minutes. An instant-read thermometer inserted into the center should read at least 165 degrees F (74 degrees C). Transfer chicken to a bowl and shred with two forks. ', 15, ''),
(31, 31, 'Melt butter in a skillet over medium-high heat. Cook and stir chicken and Buffalo wing sauce in the hot butter until chicken is coated and heated through, 2 to 4 minutes. ', 3, ''),
(32, 31, 'Turn pizza dough out onto a generously floured surface. Roll dough into a 12-inch round. Brush dough with 1 tablespoon vegetable oil and spread 1 cup mozzarella cheese in the center of the dough, leaving a 1-inch border. Spread chicken mixture over cheese; top chicken mixture with remaining 1 cup cheese. ', 0, ''),
(33, 32, 'Put a baking sheet on the middle oven rack and preheat to 450 degrees F. Toss the Brussels sprouts and red onion in a large bowl with 1 tablespoon vegetable oil, 1/2 teaspoon salt and a few grinds of pepper. Spread on the hot baking sheet in a single layer and roast, without stirring, until tender and charred in spots, 20 to 25 minutes. ', 25, ''),
(34, 32, 'Meanwhile, whisk the vinegar, honey, Sriracha and a pinch of salt in a large bowl. Set aside. ', 0, ''),
(35, 32, 'Season the pork chops with salt and pepper and brush the mustard on both sides. Toss the panko with 1 tablespoon parsley, a pinch of salt and a few grinds of pepper on a plate. Press both sides of the pork chops in the mixture to evenly coat. Heat the remaining 1 tablespoon vegetable oil in a large nonstick skillet over medium-high heat. Add the pork chops and cook until browned and cooked through, 4 to 5 minutes per side. (Reduce the heat to medium if the crust gets too dark.) ', 5, ''),
(36, 32, 'Add the roasted vegetables to the honey-Sriracha sauce and toss to coat. Serve with the pork chops. Sprinkle with the remaining 1 tablespoon parsley. ', 0, ''),
(37, 33, 'Preheat a grill to medium high. Toss the tomatoes with 1 tablespoon olive oil, the garlic, 3/4 teaspoon salt and a few grinds of pepper on a large piece of foil. Add the thyme sprigs and bring up the edges of the foil slightly. Pour in the wine and fold the edges together to form a packet; set aside. ', 3, ''),
(38, 33, 'Brush both sides of the polenta rounds with the remaining 1 tablespoon olive oil; season with salt and pepper. Season the salmon with the chopped thyme, salt and pepper.', 0, ''),
(39, 33, 'Oil the grill grates. Grill the foil packet until the tomatoes are soft, 10 to 12 minutes. Meanwhile, grill the polenta and the salmon skin-side down, 3 to 4 minutes; flip and grill until well marked and the salmon is just cooked through, 3 to 4 more minutes. ', 11, ''),
(40, 34, 'In a large bowl, mix together the ground beef, egg, bread crumbs, pepper, salt, onion powder, garlic powder, and Worcestershire sauce. Form into 8 balls, and flatten into patties. ', 0, ''),
(41, 34, 'Heat the oil in a large skillet over medium heat. Fry the patties and onion in the oil until patties are nicely browned, about 4 minutes per side. Remove the beef patties to a plate, and keep warm. ', 0, ''),
(42, 34, 'Sprinkle flour over the onions and drippings in the skillet. Stir in flour with a fork, scraping bits of beef off of the bottom as you stir. Gradually mix in the beef broth and sherry. Season with seasoned salt. Simmer and stir over medium-low heat for about 5 minutes, until the gravy thickens. Turn heat to low, return patties to the gravy, cover, and simmer for another 15 minutes.', 15, ''),
(43, 35, 'Combine the marinara sauce and balsamic vinegar in a small saucepan and bring to a boil over high heat. Reduce the heat and simmer for 5 minutes. ', 5, ''),
(44, 35, 'Meanwhile, in a shallow dish, combine the breadcrumbs, half the Parmesan, half the parsley and some salt and pepper. Put the beaten egg whites in a separate shallow dish. Coat the chicken tenders in the egg whites first, then dredge in the breadcrumb mixture. ', 0, ''),
(45, 35, 'Add the pasta to the boiling water and cook according to the package instructions. ', 8, ''),
(46, 36, 'Place trimmed Brussels sprouts, olive oil, kosher salt, and pepper in a large resealable plastic bag. Seal tightly, and shake to coat. Pour onto a baking sheet, and place on center oven rack. ', 0, ''),
(47, 36, 'Roast in the preheated oven for 30 to 45 minutes, shaking pan every 5 to 7 minutes for even browning. Reduce heat when necessary to prevent burning. Brussels sprouts should be darkest brown, almost black, when done. Adjust seasoning with kosher salt, if necessary. Serve immediately. ', 45, ''),
(50, 38, 'Combine flour, garlic powder, onion powder, paprika, salt, and black pepper in a shallow bowl. Reserve 1 tablespoon of mixture for later use. ', 0, ''),
(51, 38, 'Heat 3 tablespoons olive oil and butter in a skillet over medium-high heat. Add eggplant and onion and cook until soft and browned, 5 to 10 minutes. Season with salt and pepper; transfer to a baking dish. Cook zucchini and bell pepper in the same skillet over medium-high heat until softened, about 5 minutes. Season with salt and pepper and transfer to the baking dish with the eggplant.', 10, ''),
(52, 38, 'Add additional oil to the skillet if needed and brown chicken on both sides, about 5 minutes. Transfer chicken to the baking dish with the vegetables. Pour tomatoes into the same skillet and add reserved flour mixture and dill paste. Bring to a boil, remove from heat, and pour into the baking dish. Top with feta cheese. ', 5, ''),
(53, 39, 'Preheat oven to 450°F. Whisk orange juice, vinegar, garlic, oregano, mustard, 1/4 cup oil, and 3/4 tsp. salt in a large bowl. ', 0, ''),
(54, 39, 'Toss artichokes, pepperoni, chickpeas, and 2 Tbsp. oil on a rimmed baking sheet; season with remaining 1/2 tsp. salt. Roast, tossing halfway through, until chickpeas are deep golden brown and pepperoni is crisp, 18–20 minutes. ', 20, ''),
(55, 39, 'Add iceberg lettuce, radicchio, celery, oranges, cheese, and olives to bowl with dressing and toss to combine. Add chickpea mixture to salad and toss again to combine. Drizzle with more oil. ', 0, '');

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
('au_1546981529351QW2JT', 'elyes007', 'elyes@gmail.com', '1234', '2019-01-08 21:05:39', 'http://192.168.1.3:3000/public/images/default_profile_picture.png', 0, 0);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `user_devices` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `exp_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipe` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `exp_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

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
