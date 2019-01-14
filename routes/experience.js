const express = require('express')
const mysql = require('mysql')
const formidable = require('formidable')
const uuidv4 = require('uuid/v4');
var fs = require('fs');
const notificationUtil = require("../utils/NotificationUtil")
const notificationTypes = require("../models/notificationType")

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

router.get("/fetch/:recipeID/:userID", (req, res) => {
    pool.query("SELECT * FROM experience WHERE recipe_id = ? AND user_id = ?", [req.params.recipeID, req.params.userID], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
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
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.image.path;
      var newFileName = uuidv4() + ".png"
      var newpath = './public/images/' +  newFileName
      fs.rename(oldpath, newpath, function (err) {
        if (err) {
            console.log(err)
            res.sendStatus(500)
            return
        } 
        pool.query("INSERT INTO experience(user_id, recipe_id, rating, comment, image_url) VALUES(?, ?, ?, ?, ?)", [fields.user_id, fields.recipe_id, fields.rating, fields.comment, newFileName], (er) => {
            if(er){
                console.log(er)
                res.sendStatus(500)
                fs.unlinkSync(newpath)
                return
            }
            res.sendStatus(200)
            pool.query("SELECT * FROM devices WHERE user_id = ?", [fields.owner_id], (err, rows) => {
                if(err){
                    console.log(err)
                    return
                }
                rows.forEach(device => {
                    if(device.device_type == "ios"){
                        notificationUtil.notifyIos(
                            notificationTypes.getKey("experience")+"",
                            fields.recipe_id + "",
                            fields.user_id,
                            device.token,
                            "Someone tried your recipe!",
                            "Click to find out what they think."
                        )
                    }else{
                        notificationUtil.notifyAndroid(
                            notificationTypes.getKey("experience")+"",
                            fields.recipe_id + "",
                            fields.user_id,
                            device.token,
                            "Someone tried your recipe!",
                            "Click to find out what they think."
                        )
                    }
                });
            })
        })
      })
    });
})

router.delete("/remove/:user_id/:recipe_id", (req, res) => {
    pool.query("SELECT * FROM experience WHERE user_id = ? AND recipe_id = ?", [req.params.user_id, req.params.recipe_id], (err, rows) => {
        pool.query("DELETE FROM experience WHERE user_id = ? AND recipe_id = ?", [req.params.user_id, req.params.recipe_id], (e, r) => {
            if(e){
                console.log(e)
                res.sendStatus(500)
                return
            }
            if(rows[0].image_url != ""){
                fs.unlink("./public/images/"+rows[0].image_url, function(fse){})
            }
            res.sendStatus(200)
        })
    })
})

//Delete Experience
router.get("/delete/:recipeID/:userID", (req, res) => {
    pool.query("SELECT image_url FROM experience WHERE recipe_id = ? AND user_id = ?", [req.params.recipeID, req.params.userID], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        const imageUri = rows[0].image_url
        fs.unlinkSync("./public/images/" + imageUri)
        pool.query("DELETE FROM experience WHERE recipe_id = ? AND user_id = ?", [req.params.recipeID, req.params.userID], (err) => {
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
            res.sendStatus(200)
        })
    })
})

module.exports = router