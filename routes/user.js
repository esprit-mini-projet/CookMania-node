const express = require('express')
const mysql = require('mysql')
const idGenerator = require('../utils/id_generator')

const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "cookmania_db"
})

function getConnection(){
    return pool
}

//GET

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
router.get("/following/:user_id", (req, res) => {
    pool.query("SELECT * FROM following WHERE follower_id = ?", [req.params.user_id], (err, following_rows, fie) => {
        pool.query("SELECT * FROM following WHERE followed_id = ?", [req.params.user_id], (er, followers_rows, f) => {
            res.status(200)
            res.json({following: following_rows, followers: followers_rows})
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
            res.status(200)
            res.json({id: id})
        })
})

//Create a new following
router.post("/follow/:user_id/:followed_id", (req, res) => {
    pool.query("INSERT INTO following VALUES(?,?)", [req.params.user_id, req.params.followed_id], (err, rows, fields) => {
        if(rows){
            pool.query("UPDATE user SET following = following+1 WHERE id = ?", [req.params.user_id])
            pool.query("UPDATE user SET followers = followers+1 WHERE id = ?", [req.params.followed_id])
            res.status(204)
            res.end()
        }else{
            res.status(208)
            res.end()
        }
    })
})

//Put a recipe in user's favorite
router.post("/favorite/put/:user_id/:recipe_id", (req, res) => {
    pool.query("INSERT INTO favorite(user_id, recipe_id) VALUES(?, ?)", [req.params.user_id, req.params.recipe_id], (err, rows, fields) => {
        console.log()
        if(!rows){
            res.status(208)
            res.end()
        }else{
            res.status(204)
            res.end()
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
        res.status(204)
        res.end();
    })
})


//DELETE
//delete a user by id
router.delete("/delete/:id", (req, res) => {
    pool.query("DELETE FROM user WHERE id = ?", [
        req.params.id
    ], (err, rows, fields) => {
        res.status(204)
        res.end();
    })
})

//Delete a following
router.delete("/unfollow/:user_id/:followed_id", (req, res) => {
    pool.query("DELETE FROM following WHERE follower_id = ? AND followed_id = ?", [req.params.user_id, req.params.followed_id], (err, rows, fields) => {
        if(rows.affectedRows != 0){
            pool.query("UPDATE user SET following = following-1 WHERE id = ?", [req.params.user_id])
            pool.query("UPDATE user SET followers = followers-1 WHERE id = ?", [req.params.followed_id])
        }
        res.status(204)
        res.end()
    })
})

//Remove a recipe from favorite
router.delete("/favorite/delete/:user_id/:recipe_id", (req, res) => {
    pool.query("DELETE FROM favorite WHERE user_id = ? AND recipe_id = ?", [req.params.user_id, req.params.recipe_id], (err, rows, fields) => {
        res.status(204)
        res.end()
    })
})

//Remove all user's favorite recipes
router.delete("/favorite/delete/:user_id", (req, res) => {
    pool.query("DELETE FROM favorite WHERE user_id = ?", [req.params.user_id], (err, rows, fields) => {
        res.status(204)
        res.end()
    })
})

module.exports = router