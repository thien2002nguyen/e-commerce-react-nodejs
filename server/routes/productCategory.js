const router = require('express').Router()
const ctrls = require('../controllers/productCategory')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', [verifyAccessToken, isAdmin], ctrls.createCategory)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getCategories)
router.put('/:pcid', [verifyAccessToken, isAdmin], ctrls.updateCategory)
router.delete('/:pcid', [verifyAccessToken, isAdmin], ctrls.deleteCategory)

module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE
// POST + PUT | body
// GET + DELETE | query // ?...&...