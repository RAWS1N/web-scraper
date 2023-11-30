const express = require('express')
const scrapeProductInformation = require('../controllers/scrapControllers')

const router = express.Router()

router.get('/scrapper',scrapeProductInformation)


module.exports = router