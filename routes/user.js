const express = require('express')
const mysql = require('mysql')
const idGenerator = require('../utils/id_generator')
const notificationUtil = require("../utils/NotificationUtil")
const notificationType = require("../models/notificationType")

const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "cookmania",
    port: 8889,
    password: "root"
})

function getConnection(){
    return pool
}

//GET

router.post("/signin", (req, res) => {
    let queryString = "SELECT * FROM user WHERE email = ? AND password = ? AND SUBSTR(id, 1, 2) = 'au'";
    pool.query(queryString, [req.body.email, req.body.password], (err, rows, fields) => {
        if(!err){
            if(rows.length != 0){
                manageDevices(req, res, rows[0])
            }else{
                res.sendStatus(400)
            }
        }else{
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
        for(var i = 0; i < followings.length; i++){
            const following = followings[i]
            promises.push(new Promise((resolve, reject) => {
                pool.query("SELECT * FROM user WHERE id = ?", [following.follower_id], (err, followers, fields) => {
                    pool.query("SELECT * FROM user WHERE id = ?", [following.followed_id], (e, followeds, fields) => {
                        if(err || e){
                            console.log(err);
                            res.sendStatus(500)
                            reject(err)
                        }
                        if(followers.length != 0){
                            following.follower = followers[0]
                        }else{
                            following.follower = null
                        }

                        if(followeds.length != 0){
                            following.following = followeds[0]
                        }else{
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
        for(var i = 0; i < followings.length; i++){
            const following = followings[i]
            promises.push(new Promise((resolve, reject) => {
                pool.query("SELECT * FROM user WHERE id = ?", [following.follower_id], (err, followers, fields) => {
                    pool.query("SELECT * FROM user WHERE id = ?", [following.followed_id], (e, followeds, fields) => {
                        if(err || e){
                            console.log(err);
                            res.sendStatus(500)
                            reject(err)
                        }
                        if(followers.length != 0){
                            following.follower = followers[0]
                        }else{
                            following.follower = null
                        }

                        if(followeds.length != 0){
                            following.following = followeds[0]
                        }else{
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
    pool.query("SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM user u JOIN recipe r on u.id = r.user_id LEFT JOIN experience e ON r.id = e.recipe_id WHERE u.id = ? GROUP BY r.id ", [req.params.id], (err, rows, fields) => {
        if(!err){
            res.status(200)
            res.json(rows)
        }else{
            res.status(500)
            res.json("error while fetching user's recipes")
        }
    })
})

//POST
//Create a new user
router.post("/insert", (req, res) => {
    const id = idGenerator.ID('au')
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
        })
})

//Create a new following
router.post("/follow/:follower_id/:followed_id", (req, res) => {
    pool.query("INSERT INTO following(follower_id, followed_id) VALUES(?,?)", [req.params.follower_id, req.params.followed_id], (err, rows, fields) => {
        if(!err){
            pool.query("SELECT * FROM user WHERE id = ?", [req.params.follower_id], (usErr, usRows) => {
                if(!usErr){
                    const notifUser = usRows[0]
                    pool.query("SELECT * FROM devices WHERE user_id = ?", [req.params.followed_id], (devErr, devRows) => {
                        devRows.forEach(device => {
                            notificationUtil.notify(notificationType.getKey("follower"), req.params.follower_id, device.token, notifUser.username+" is following you", 
                                notifUser.username+" just started following you, click here to check his profile!")
                        });
                    })
                }
            })
            pool.query("UPDATE user SET following = following+1 WHERE id = ?", [req.params.follower_id])
            pool.query("UPDATE user SET followers = followers+1 WHERE id = ?", [req.params.followed_id])
            res.status(204)
            res.end()
        }else{
            res.sendStatus(500)
            console.log(err)
        }
    })
})

//Put a recipe in user's favorite
router.post("/favorite/put/:user_id/:recipe_id", (req, res) => {
    pool.query("INSERT INTO favorite(user_id, recipe_id) VALUES(?, ?)", [req.params.user_id, req.params.recipe_id], (err, rows, fields) => {
        if(err){
            res.sendStatus(500)
            console.log(err)
        }else{
            res.sendStatus(204)
        }
    })
})

//check email
router.get("/check_email/:email", (req, res) => {
    let queryString = "SELECT * FROM user WHERE email = ? AND SUBSTR(id, 1, 2) = 'au'"
    getConnection().query(queryString, [req.params.email], (err, rows) => {
        if(err){
            console.log(err);
            res.sendStatus(500)
            return
        }
        let result = rows.length == 0 ? false : true
        res.status(200)
        res.json({result:result})
    })
})

function manageDevices(req, res, user){
    pool.query("SELECT * FROM devices WHERE user_id = ?", [user.id], (devErr, devRows) => {
        if(!devErr){
            if(devRows.length != 0 && devRows[0].token != req.body.token){
                pool.query("UPDATE devices SET token = ?", [req.body.token], (err, rows) => {
                    res.status(200)
                    res.json(user)
                })
            }else{
                pool.query("INSERT INTO devices VALUES(?,?,?)", [req.body.uuid, user.id, req.body.token], (err, rows) => {
                    console.log(req.body.uuid)
                    console.log(req.body.token)
                    console.log(devRows.length)
                    res.status(200)
                    res.json(user)
                })
            }
        }else{
            res.sendStatus(500)
            console.log(devErr)
        }
    })
}

//Check if user exist (if not added him)
router.post("/social/check", (req, res) => {
    pool.query("SELECT * FROM user WHERE id = ?", [req.body.id], (err, rows, fields) => {
        if(!err){
            console.log(rows.length)
            if(rows.length == 0){
                pool.query("INSERT INTO user(id, email, username, password, image_url) VALUES(?,?,?,?,?)", [req.body.id, req.body.email, req.body.username, req.body.password, req.body.image_url], (er) => {
                    if(!err){
                        pool.query("SELECT * FROM user WHERE id = ?", [req.body.id], (err, rows, fields) => {
                            if(!err){
                                manageDevices(req, res, rows[0])
                            }else{
                                res.status(500)
                                res.json("Error getting user after insert")
                            }
                        })
                    }else{
                        res.status(500)
                        res.json("Error inserting user")
                    }
                })
            }else{
                pool.query("UPDATE user SET(email = ?, username = ?, password = ?, image_url = ?) WHERE id = ?", [req.body.email, req.body.username, req.body.password, req.body.imageurl, req.body.id], (er) => {
                    if(!err){
                        pool.query("SELECT * FROM user WHERE id = ?", [req.body.id], (err, rows, fields) => {
                            if(!err){
                                manageDevices(req, res, rows[0])
                            }else{
                                res.status(500)
                                res.json("Error getting user after insert")
                            }
                        })
                    }else{
                        res.status(500)
                        res.json("Error updating user")
                    }
                })
            }
        }else{
            res.status(500)
            res.json("error in selecting user")
        }
    })
})


//PUT
//Update User
router.put("/update/:id", (req, res) => {
    pool.query("UPDATE user SET username = ?, email = ?, password = ?, image_url = ? WHERE id = ?", [
        req.body.username,
        req.body.email,
        req.body.password,
        req.body.image_url,
        req.params.id
    ], (err, rows, fields) => {
        res.sendStatus(204)
    })
})

//DELETE
//delete a user by id
router.delete("/delete/:id", (req, res) => {
    pool.query("DELETE FROM user WHERE id = ?", [
        req.params.id
    ], (err, rows, fields) => {
        res.sendStatus(204)
    })
})

//Delete a following
router.delete("/unfollow/:follower_id/:followed_id", (req, res) => {
    pool.query("DELETE FROM following WHERE follower_id = ? AND followed_id = ?", [req.params.follower_id, req.params.followed_id], (err, rows, fields) => {
        if(rows.affectedRows != 0){
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

module.exports = router