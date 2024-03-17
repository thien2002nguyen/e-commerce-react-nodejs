const Order = require('../models/order')
const User = require('../models/user')
const Coupon = require('../models/coupon')
const asyncHandler = require('express-async-handler')

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { coupon, products, total, address, status, currentProduct } = req.body
    const createData = { products, total, orderBy: _id, address }
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon)
        if (selectedCoupon) {
            createData.coupon = coupon
        }
    }
    if (status) {
        createData.status = status
    }
    if (currentProduct) {
        createData.currentProduct = currentProduct
    }
    const response = await Order.create(createData)
    return res.status(200).json({
        success: response ? true : false,
        response: response ? 'Payment success' : 'Something went wrong'
    })
})

const updateStatus = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { oid } = req.params
    const { status } = req.body
    if (!status) {
        throw new Error('Missing status')
    }
    const response = await Order.findByIdAndUpdate(oid, { orderBy: _id, status }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Updated' : 'Can not update status'
    })
})

const deleteOrderByUser = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { oid } = req.params
    if (!oid) {
        throw new Error('Missing input')
    }
    const response = await Order.findByIdAndDelete(oid, { orderBy: _id })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Deleted' : 'Can not delete order'
    })
})

const deleteOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params
    if (!oid) {
        throw new Error('Missing input')
    }
    const response = await Order.findByIdAndDelete(oid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Deleted' : 'Can not delete order'
    })
})

const getUserOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formatedQueries = JSON.parse(queryString)
    const allQuery = { ...formatedQueries, orderBy: _id }
    let queryCommand = Order.find(allQuery)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_ORDER
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    try {
        const response = await queryCommand.exec()
        const counts = await Order.find(allQuery).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            data: response ? response : 'Can not get orders',
        });
    } catch {
        throw new Error('Something went wrong')
    }
})

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query }
    const excludeFields = ['limit', 'sort', 'page', 'fields']
    excludeFields.forEach(element => delete queries[element])
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchElement => `$${matchElement}`)
    const formatedQueries = JSON.parse(queryString)
    const allQuery = { ...formatedQueries }
    let queryCommand = Order.find(allQuery)
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ')
        queryCommand = queryCommand.sort(sortBy)
    }
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ')
        queryCommand = queryCommand.select(fields)
    }
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_ORDER
    const skip = (page - 1) * limit
    queryCommand.skip(skip).limit(limit)
    try {
        const response = await queryCommand.exec()
        const counts = await Order.find(allQuery).countDocuments()
        return res.status(200).json({
            success: response ? true : false,
            counts,
            data: response ? response : 'Can not get orders',
        });
    } catch {
        throw new Error('Something went wrong')
    }
})

module.exports = {
    createOrder,
    updateStatus,
    getUserOrders,
    getOrders,
    deleteOrderByUser,
    deleteOrder
}