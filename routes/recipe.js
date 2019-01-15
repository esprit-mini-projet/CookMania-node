const Router = require("express")
const mysql = require("mysql")
const Label = require("../models/label")
const formidable = require("formidable")
const uuidv4 = require("uuid/v4")
var fs = require("fs")
const Unit = require("../models/unit")
const sizeOf = require("image-size")

const notificationUtil = require('../utils/NotificationUtil')
const notificationTypes = require("../models/notificationType")

const registrationToken = "d2Bq2fk2LWU:APA91bErEslobozqMeg0FWZWKMWvpvoiqkX9rqZvcuqwwP0b6UZfc1RGKDGCia49nDTq3Pa5aXQi3tOZx7V5z9imv84d8RHuBaHAqsO8GdBRcFo8jo_Nuopuo2aSnP_2e73FlrC1SaTb"
const apiToken = "AAAAS1L0_7o:APA91bGkOGPvtpxXhiUKtEqnvcVyhwqk0BUfvLYwfzDWc7vg9N7oZlVFzjN-g_DKYOqIIwqpNu1vNFfCVRBVoWJnLnItT3LMnYjyAWcotpWgr40dcubrD8yuP8XdjNvt0A1QDGB0oIBo"

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

router.get("/labels", (req, res) => {
    var labels = []
    const dict = Label.dict
    Object.keys(dict).forEach(cat => {
        var catLabels = []
        Object.keys(dict[cat]).forEach(label => {
            catLabels.push(dict[cat][label])
        })
        labels.push({category: cat, labels: catLabels})
    });
    res.json(labels)
})

router.get("/labels_flat", (req, res) => {
    var labels = []
    const dict = Label.dict
    Object.keys(dict).forEach(cat => {
        Object.keys(dict[cat]).forEach(label => {
            labels.push(dict[cat][label])
        })
    });
    res.json(labels)
})

router.get("/notify/:registration_token", (req, res) => {
    notificationUtil.notifyAndroid(notificationTypes.getKey("follower")+"", "f_1491707600961513", "au_1541965560996N3V6L", req.params.registration_token, "TEST", "THIS IS MY MESSAGE")
    res.end()
})

//add to recipe Favorite count
router.put("/addFavorites/:recipe_id", (req, res) => {
    pool.query("UPDATE recipe SET favorites = favorites + 1 WHERE id = ?", [req.params.recipe_id], (err, rows, fields) => {
        res.sendStatus(200)
    })
})

//remove from recipe Favorite count
router.put("/removeFavorites/:recipe_id", (req, res) => {
    pool.query("UPDATE recipe SET favorites = favorites - 1 WHERE id = ?", [req.params.recipe_id], (err, rows, fields) => {
        res.sendStatus(200)
    })
})

//add to recipe views count
router.put("/addViews/:recipe_id", (req, res) => {
    pool.query("UPDATE recipe SET views = views + 1 WHERE id = ?", [req.params.recipe_id], (err, rows, fields) => {
        res.sendStatus(200)
    })
})

