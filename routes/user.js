const express = require('express')
const mysql = require('mysql')
const idGenerator = require('../utils/id_generator')
const notificationUtil = require("../utils/NotificationUtil")
const notificationType = require("../models/notificationType")
const formidable = require('formidable')
const ip = require('ip')
const uuidv4 = require('uuid/v4');
var fs = require('fs');
const os = require( 'os' )

const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "cookmania",
    //port: 8889,
    //password: "root"
})

function getConnection() {
    return pool
}

//GET

router.post("/signin", (req, res) => {
    let queryString = "SELECT * FROM user WHERE email = ? AND password = ? AND SUBSTR(id, 1, 2) = 'au'";
    pool.query(queryString, [req.body.email, req.body.password], (err, rows, fields) => {
        if (!err) {
            if (rows.length != 0) {
                manageDevices(req, res, rows[0])
            } else {
                res.sendStatus(400)
            }
        } else {
            res.sendStatus(500)
        }
    })
})

//GET all users
router.get("/", (req, res) => {
    pool.query("SELECT * FROM user", (err, user_rows, fields) => {
        res.status(200)
        res.json(user_rows)
    })
})

//GET user by id
router.get("/:id", (req, res) => {
    pool.query("SELECT * FROM user WHERE id = ?", [req.params.id], (err, rows, fields) => {
        res.status(200)
        res.json(rows[0])
    })
})

//GET user followers and following
/*router.get("/following/:user_id", (req, res) => {
    pool.query("SELECT u.* FROM following f JOIN user u ON f.followed_id = u.id WHERE follower_id = ?", [req.params.user_id], (err, following_rows, fie) => {
        res.status(200)
        res.json(following_rows)
    })
})*/

//GET user followers
router.get("/followers/:user_id", (req, res) => {
    pool.query("SELECT * FROM following WHERE followed_id = ?", [req.params.user_id], (er, followings, fields) => {
        const promises = []
        for (var i = 0; i < followings.length; i++) {
            const following = followings[i]
            promises.push(new Promise((resolve, reject) => {
                pool.query("SELECT * FROM user WHERE id = ?", [following.follower_id], (err, followers, fields) => {
                    pool.query("SELECT * FROM user WHERE id = ?", [following.followed_id], (e, followeds, fields) => {
                        if (err || e) {
                            console.log(err);
                            res.sendStatus(500)
                            reject(err)
                        }
                        if (followers.length != 0) {
                            following.follower = followers[0]
                        } else {
                            following.follower = null
                        }

                        if (followeds.length != 0) {
                            following.following = followeds[0]
                        } else {
                            following.following = null
                        }
                        resolve("Ok")
                    })
                })
            }))
        }

        Promise.all(promises).then(() => {
            res.status(200)
            res.json(followings)
        })
    })
})

//GET user following
router.get("/following/:user_id", (req, res) => {
    pool.query("SELECT * FROM following WHERE follower_id = ?", [req.params.user_id], (er, followings, fields) => {
        const promises = []
        for (var i = 0; i < followings.length; i++) {
            const following = followings[i]
            promises.push(new Promise((resolve, reject) => {
                pool.query("SELECT * FROM user WHERE id = ?", [following.follower_id], (err, followers, fields) => {
                    pool.query("SELECT * FROM user WHERE id = ?", [following.followed_id], (e, followeds, fields) => {
                        if (err || e) {
                            console.log(err);
                            res.sendStatus(500)
                            reject(err)
                        }
                        if (followers.length != 0) {
                            following.follower = followers[0]
                        } else {
                            following.follower = null
                        }

                        if (followeds.length != 0) {
                            following.following = followeds[0]
                        } else {
                            following.following = null
                        }
                        resolve("Ok")
                    })
                })
            }))
        }

        Promise.all(promises).then(() => {
            res.status(200)
            res.json(followings)
        })
    })
})

//GET user's favorite recipes
router.get("/favorite/user/:user_id", (req, res) => {
    pool.query("SELECT r.* FROM favorite f JOIN recipe r ON f.recipe_id = r.id WHERE f.user_id = ?", [req.params.user_id], (err, rows, fields) => {
        res.status(200)
        res.json(rows)
    })
})

//GET users who set a recipe as their favorite
router.get("/favorite/recipe/:recipe_id", (req, res) => {
    pool.query("SELECT u.* FROM favorite f JOIN user u ON f.user_id = u.id WHERE f.recipe_id = ?", [req.params.recipe_id], (err, rows, fields) => {
        res.status(200)
        res.json(rows)
    })
})

