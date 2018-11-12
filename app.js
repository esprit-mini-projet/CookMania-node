const express = require("express")
const bodyParser = require("body-parser")

const app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const userRoute = require("./routes/user")
const recipeRoute = require("./routes/recipe")
const stepRoute = require("./routes/step")

app.use("/users", userRoute)
app.use("/recipes", recipeRoute)
app.use("/steps", stepRoute)

app.listen(3000, () => {
    console.log("Server is up and listening on port 3000...")
})