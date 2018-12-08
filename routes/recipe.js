const Router = require("express")
const mysql = require("mysql")
const Label = require("../models/label")
const formidable = require('formidable')
const uuidv4 = require('uuid/v4');
var fs = require('fs');

const router = Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "cookmania",
    password: "root",
    port: 8889
})

function getConnection(){
    return pool
}

//Get all recipes
router.get("/", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id GROUP BY r.id"
    getConnection().query(queryString, (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.json(rows)
    })
})

//Get recipes by user
router.get("/user/:id", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id WHERE r.user_id = ? GROUP BY r.id"
    getConnection().query(queryString, [req.params.id], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.json(rows)
    })
})

//Get top rated recipes
router.get("/top", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id GROUP BY r.id ORDER BY AVG(e.rating) DESC LIMIT 10"
    getConnection().query(queryString, (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.json(rows)
    })
})

//Get recipes by label
router.get("/label/:label", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM experience e right join (select r.* from recipe r left join label_recipe l on l.recipe_id = r.id where l.label_id = ?) r ON r.id = e.recipe_id GROUP BY r.id ORDER BY AVG(e.rating) DESC LIMIT 10"
    getConnection().query(queryString, [Label.getKey(req.params.label)], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.json(rows)
    })
})

//Get periodic suggestions
router.get("/suggestions", (req, res) => {
    const queryString = "SELECT * from periodic_suggestions"
    getConnection().query(queryString, (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        let title = rows[0].title
        let label_id = rows[0].label_id
        const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM experience e right join (select r.* from recipe r inner join label_recipe l on l.recipe_id = r.id where l.label_id = ?) r ON r.id = e.recipe_id GROUP BY r.id ORDER BY (IFNULL(AVG(e.rating), 0) + (r.favorites / r.views) * 5) DESC LIMIT 4"
        getConnection().query(queryString, [label_id], (err, rows) => {
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
            res.status(200)
            res.json({
                title: title,
                recipes: rows
            })
        })
    })
})

//Get a single recipe
router.get("/:id", (req, res) => {
    getRecipeById(req.params.id, res)
})

const getRecipeById = (id, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id WHERE r.id = ? GROUP BY r.id"
    getConnection().query(queryString, [id], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        if(rows.length == 0){
            res.sendStatus(204)
            return
        }
        let recipe = rows[0]
        //get user
        const queryString = "SELECT * FROM user WHERE id = ?"
        getConnection().query(queryString, [recipe.user_id], (err, rows) => {
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
            recipe.user_id = rows[0].id
            const queryString = "SELECT * FROM label_recipe WHERE recipe_id = ?"
            getConnection().query(queryString, [recipe.id], (err, labels) => {
                if(err){
                    console.log(err)
                    res.sendStatus(500)
                    return
                }
                recipe.labels = labels.map((value) => {
                    return Label.dict[value.label_id]
                })
                //get steps
                const queryString = "SELECT * FROM step WHERE recipe_id = ?"
                getConnection().query(queryString, [recipe.id], (err, steps) => {
                    if(err){
                        console.log(err)
                        res.sendStatus(500)
                        return
                    }
                    //get ingredients per step
                    const queryString = "SELECT * FROM ingredient WHERE step_id = ?"
                    var promises = []
                    for(var i = 0; i < steps.length; i++){
                        const step = steps[i]
                        promises.push(new Promise((resolve, reject) => {
                            getConnection().query(queryString, [step.id], (err, ingredients) => {
                                if(err){
                                    console.log(err)
                                    res.sendStatus(500)
                                    reject(err)
                                }
                                step.ingredients = ingredients
                                resolve("sucess")
                            })
                        }))
                    }
                    Promise.all(promises).then(() => {
                        recipe.steps = steps
                        res.status(200)
                        res.json(recipe)
                    }, (err) => {
                        console.log(err)
                        res.sendStatus(500)
                        return
                    })
                })
            })
        })
    })
}

//Create recipe
router.post("/create", (req, res) => {

    const name = req.body.name
    const description = req.body.description
    const calories = req.body.calories
    const servings = req.body.servings
    const imageUrl = req.body.image_url
    const time = req.body.time
    const user = req.body.user
    const steps = req.body.steps
    const labels = req.body.labels

    const queryString = "INSERT INTO recipe(name,description,calories,servings,image_url,views,time,user_id, favorites) VALUES(?,?,?,?,?,?,?,?,?)"
    getConnection().query(queryString, [name,description,calories,servings,imageUrl,0,time,user.id, 0], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        const recipeId = rows.insertId
        //create labels
        const promises = []
        for(var i = 0; i < labels.length; i++){
            const label = Label.getKey(labels[i])
            promises.push(new Promise((resolve, reject) => {
                const queryString = "INSERT INTO label_recipe (recipe_id, label_id) VALUES (?,?)"
                getConnection().query(queryString, [recipeId, label], (err) => {
                    if(err){
                        console.log(err)
                        res.sendStatus(500)
                        reject(err)
                    }
                    resolve("ok")
                })
            }))
        }
        
        Promise.all(promises).then(() => {
            //create steps
            const promises = []
            for(var i = 0; i < steps.length; i++){
                const step = steps[i]
                promises.push(new Promise((resolve, reject) => {
                    const queryString = "INSERT INTO step (recipe_id, description, time, image_url) VALUES (?,?,?,?)"
                    getConnection().query(queryString, [recipeId, step.description, step.time, step.image_url], (err, rows) => {
                        if(err){
                            console.log(err)
                            res.sendStatus(500)
                            reject(err)
                        }
                        step.id = rows.insertId
                        //create ingedients
                        const promises = []
                        const ingredients = step.ingredients
                        for(var i = 0; i < ingredients.length; i++){
                            const ingredient = ingredients[i]
                            promises.push(new Promise((resolve2, reject2) => {
                                const queryString = "INSERT INTO ingredient (step_id, name, quantity, unit) VALUES (?,?,?,?)"
                                getConnection().query(queryString, [step.id, ingredient.name, ingredient.quantity, ingredient.unit], (err) => {
                                    if(err){
                                        console.log(err)
                                        res.sendStatus(500)
                                        reject2(err)
                                    }
                                    resolve2("ok")
                                })
                            }))
                        }
                        Promise.all(promises).then(() => {
                            resolve("ok")
                        }, (err) => {
                            reject(err)
                        })
                    })
                }))
            }
            Promise.all(promises).then(() => {
                getRecipeById(recipeId, res)
            }, (err) => {
                console.log(err)
                res.sendStatus(500)
            })
        }, (err) => {
            console.log(err)
            res.sendStatus(500)
        })
    })
})

//Delete recipe
router.delete("/:id", (req, res) => {
    const queryString = "DELETE FROM recipe WHERE id = ?"
    getConnection().query(queryString, [req.params.id], (err) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.sendStatus(204)
    })
})

module.exports = router