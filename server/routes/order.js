const router = require('express').Router()
const ctrls = require('../controllers/order')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post('/', verifyAccessToken, ctrls.createOrder)
router.get('/', verifyAccessToken, ctrls.getUserOrders)
router.get('/admin', [verifyAccessToken, isAdmin], ctrls.getOrders)
router.delete('/:oid', verifyAccessToken, ctrls.deleteOrderByUser)
router.put('/status/:oid', verifyAccessToken, ctrls.updateStatus)
router.delete('/admin/:oid', [verifyAccessToken, isAdmin], ctrls.deleteOrder)

module.exports = router