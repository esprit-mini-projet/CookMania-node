const Router = require("express")
const mysql = require("mysql")

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
router.post("/create", (req, res) => {

    const recipeId = req.body.recipeId
    const description = req.body.description
    const time = req.body.time
    const image_url = req.body.image_url

    const queryString = "INSERT INTO step (recipe_id, description, time, image_url) VALUES (?,?,?,?)"
    getConnection().query(queryString, [recipeId, description, time, image_url], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        const stepId = rows.insertId
        //create ingedients
        const promises = []
        const ingredients = req.body.ingredients
        for(var i = 0; i < ingredients.length; i++){
            const ingredient = ingredients[i]
            promises.push(new Promise((resolve, reject) => {
                const queryString = "INSERT INTO ingredient (step_id, name, quantity, unit) VALUES (?,?,?,?)"
                getConnection().query(queryString, [stepId, ingredient.name, ingredient.quantity, ingredient.unit], (err) => {
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
            res.status(200)
            res.json({id: stepId})
        }, (err) => {
            console.log(err)
            res.sendStatus(200)
        })
    })
})

module.exports = router