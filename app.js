const express = require("express")
const bodyParser = require("body-parser")
const path = require("path")

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use("/public", express.static(path.join(__dirname, 'public')))

const userRoute = require("./routes/user")
const recipeRoute = require("./routes/recipe")
const stepRoute = require("./routes/step")
const experienceRoute = require('./routes/experience')

app.use("/users", userRoute)
app.use("/recipes", recipeRoute)
app.use("/steps", stepRoute)
app.use('/experiences', experienceRoute)

app.listen(3000, () => {
    console.log("Server is up and listening on port 3000...")
})