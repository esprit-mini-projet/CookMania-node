const express = require('express')
const mysql = require('mysql')

const router = express.Router()

const pool = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    database: "cookmania"
})

function getConnection(){
    return pool
}

router.get('/', (req, res) => {
    //do your stuff
    res.json({
        message: "You've reached the users service :D"
    })
})


module.exports = router