const Router = require("express")
const mysql = require("mysql")

const router = Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "cookmania"
})

function getConnection(){
    return pool
}

//Get all recipes
router.get("/", (req, res) => {
    const queryString = "SELECT * FROM recipe"
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

//Get a single recipe
router.get("/:id", (req, res) => {
    const queryString = "SELECT * FROM recipe WHERE id = ?"
    getConnection().query(queryString, [req.params.id], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
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
            recipe.user = rows[0]
            const queryString = "SELECT * FROM label_recipe WHERE recipe_id = ?"
            getConnection().query(queryString, [recipe.id], (err, labels) => {
                if(err){
                    console.log(err)
                    res.sendStatus(500)
                    return
                }
                recipe.labels = labels.map((value) => {
                    return value.label_id
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
})

//Create recipe
router.post("/create", (req, res) => {

    const name = req.body.name
    const description = req.body.description
    const calories = req.body.calories
    const servings = req.body.servings
    const imageUrl = req.body.imageUrl
    const views = req.body.views
    const time = req.body.time
    const userId = req.body.userId
    const url = req.body.url
    const steps = req.body.steps
    const labels = req.body.labels

    const queryString = "INSERT INTO recipe(name,description,calories,servings,image_url,views,time,user_id,url) VALUES(?,?,?,?,?,?,?,?,?,?)"
    getConnection().query(queryString, [name,description,calories,servings,imageUrl,views,time,userId,url], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        const recipeId = rows.insertId
        //create labels
        const promises = []
        for(var i = 0; i < labels.length; i++){
            const label = labels[i]
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
                res.status(200)
                res.json({id:recipeId})
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


module.exports = router