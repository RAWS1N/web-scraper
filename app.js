const express = require('express')
const ScrapperRoutes = require('./routes/ScrapperRoutes')

const app = express()

app.use("/",ScrapperRoutes)


module.exports = app