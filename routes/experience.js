const express = require('express')
const mysql = require('mysql')

const router = express.Router()

const pool = mysql.createPool({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'cookmania'
})

function getConnection(){
    return pool
}

router.get("/fetch/:recipeID/:userID", (req, res) => {
    pool.query("SELECT * FROM experience WHERE recipe_id = ? AND user_id = ?", [req.params.recipeID, req.params.userID], (err, rows, fields) => {
        res.status(200)
        res.json(rows)
    })
})

router.get("/user/:userID", (req, res) => {
    pool.query("SELECT * FROM experience WHERE user_id = ?", [req.params.userID], (err, rows, field) => {
        res.status(200)
        res.json(rows)
    })
})

router.get("/recipe/:recipeID", (req, res) => {
    pool.query("SELECT * FROM experience WHERE recipe_id = ?", [req.params.recipeID], (err, experiences, fields) => {
        const promises = []
        for(var i = 0; i < experiences.length; i++){
            const experience = experiences[i]
            promises.push(new Promise((resolve, reject) => {
                pool.query("SELECT * FROM user WHERE id = ?", [experience.user_id], (err, users, fields) => {
                    if(err){
                        console.log(err);
                        res.sendStatus(500)
                        reject(err)
                    }
                    if(users.length != 0){
                        experience.user = users[0]
                        resolve("Ok")
                    }
                })
            }))
        }
        
        Promise.all(promises).then(() => {
            res.status(200)
            res.json(experiences)
        })
    })
})

router.post("/add", (req, res) => {
    pool.query("INSERT INTO experience(user_id, recipe_id, rating, comment, image_url) VALUES(?, ?, ?, ?, ?)", [req.body.user_id, req.body.recipe_id, req.body.rating, req.body.comment, req.body.image_url], (err, rows, fields) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(200)
    })
})

module.exports = router