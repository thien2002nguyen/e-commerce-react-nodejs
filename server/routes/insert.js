const router = require('express').Router()
const ctrls = require('../controllers/insert')

router.post('/product', ctrls.insertProduct)
router.post('/cate', ctrls.insertCategory)

module.exports = router