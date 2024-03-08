const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon, products, total, address } = req.body
    const createData = { products, total, orderBy: _id, address }
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        if (selectedCoupon) {
            createData.coupon = coupon
        }
    }
    const response = await Order.create(createData)
    return res.status(200).json({
        success: response ? true : false,
        response: response ? 'Payment success' : 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params
    const { status } = req.body
    if (!status) {
        throw new Error('Missing status')
    }
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        updatedStatus: response ? response : 'Can not update status'
    })
})

const getUserOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const response = await Order.find({ orderBy: _id })
    return res.status(200).json({
        success: response ? true : false,
        updatedStatus: response ? response : 'Something went wrong'
    })
})

const getOrders = asyncHandler(async (req, res) => {
    const response = await Order.find()
    return res.status(200).json({
        success: response ? true : false,
        updatedStatus: response ? response : 'Something went wrong'
    })
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
}