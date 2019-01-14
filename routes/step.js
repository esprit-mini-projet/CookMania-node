const Router = require("express")
const mysql = require("mysql")
const formidable = require('formidable')
const uuidv4 = require('uuid/v4');
var fs = require('fs');
const Unit = require("../models/unit")

const router = Router()

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

//Get steps by recipeId
router.get("/:recipeId", (req, res) => {
    const queryString = "SELECT * FROM step WHERE recipe_id = ?"
    getConnection().query(queryString, [req.params.recipeId], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.json(rows)
    })
})

//Create step
router.post("/add", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if(files.image != undefined){
            var oldpath = files.image.path;
            var newFileName = uuidv4() + ".png"
            var newpath = './public/images/' +  newFileName
            fs.rename(oldpath, newpath, function (err) {
                if (err) {
                    console.log(err)
                    res.sendStatus(500)
                    getConnection().query("DELETE FROM recipe WHERE id = ?", [fields.recipe_id])
                    return
                }
                addStep(newFileName, fields, res)
            })
        }else{
            addStep("", fields, res)
        }
    })
})

const addStep = (fileName, fields, res) => {
    const recipeId = fields.recipe_id
    const description = fields.description
    const time = fields.time

    const queryString = "INSERT INTO step (recipe_id, description, time, image_url) VALUES (?,?,?,?)"
    getConnection().query(queryString, [recipeId, description, time, fileName], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            if(fileName != ""){
                fs.unlinkSync("./public/images/" + fileName)
            }
            getConnection().query("SELECT image_url FROM recipe WHERE id = ?", [recipeId], (err, rows) => {
                if(err){
                    console.log(err)
                    return
                }
                fs.unlinkSync("./public/images/" + rows[0].image_url)
                getConnection().query("DELETE FROM recipe WHERE id = ?", [recipeId])
            })
            return
        }
        const stepId = rows.insertId
        //create ingedients
        const promises = []
        const ingredients = JSON.parse(fields.ingredients)
        for(var i = 0; i < ingredients.length; i++){
            const ingredient = ingredients[i]
            promises.push(new Promise((resolve, reject) => {
                const queryString = "INSERT INTO ingredient (step_id, name, quantity, unit) VALUES (?,?,?,?)"
                console.log("unit: " + ingredient.unit)
                const unit = Unit.getKey(ingredient.unit)
                getConnection().query(queryString, [stepId, ingredient.name, ingredient.quantity, unit], (err) => {
                    if(err){
                        reject(err)
                    }
                    resolve("ok")
                })
            }))
        }
        Promise.all(promises).then(() => {
            res.sendStatus(200)
        }, (err) => {
            console.log(err)
            res.sendStatus(500)
            if(fileName != ""){
                fs.unlinkSync("./public/images/" + fileName)
            }
            getConnection().query("SELECT image_url FROM recipe WHERE id = ?", [recipeId], (err, rows) => {
                if(err){
                    console.log(err)
                    return
                }
                fs.unlinkSync("./public/images/" + rows[0].image_url)
                getConnection().query("DELETE FROM recipe WHERE id = ?", [recipeId])
            })
        })
    })
}

module.exports = router