//Get all recipes
router.get("/", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id GROUP BY r.id"
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
    const queryString = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id WHERE r.user_id = ? GROUP BY r.id ORDER BY r.date DESC"
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
    const queryString = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id GROUP BY r.id ORDER BY AVG(e.rating) DESC LIMIT 10"
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

//GET all recipies sorted by rating
router.get("/all/Top", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id GROUP BY r.id ORDER BY AVG(e.rating) DESC"
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

//Get all recipes by label
router.get("/all/:label", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(AVG(e.rating), 0) rating FROM experience e right join (select r.* from recipe r left join label_recipe l on l.recipe_id = r.id where l.label_id = ?) r ON r.id = e.recipe_id GROUP BY r.id ORDER BY AVG(e.rating) DESC"
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

//Get recipes by label
router.get("/label/:label", (req, res) => {
    const queryString = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM experience e right join (select r.* from recipe r left join label_recipe l on l.recipe_id = r.id where l.label_id = ?) r ON r.id = e.recipe_id GROUP BY r.id ORDER BY AVG(e.rating) DESC LIMIT 10"
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
        const queryString = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM experience e right join (select r.* from recipe r inner join label_recipe l on l.recipe_id = r.id where l.label_id = ?) r ON r.id = e.recipe_id GROUP BY r.id ORDER BY (IFNULL(AVG(e.rating), 0) + (r.favorites / r.views) * 5) DESC LIMIT 4"
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
    const queryString = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id WHERE r.id = ? GROUP BY r.id"
    getConnection().query(queryString, [id], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        if(rows.length == 0){
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
            recipe.user_id = rows[0].id
            const queryString = "SELECT * FROM label_recipe WHERE recipe_id = ?"
            getConnection().query(queryString, [recipe.id], (err, labels) => {
                if(err){
                    console.log(err)
                    res.sendStatus(500)
                    return
                }
                recipe.labels = labels.map((value) => {
                    return Label.getValue(value.label_id)
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
                                step.ingredients = ingredients.map((value) => {
                                    return {
                                        id: value.id,
                                        name: value.name,
                                        quantity: value.quantity,
                                        unit: Unit.dict[value.unit]
                                    }
                                })
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
                                getConnection().query(queryString, [step.id, ingredient.name, ingredient.quantity, Unit.getKey(ingredient.unit)], (err) => {
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

router.post("/similar", (req, res) => {
    var labels = JSON.parse(req.body.labels)
    console.log(labels)
    var query = "SELECT r.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM recipe r left join experience e ON r.id = e.recipe_id JOIN label_recipe l ON r.id = l.recipe_id WHERE r.id != "+req.body.recipe_id+" AND (l.label_id = "+Label.getKey(labels[0])
    labels.shift()
    labels.forEach(label => {
        query += " OR l.label_id = "+Label.getKey(label)
    })
    query += ") GROUP BY r.id ORDER BY rating DESC LIMIT 10"
    pool.query(query, (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        res.status(200)
        res.json(rows)
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
            const name = fields.name
            const description = fields.description
            const calories = fields.calories
            const servings = fields.servings
            const time = fields.time
            const user_id = fields.user_id

            const queryString = "INSERT INTO recipe(name,description,calories,servings,image_url,views,time,user_id, favorites) VALUES(?,?,?,?,?,?,?,?,?)"
            getConnection().query(queryString, [name,description,calories,servings,newFileName,0,time,user_id, 0], (err, rows) => {
                if(err){
                    console.log(err)
                    res.sendStatus(500)
                    fs.unlinkSync(newpath)
                    return
                }
                const recipeId = rows.insertId
                console.log("here comes the labels")
                console.log(recipeId)
                //create labels
                const labels = JSON.parse(fields.labels)
                console.log(labels);
                const promises = []
                for(var i = 0; i < labels.length; i++){
                    const label = Label.getKey(labels[i])
                    promises.push(new Promise((resolve, reject) => {
                        const queryString = "INSERT INTO label_recipe (recipe_id, label_id) VALUES (?,?)"
                        getConnection().query(queryString, [recipeId, label], (err) => {
                            if(err){
                                reject(err)
                            }
                            resolve("ok")
                        })
                    }))
                }
                Promise.all(promises).then(() => {
                    res.status(200)
                    res.json({
                        "id": recipeId
                    })
                    pool.query("SELECT * FROM user WHERE id = ?", [user_id], (usErr, usRows) => {
                        if(usErr){
                            console.log(usErr)
                            return
                        }
                        notifUser = usRows[0]
                        pool.query("SELECT * FROM following WHERE followed_id = ?", [user_id], (folErr, folRows) => {
                            if(folErr){
                                console.log(folErr)
                                return
                            }
                            folRows.forEach(following => {
                                pool.query("SELECT * FROM devices WHERE user_id = ?", [following.follower_id], (devErr, devRows) => {
                                    if(devErr){
                                        console.log(devErr)
                                        return
                                    }
                                    devRows.forEach(device => {
                                        if(device.device_type == "ios"){
                                            notificationUtil.notifyIos(notificationTypes.getKey("recipe")+"", recipeId+"", notifUser.id, device.token, notifUser.username +" added a new recipe",
                                                notifUser.username+" just added a new recipe! click here to check it!")
                                        }else{
                                            notificationUtil.notifyAndroid(notificationTypes.getKey("recipe")+"", recipeId+"", notifUser.id, device.token, notifUser.username +" added a new recipe",
                                                notifUser.username+" just added a new recipe! click here to check it!")
                                        }
                                    });
                                })
                            });
                        })
                    })
                }, (err) => {
                    console.log(err)
                    res.sendStatus(500)
                    fs.unlinkSync(newpath)
                    getConnection().query("DELETE FROM recipe WHERE id = ?", [recipeId])
                })
            })
        })
    })
})

//Delete recipe
router.delete("/:id", (req, res) => {
    const queryString = "SELECT image_url FROM recipe WHERE id = ?"
    getConnection().query(queryString, [req.params.id], (err, rows) => {
        if(err){
            console.log(err)
            res.sendStatus(500)
            return
        }
        var imageUrls = []
        if(rows.length > 0) imageUrls.push("./public/images/" + rows[0].image_url)
        const queryString = "SELECT image_url FROM step WHERE recipe_id = ?"
        getConnection().query(queryString, [req.params.id], (err, rows) => {
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
            imageUrls = imageUrls.concat(
                rows.filter((row) => row.image_url.length > 0)
                .map((row) => "./public/images/" + row.image_url))
            const queryString = "SELECT image_url FROM experience WHERE recipe_id = ?"
            getConnection().query(queryString, [req.params.id], (err, rows) => {
                if(err){
                    console.log(err)
                    res.sendStatus(500)
                    return
                }
                imageUrls = imageUrls.concat(
                    rows.filter((row) => row.image_url.length > 0)
                    .map((row) => "./public/images/" + row.image_url))
                console.log(imageUrls)
                imageUrls.forEach(url => {
                    if(fs.existsSync(url)){
                        fs.unlinkSync(url)
                    }  
                })
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
        })
    })
})

//Search
router.post("/search", (req, res) => {
    const name = req.body.name
    const calories = req.body.calories
    const minServings = req.body.minServings
    const maxServings = req.body.maxServings
    const labels = req.body.labels

    let queryString = "SELECT rec.*, IFNULL(AVG(e.rating), 0) rating FROM experience e RIGHT JOIN ("
    queryString += "SELECT r.* FROM recipe r LEFT JOIN label_recipe l ON r.id = l.recipe_id WHERE"
    queryString += " r.servings BETWEEN ? AND ?"
    if(labels.length > 0){
        queryString += " AND l.label_id in ("
        labels.forEach(label => {
            queryString += Label.getKey(label) + ", "
        });
        queryString = queryString.substr(0, queryString.length - 2) + ")"
    }
    switch (calories) {
        case "Low":
            queryString += " AND r.calories BETWEEN 0 AND 700"
            break;
        case "Normal":
            queryString += " AND r.calories BETWEEN 700 AND 1500"
            break;
        case "Rich":
            queryString += " AND r.calories > 1500"
            break;
    }
    if(name.length > 0){
        queryString += " AND INSTR(r.name, '" + name + "') > 0"
    }
    queryString += " GROUP BY r.id"
    queryString += ") rec ON e.recipe_id = rec.id GROUP BY rec.id"
    getConnection().query(queryString, [minServings, maxServings], (err, rows) => {
        if(err){
            res.sendStatus(500)
            console.log(err)
            return
        }
        rows = rows.map((row) => {
            const dimensions = sizeOf("public/images/" + row.image_url)
            return {
                "recipe" : row,
                "height" : dimensions.height,
                "width" : dimensions.width
            }
        })
        res.status(200)
        res.json(rows)
    })

})

router.get("/feed/:user_id", (req, res) => {
    pool.query("SELECT rec.*, IFNULL(ROUND(AVG(e.rating), 1), 0) rating FROM (SELECT r.* FROM recipe r JOIN following f ON r.user_id = f.followed_id WHERE f.follower_id = ?) rec LEFT JOIN experience e ON e.recipe_id = rec.id GROUP BY rec.id",
    [req.params.user_id], (err, rows) => {
        //getting the dimensions for each recipe image
        rows = rows.map((row) => {
            const dimensions = sizeOf("public/images/" + row.image_url)
            row.height = dimensions.height
            row.width = dimensions.width
            return row
        })
        var respRows = []
        const promises = []
        rows.forEach(row => {
            promises.push(promises.push(new Promise((resolve, reject) => {
                pool.query("SELECT * FROM user WHERE id = ?", [row.user_id], (uerr, urow) => {
                    if(uerr){
                        reject(uerr)
                        return
                    }
                    respRows.push({
                        recipe: row,
                        user: urow[0]
                    })
                    resolve("ok")
                })
            })))
        })
        Promise.all(promises).then(() => {
            respRows.sort(function (a, b) {
                return (b.recipe.date < a.recipe.date) ? -1 : 1;
            });
            res.status(200)
            res.json(respRows)
        })
    })
})

//add to recipe favorites count
router.put("/add_favorites/:recipe_id", (req, res) => {
    pool.query("UPDATE recipe SET favorites = favorites + 1 WHERE id = ?", [req.params.recipe_id], (err, rows, fields) => {
        res.sendStatus(200)
    })
})

//decrement recipe favorites count
router.put("/decrement_favorites/:recipe_id", (req, res) => {
    pool.query("UPDATE recipe SET favorites = favorites - 1 WHERE id = ?", [req.params.recipe_id], (err, rows, fields) => {
        res.sendStatus(200)
    })
})

module.exports = router