//GET users recipe
router.get("/recipes/:id", (req, res) => {
    pool.query("SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM user u JOIN recipe r on u.id = r.user_id LEFT JOIN experience e ON r.id = e.recipe_id WHERE u.id = ? GROUP BY r.id ", [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.status(200)
            res.json(rows)
        } else {
            res.status(500)
            res.json("error while fetching user's recipes")
        }
    })
})

//POST
//Create a new user
router.post("/insert", (req, res) => {
    const id = idGenerator.ID('au')
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (files.image) {
            var oldpath = files.image.path;
            var newFileName = uuidv4() + ".png"
            var newpath = './public/images/profile/' + newFileName
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                    return
                }
                var imageURL = "http://" + ip.address() + ":3000/public/images/profile/" + newFileName
                pool.query("INSERT INTO user(id, username, email, password, image_url) VALUES (?, ?, ?, ?, ?)",
                    [id, fields.username, fields.email, fields.password, imageURL], (err, rows, fields) => {
                        res.sendStatus(200)
                    })
            })
        } else {
            pool.query("INSERT INTO user(id, username, email, password, image_url) VALUES (?, ?, ?, ?, ?)",
                [id, fields.username, fields.email, fields.password, ""], (err, rows, fields) => {
                    res.status(200)
                    res.json("OK")
                })
        }
    });


    /*const id = idGenerator.ID('au')
    pool.query("INSERT INTO user(id, username, email, password, image_url) VALUES (?, ?, ?, ?, ?)", [
        id,
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.image_url
        ], (err, rows, fields) => {
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
            res.status(200)
            res.json({id: id})
        })*/
})

//Create a new following
router.post("/follow/:follower_id/:followed_id", (req, res) => {
    pool.query("INSERT INTO following(follower_id, followed_id) VALUES(?,?)", [req.params.follower_id, req.params.followed_id], (err, rows, fields) => {
        if (!err) {
            pool.query("SELECT * FROM user WHERE id = ?", [req.params.follower_id], (usErr, usRows) => {
                if (!usErr) {
                    const notifUser = usRows[0]
                    pool.query("SELECT * FROM devices WHERE user_id = ?", [req.params.followed_id], (devErr, devRows) => {
                        devRows.forEach(device => {
                            if(device.device_type == "ios"){
                                notificationUtil.notifyIos(notificationType.getKey("follower"), req.params.follower_id, "", device.token, notifUser.username+" is following you", 
                                notifUser.username+" just started following you. Click here to check their profile!")
                            }else{
                                notificationUtil.notifyAndroid(notificationType.getKey("follower"), req.params.follower_id, "", device.token, notifUser.username+" is following you", 
                                notifUser.username+" just started following you. Click here to check their profile!")
                            }
                        });
                    })
                }
            })
            pool.query("UPDATE user SET following = following+1 WHERE id = ?", [req.params.follower_id])
            pool.query("UPDATE user SET followers = followers+1 WHERE id = ?", [req.params.followed_id])
            res.status(204)
            res.end()
        } else {
            res.sendStatus(500)
            console.log(err)
        }
    })
})

//Put a recipe in user's favorite
router.post("/favorite/put/:user_id/:recipe_id", (req, res) => {
    pool.query("INSERT INTO favorite(user_id, recipe_id) VALUES(?, ?)", [req.params.user_id, req.params.recipe_id], (err, rows, fields) => {
        if (err) {
            res.sendStatus(500)
            console.log(err)
        } else {
            res.sendStatus(204)
        }
    })
})

//check email
router.get("/check_email/:email", (req, res) => {
    let queryString = "SELECT * FROM user WHERE email = ? AND SUBSTR(id, 1, 2) = 'au'"
    getConnection().query(queryString, [req.params.email], (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500)
            return
        }
        let result = rows.length == 0 ? false : true
        res.status(200)
        res.json({ result: result })
    })
})

function manageDevices(req, res, user) {
    pool.query("SELECT * FROM devices WHERE user_id = ?", [user.id], (devErr, devRows) => {
        if (!devErr) {
            if (devRows.length != 0 && devRows[0].token != req.body.token) {
                pool.query("UPDATE devices SET token = ? WHERE user_id = ?", [req.body.token, user.id], (err, rows) => {
                    res.status(200)
                    res.json(user)
                })
            }else{
                pool.query("INSERT INTO devices VALUES(?,?,?,?)", [req.body.uuid, user.id, req.body.token, req.body.type], (err, rows) => {
                    if(err){
                        console.log(err)
                    }
                    console.log(req.body.uuid)
                    console.log(req.body.token)
                    console.log(devRows.length)
                    res.status(200)
                    res.json(user)
                })
            }
        } else {
            res.sendStatus(500)
            console.log(devErr)
        }
    })
}

