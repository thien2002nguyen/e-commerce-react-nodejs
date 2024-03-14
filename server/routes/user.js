const router = require('express').Router()
const ctrls = require('../controllers/user')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')
const uploader = require('../config/cloudinary.config')

router.post('/register', ctrls.register)
router.get('/finalregister/:token', ctrls.finalRegister)
router.post('/login', ctrls.login)
router.get('/current', verifyAccessToken, ctrls.getCurrent)
router.post('/refreshtoken', ctrls.refreshAccessToken)
router.get('/logout', ctrls.logout)
router.post('/forgotpassword', ctrls.forgotPassword)
router.put('/resetpassword', ctrls.resetPassword)
router.get('/', [verifyAccessToken, isAdmin], ctrls.getUsers)
router.put('/current', verifyAccessToken, uploader.single('avatar'), ctrls.updateUser)
router.put('/cart', verifyAccessToken, ctrls.updateCart)
router.put('/address', verifyAccessToken, ctrls.updateUserAddress)
router.put('/updatecart', verifyAccessToken, ctrls.updateProductCart)
router.delete('/:uid', [verifyAccessToken, isAdmin], ctrls.deleteUser)
router.put('/:uid', [verifyAccessToken, isAdmin], ctrls.updateUserByAdmin)
router.put('/wishlist/:pid', verifyAccessToken, ctrls.updateWishlist)
router.delete('/removecart/:pid/:color', verifyAccessToken, ctrls.removeProductInCart)

module.exports = router

//CRUD | Create - Read - Update - Delete | POST - GET - PUT - DELETE
// POST + PUT | body
// GET + DELETE | query // ?...&...