//Check if user exist (if not added him)
router.post("/social/check", (req, res) => {
    pool.query("SELECT * FROM user WHERE id = ?", [req.body.id], (err, rows, fields) => {
        if (!err) {
            console.log(rows.length)
            if (rows.length == 0) {
                pool.query("INSERT INTO user(id, email, username, password, image_url) VALUES(?,?,?,?,?)", [req.body.id, req.body.email, req.body.username, req.body.password, req.body.image_url], (er) => {
                    if (!err) {
                        pool.query("SELECT * FROM user WHERE id = ?", [req.body.id], (err, rows, fields) => {
                            if (!err) {
                                manageDevices(req, res, rows[0])
                            } else {
                                res.status(500)
                                res.json("Error getting user after insert")
                            }
                        })
                    } else {
                        res.status(500)
                        res.json("Error inserting user")
                    }
                })
            } else {
                pool.query("UPDATE user SET(email = ?, username = ?, password = ?, image_url = ?) WHERE id = ?", [req.body.email, req.body.username, req.body.password, req.body.imageurl, req.body.id], (er) => {
                    if (!err) {
                        pool.query("SELECT * FROM user WHERE id = ?", [req.body.id], (err, rows, fields) => {
                            if (!err) {
                                manageDevices(req, res, rows[0])
                            } else {
                                res.status(500)
                                res.json("Error getting user after insert")
                            }
                        })
                    } else {
                        res.status(500)
                        res.json("Error updating user")
                    }
                })
            }
        } else {
            res.status(500)
            res.json("error in selecting user")
        }
    })
})


//PUT
//Update User
router.post("/update", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var query = "UPDATE user SET"
        if (fields.username != "") {
            query += " username = '" + fields.username + "',"
        }
        if (fields.email != "") {
            query += " email = '" + fields.email + "',"
        }
        if (fields.password != "") {
            query += " password = '" + fields.password + "',"
        }
        var imageURL = ""
        if (files.image) {
            var oldpath = files.image.path;
            var newFileName = uuidv4() + ".png"
            var newpath = './public/images/profile/' + newFileName
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                    return
                }
                pool.query("SELECT * FROM user WHERE id = ?", [fields.id], (e, r) => {
                    var user = r[0]
                    if (user.image_url != "") {
                        fs.unlink("." + user.image_url.slice(-63), function (fse) { })
                    }
                })
                imageURL = "http://" + ip.address() + ":3000/public/images/profile/" + newFileName
                if (imageURL != "") {
                    query += " image_url = '" + imageURL + "'"
                }
                query += " WHERE id = ?"
                pool.query(query, [fields.id], (err, rows, fields) => {
                    res.sendStatus(200)
                })
            })
        } else {
            query = (query.slice(-1) == "," ? query.substring(0, query.length - 1) : query) + " WHERE id = ?"
            pool.query(query, [fields.id], (err, rows, fields) => {
                res.status(200)
                res.json("OK")
            })
        }
    });
})

//DELETE
//delete a user by id
router.delete("/delete/:id", (req, res) => {
    const queryString = "SELECT r.image_url as recipe_image, s.image_url as step_image, e.image_url as e_image, ex.image_url as ex_image, u.image_url as user_image FROM step s JOIN recipe r ON s.recipe_id = r.id JOIN user u ON r.user_id = u.id LEFT JOIN experience e ON e.user_id = u.id LEFT JOIN experience ex ON r.id = ex.recipe_id WHERE u.id = ?"
    getConnection().query(queryString, [req.params.id], (err, rows) => {
        //we must delete user data in db even if there was an error deleting files
        if(err){
            console.log(err)
        }else{
            //deleting image files related to user
            let images = rows.map((row) => "./public/images/" + row.recipe_image)
            images = images.concat(rows.map((row) => "./public/images/" + row.step_image))
            images = images.concat(rows.map((row) => "./public/images/" + row.e_image))
            images = images.concat(rows.map((row) => "./public/images/" + row.ex_image))
            images = images.concat(rows.map((row) => {
                return row.user_image.replace(/http.*3000/, ".")
            }))
            let unique = [...new Set(images)]
            console.log(unique)
            unique.forEach(uri => {
                if(fs.existsSync(uri)) fs.unlinkSync(uri)
            });
        }

        //deleting recipes of user
        getConnection().query("DELETE FROM recipe WHERE user_id = ?", [req.params.id], (err) => {
            if(err){
                console.log(err)
            }
        })

        //deleting devices of user
        getConnection().query("DELETE FROM devices WHERE user_id = ?", [req.params.id], (err) => {
            if(err){
                console.log(err)
            }
        })

        //deleting user
        getConnection().query("DELETE FROM user WHERE id = ?", [req.params.id], (err) => {
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
        })

        res.sendStatus(200)
    })
})

//Delete a following
router.delete("/unfollow/:follower_id/:followed_id", (req, res) => {
    pool.query("DELETE FROM following WHERE follower_id = ? AND followed_id = ?", [req.params.follower_id, req.params.followed_id], (err, rows, fields) => {
        if (rows.affectedRows != 0) {
            pool.query("UPDATE user SET following = following-1 WHERE id = ?", [req.params.follower_id])
            pool.query("UPDATE user SET followers = followers-1 WHERE id = ?", [req.params.followed_id])
        }
        res.sendStatus(204)
    })
})

//Remove a recipe from favorite
router.delete("/favorite/delete/:user_id/:recipe_id", (req, res) => {
    pool.query("DELETE FROM favorite WHERE user_id = ? AND recipe_id = ?", [req.params.user_id, req.params.recipe_id], (err, rows, fields) => {
        res.sendStatus(204)
    })
})

//Remove all user's favorite recipes
router.delete("/favorite/delete/:user_id", (req, res) => {
    pool.query("DELETE FROM favorite WHERE user_id = ?", [req.params.user_id], (err, rows, fields) => {
        res.sendStatus(204)
    })
})

router.post("/logout", (req, res) => {
    pool.query("DELETE FROM devices WHERE uuid = ?", [req.body.uuid], (err, rows) => {
        res.sendStatus(200)
    })
})

//Get User Cover Photo
router.get("/cover/:id", (req, res) => {
    const queryString = "SELECT r.image_url FROM recipe r left join experience e ON r.id = e.recipe_id WHERE r.user_id = ? GROUP BY r.id ORDER BY AVG(e.rating) DESC LIMIT 1"
    getConnection().query(queryString, [req.params.id], (err, rows) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }
        const imageUrl = rows.length > 0 ? rows[0].image_url : ""
        res.status(200)
        res.json(imageUrl)
    })
})

//Update profile photo
router.post("/update_photo", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        const userId = fields.user_id
        var oldpath = files.image.path
        var newFileName = uuidv4() + ".png"
        var newpath = './public/images/profile/' + newFileName
        fs.rename(oldpath, newpath, function (err) {
            if (err) {
                console.log(err)
                res.sendStatus(500)
                return
            }
            pool.query("SELECT image_url FROM user WHERE id = ?", [userId], (err, rows) => {
                let oldImageUrl = null
                if(!err){
                    oldImageUrl = rows[0].image_url
                    oldImageUrl = oldImageUrl.replace(/http.*3000/, ".")
                }
                if(oldImageUrl != null && fs.existsSync(oldImageUrl)) fs.unlinkSync(oldImageUrl)
                const ipAddress = os.networkInterfaces()["Wi-Fi"][1].address
                const imageURL = "http://" + ipAddress + ":3000/public/images/profile/" + newFileName
                pool.query("UPDATE user SET image_url = ? WHERE id = ?", [imageURL, userId], (err) => {
                    if (err) {
                        console.log(err)
                        res.sendStatus(500)
                        fs.unlinkSync(newpath)
                        return
                    }
                    res.status(200)
                    res.json(imageURL)
                })
            })
        })
    })
})

//GET user following list
router.get("/following_list/:id", (req, res) => {
    pool.query("SELECT u.*, f.date follow_date FROM following f JOIN user u ON f.followed_id = u.id WHERE f.follower_id = ? ORDER BY f.date DESC", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.send(rows)
    })
})

//GET user followers list
router.get("/follower_list/:id", (req, res) => {
    pool.query("SELECT u.*, f.date follow_date FROM following f JOIN user u ON f.follower_id = u.id WHERE f.followed_id = ? ORDER BY f.date DESC", [req.params.id], (err, rows) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.send(rows)
    })
})

//Check whether user is following other user
router.get("/is_following/:id1/:id2", (req, res) => {
    pool.query("SELECT f.* FROM following f JOIN user u ON f.follower_id = u.id WHERE f.follower_id = ? AND f.followed_id = ?", [req.params.id1, req.params.id2], (err, rows) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.send(rows.length > 0 ? true : false)
    })
})

//update user info
router.put("/update_cred/:id/:email/:username/:password", (req, res) => {
    let queryString = "UPDATE user SET username = ?, email = ?"
    if (req.params.password != "e") {
        queryString += ", password = '" + req.params.password + "'"
    }
    queryString += " WHERE id = ?"
    getConnection().query(queryString, [req.params.username, req.params.email, req.params.id], (err) => {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
    }) 
})

module.exports = router